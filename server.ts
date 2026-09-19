import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { storage } from './server/storage.js';
import { checkRateLimit, hashPassword, verifyPassword, generateToken, validateRegistrationInput } from './server/auth.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for profile image/banner uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper to extract session user
function getAuthUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const userId = storage.getUserIdBySession(token);
  if (!userId) return null;
  const user = storage.findUserById(userId);
  if (!user) return null;
  const { passwordHash, passwordSalt, ...publicUser } = user;
  return publicUser;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', platform: 'TradeForge', timestamp: new Date().toISOString() });
});

// System Stats (Strictly accurate to real DB records, zero fake stats)
app.get('/api/stats', (req: Request, res: Response) => {
  const developers = storage.getAllDevelopers();
  const listings = storage.getListings();
  const auctions = storage.getAuctions();
  const projects = storage.getProjects();

  res.json({
    activeDevelopersCount: developers.length,
    activeListingsCount: listings.length,
    activeAuctionsCount: auctions.length,
    communityProjectsCount: projects.length,
  });
});

// AUTHENTICATION
app.post('/api/auth/register', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const rate = checkRateLimit(ip, 15, 60000);
  if (!rate.allowed) {
    return res.status(429).json({ error: 'Too many registration attempts. Please try again in a minute.' });
  }

  const { username, displayName, email, password, confirmPassword, avatarUrl } = req.body;
  const validation = validateRegistrationInput({ username, displayName, email, password, confirmPassword });
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  if (storage.findUserByUsername(username)) {
    return res.status(409).json({ error: 'Username is already taken by another creator.' });
  }

  if (storage.findUserByEmail(email)) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const { salt, hash } = hashPassword(password);
  const { user, profile } = storage.createUser({
    username,
    displayName: displayName || username,
    email,
    passwordHash: hash,
    passwordSalt: salt,
    avatarUrl,
  });

  const token = generateToken();
  storage.createSession(user.id, token);

  return res.status(201).json({ success: true, user, profile, token });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const rate = checkRateLimit(ip, 20, 60000);
  if (!rate.allowed) {
    return res.status(429).json({ error: 'Too many login attempts. Please wait 60 seconds.' });
  }

  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: 'Email/username and password are required.' });
  }

  const user = storage.findUserByEmail(emailOrUsername) || storage.findUserByUsername(emailOrUsername);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. Please check your username and password.' });
  }

  const isValid = verifyPassword(password, user.passwordSalt, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials. Please check your username and password.' });
  }

  const token = generateToken();
  storage.createSession(user.id, token);

  const profile = storage.getProfileByUserId(user.id);
  const { passwordHash: _, passwordSalt: __, ...publicUser } = user;

  return res.json({ success: true, user: publicUser, profile, token });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    storage.deleteSession(token);
  }
  return res.json({ success: true });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const profile = storage.getProfileByUserId(user.id);
  const unreadNotifications = storage.getNotifications(user.id).filter((n) => !n.read).length;
  return res.json({ user, profile, unreadNotifications });
});

// DISCORD INTEGRATION STATUS & OAUTH CONFIG
app.get('/api/auth/discord/status', (req: Request, res: Response) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  const inviteUrl = process.env.DISCORD_INVITE_URL || 'https://discord.gg/tradeforge';

  const isConfigured = Boolean(clientId && redirectUri);

  let oauthUrl: string | null = null;
  if (isConfigured) {
    oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri!
    )}&response_type=code&scope=identify%20email%20guilds.join`;
  }

  res.json({
    isConfigured,
    inviteUrl,
    oauthUrl,
    message: isConfigured
      ? 'Discord OAuth is configured with environment credentials.'
      : 'Discord credentials (DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI) can be set in .env.example.',
  });
});

// MARKETPLACE
app.get('/api/marketplace', (req: Request, res: Response) => {
  const listings = storage.getListings();
  res.json({ listings });
});

app.post('/api/marketplace', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'You must be logged in to create a listing.' });

  const { title, description, category, rarity, priceRobux, priceTF, itemType, tags } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description, and category are required.' });
  }

  const profile = storage.getProfileByUserId(user.id);
  const listing = storage.createListing({
    sellerId: user.id,
    sellerUsername: user.username,
    sellerAvatar: profile?.avatarUrl || user.avatarUrl,
    title: title.trim(),
    description: description.trim(),
    category: category.trim(),
    rarity: rarity || 'Common',
    priceRobux: Number(priceRobux) || 0,
    priceTF: Number(priceTF) || 0,
    itemType: itemType || 'Roblox Asset',
    tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
  });

  storage.addNotification(user.id, {
    type: 'trade',
    title: 'Listing Published',
    message: `Your listing "${listing.title}" is now active in the TradeForge Marketplace.`,
    link: '/marketplace',
  });

  return res.status(201).json({ success: true, listing });
});

// AUCTIONS
app.get('/api/auctions', (req: Request, res: Response) => {
  const auctions = storage.getAuctions();
  res.json({ auctions });
});

app.post('/api/auctions', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'You must be logged in to start an auction.' });

  const { itemTitle, itemCategory, itemRarity, description, startingBid, minBidIncrement, durationHours } = req.body;
  if (!itemTitle || !description || !startingBid) {
    return res.status(400).json({ error: 'Item title, description, and starting bid are required.' });
  }

  const hours = Math.max(1, Math.min(168, Number(durationHours) || 24));
  const endsAt = new Date(Date.now() + hours * 3600 * 1000).toISOString();

  const profile = storage.getProfileByUserId(user.id);
  const auction = storage.createAuction({
    sellerId: user.id,
    sellerUsername: user.username,
    sellerAvatar: profile?.avatarUrl || user.avatarUrl,
    itemTitle: itemTitle.trim(),
    itemCategory: itemCategory || 'Rare Asset',
    itemRarity: itemRarity || 'Rare',
    description: description.trim(),
    startingBid: Math.max(1, Number(startingBid)),
    minBidIncrement: Math.max(1, Number(minBidIncrement) || 10),
    endsAt,
  });

  storage.addNotification(user.id, {
    type: 'auction',
    title: 'Auction Started',
    message: `Your auction for "${auction.itemTitle}" has begun.`,
    link: '/auctions',
  });

  return res.status(201).json({ success: true, auction });
});

app.post('/api/auctions/:id/bid', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'You must be logged in to place a bid.' });

  const { amount } = req.body;
  if (!amount || isNaN(Number(amount))) {
    return res.status(400).json({ error: 'Valid bid amount is required.' });
  }

  const result = storage.placeBid(req.params.id, { id: user.id, username: user.username }, Number(amount));
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  return res.json({ success: true, auction: result.auction });
});

// PROJECTS
app.get('/api/projects', (req: Request, res: Response) => {
  const projects = storage.getProjects();
  res.json({ projects });
});

app.post('/api/projects', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'You must be logged in to showcase a project.' });

  const { title, description, category, robloxAssetUrl, githubUrl, tags } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description, and category are required.' });
  }

  const profile = storage.getProfileByUserId(user.id);
  const project = storage.createProject({
    creatorId: user.id,
    creatorUsername: user.username,
    creatorAvatar: profile?.avatarUrl || user.avatarUrl,
    title: title.trim(),
    description: description.trim(),
    category,
    robloxAssetUrl,
    githubUrl,
    tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
  });

  storage.addNotification(user.id, {
    type: 'community',
    title: 'Project Published',
    message: `Your project "${project.title}" is published on TradeForge.`,
    link: '/explore',
  });

  return res.status(201).json({ success: true, project });
});

// COMMUNITY
app.get('/api/community', (req: Request, res: Response) => {
  const section = typeof req.query.section === 'string' ? req.query.section : undefined;
  const posts = storage.getPosts(section);
  res.json({ posts });
});

app.post('/api/community', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'You must be logged in to post in the community.' });

  const { title, content, section, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const profile = storage.getProfileByUserId(user.id);
  const post = storage.createPost({
    authorId: user.id,
    authorUsername: user.username,
    authorDisplayName: profile?.displayName || user.displayName,
    authorAvatar: profile?.avatarUrl || user.avatarUrl,
    section: section || 'Discussions',
    title: title.trim(),
    content: content.trim(),
    tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
  });

  return res.status(201).json({ success: true, post });
});

app.post('/api/community/:id/like', (req: Request, res: Response) => {
  const post = storage.likePost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  return res.json({ success: true, likesCount: post.likesCount });
});

// DEVELOPERS
app.get('/api/developers', (req: Request, res: Response) => {
  const developers = storage.getAllDevelopers();
  res.json({ developers });
});

// USER PROFILE
app.get('/api/profile/:username', (req: Request, res: Response) => {
  const profile = storage.getProfileByUsername(req.params.username);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  const user = storage.findUserById(profile.userId);
  const userProjects = storage.getProjects().filter((p) => p.creatorId === profile.userId);
  const userListings = storage.getListings().filter((l) => l.sellerId === profile.userId);
  const userPosts = storage.getPosts().filter((p) => p.authorId === profile.userId);

  return res.json({
    profile,
    userRole: user?.role || 'member',
    projects: userProjects,
    listings: userListings,
    posts: userPosts,
  });
});

// SETTINGS & PROFILE UPDATE
app.patch('/api/settings/profile', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { displayName, bio, avatarUrl, bannerUrl, robloxUsername, discordUsername, githubUrl, twitterUrl } = req.body;

  const updatedProfile = storage.updateProfile(user.id, {
    ...(displayName !== undefined ? { displayName: displayName.trim() } : {}),
    ...(bio !== undefined ? { bio: bio.trim() } : {}),
    ...(avatarUrl !== undefined ? { avatarUrl } : {}),
    ...(bannerUrl !== undefined ? { bannerUrl } : {}),
    ...(robloxUsername !== undefined ? { robloxUsername: robloxUsername.trim(), robloxVerified: Boolean(robloxUsername.trim()) } : {}),
    ...(discordUsername !== undefined ? { discordUsername: discordUsername.trim(), discordVerified: Boolean(discordUsername.trim()) } : {}),
    ...(githubUrl !== undefined ? { githubUrl: githubUrl.trim() } : {}),
    ...(twitterUrl !== undefined ? { twitterUrl: twitterUrl.trim() } : {}),
  });

  return res.json({ success: true, profile: updatedProfile });
});

// NOTIFICATIONS
app.get('/api/notifications', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const notifications = storage.getNotifications(user.id);
  res.json({ notifications });
});

app.post('/api/notifications/read-all', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  storage.markAllNotificationsRead(user.id);
  res.json({ success: true });
});

app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  storage.markNotificationRead(user.id, req.params.id);
  res.json({ success: true });
});

// CHALLENGES
app.get('/api/challenges', (req: Request, res: Response) => {
  const challenges = storage.getChallenges();
  res.json({ challenges });
});

// SEARCH
app.get('/api/search', (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  const results = storage.search(q);
  res.json(results);
});

// ----------------------------------------------------
// VITE MIDDLEWARE SETUP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TRADEFORGE Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
