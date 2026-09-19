import crypto from 'node:crypto';
import type { 
  User, Profile, Project, MarketplaceListing, Auction, 
  Bid, CommunityPost, Notification, Challenge 
} from '../src/types.js';

interface StoredUser extends User {
  passwordHash: string;
  passwordSalt: string;
}

class StorageEngine {
  private users: Map<string, StoredUser> = new Map();
  private sessions: Map<string, string> = new Map(); // token -> userId
  private profiles: Map<string, Profile> = new Map(); // userId -> Profile
  private projects: Map<string, Project> = new Map();
  private listings: Map<string, MarketplaceListing> = new Map();
  private auctions: Map<string, Auction> = new Map();
  private bids: Map<string, Bid[]> = new Map(); // auctionId -> bids
  private posts: Map<string, CommunityPost> = new Map();
  private notifications: Map<string, Notification[]> = new Map(); // userId -> notifications

  // Strictly NO FAKE DATA initialized.
  constructor() {
    // Initialized empty as requested: zero fake users, zero fake stats, zero fake listings.
  }

  // USER & AUTH
  findUserByEmail(email: string): StoredUser | undefined {
    const normalized = email.toLowerCase().trim();
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === normalized) return u;
    }
    return undefined;
  }

  findUserByUsername(username: string): StoredUser | undefined {
    const normalized = username.toLowerCase().trim();
    for (const u of this.users.values()) {
      if (u.username.toLowerCase() === normalized) return u;
    }
    return undefined;
  }

  findUserById(id: string): StoredUser | undefined {
    return this.users.get(id);
  }

  createUser(params: {
    username: string;
    email: string;
    displayName: string;
    passwordHash: string;
    passwordSalt: string;
    avatarUrl?: string;
  }): { user: User; profile: Profile } {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const newUser: StoredUser = {
      id,
      username: params.username.trim(),
      email: params.email.toLowerCase().trim(),
      displayName: params.displayName.trim() || params.username.trim(),
      role: 'developer',
      avatarUrl: params.avatarUrl || '',
      createdAt: now,
      isVerified: true,
      passwordHash: params.passwordHash,
      passwordSalt: params.passwordSalt,
    };

    const newProfile: Profile = {
      id: crypto.randomUUID(),
      userId: id,
      username: newUser.username,
      displayName: newUser.displayName,
      bio: '',
      avatarUrl: newUser.avatarUrl || '',
      bannerUrl: '',
      robloxUsername: '',
      robloxVerified: false,
      discordUsername: '',
      discordVerified: false,
      joinDate: now,
      reputationScore: 0,
    };

    this.users.set(id, newUser);
    this.profiles.set(id, newProfile);

    // Initial system notification for the user
    this.addNotification(id, {
      type: 'system',
      title: 'Welcome to TradeForge',
      message: 'Your account is active. Connect your Roblox and Discord handles in Settings to start trading and showcasing work.',
      link: '/settings',
    });

    const { passwordHash: _, passwordSalt: __, ...publicUser } = newUser;
    return { user: publicUser, profile: newProfile };
  }

  createSession(userId: string, token: string): void {
    this.sessions.set(token, userId);
  }

  getUserIdBySession(token: string): string | undefined {
    return this.sessions.get(token);
  }

  deleteSession(token: string): void {
    this.sessions.delete(token);
  }

  // PROFILES
  getProfileByUserId(userId: string): Profile | undefined {
    return this.profiles.get(userId);
  }

  getProfileByUsername(username: string): Profile | undefined {
    const normalized = username.toLowerCase().trim();
    for (const p of this.profiles.values()) {
      if (p.username.toLowerCase() === normalized) return p;
    }
    return undefined;
  }

  getAllDevelopers(): Profile[] {
    return Array.from(this.profiles.values());
  }

  updateProfile(userId: string, updates: Partial<Profile>): Profile | undefined {
    const profile = this.profiles.get(userId);
    if (!profile) return undefined;

    const updated = { ...profile, ...updates };
    this.profiles.set(userId, updated);

    // Sync with User displayName/avatar
    const user = this.users.get(userId);
    if (user) {
      if (updates.displayName) user.displayName = updates.displayName;
      if (updates.avatarUrl !== undefined) user.avatarUrl = updates.avatarUrl;
      if (updates.bannerUrl !== undefined) user.bannerUrl = updates.bannerUrl;
    }

    return updated;
  }

  // PROJECTS
  getProjects(): Project[] {
    return Array.from(this.projects.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'likesCount' | 'viewsCount'>): Project {
    const id = crypto.randomUUID();
    const newProject: Project = {
      ...project,
      id,
      likesCount: 0,
      viewsCount: 1,
      createdAt: new Date().toISOString(),
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  // MARKETPLACE
  getListings(): MarketplaceListing[] {
    return Array.from(this.listings.values())
      .filter((l) => l.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createListing(listing: Omit<MarketplaceListing, 'id' | 'createdAt' | 'status'>): MarketplaceListing {
    const id = crypto.randomUUID();
    const newListing: MarketplaceListing = {
      ...listing,
      id,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    this.listings.set(id, newListing);
    return newListing;
  }

  // AUCTIONS
  getAuctions(): Auction[] {
    return Array.from(this.auctions.values())
      .filter((a) => a.status === 'active')
      .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
  }

  createAuction(auction: Omit<Auction, 'id' | 'createdAt' | 'currentBid' | 'bidsCount' | 'status'>): Auction {
    const id = crypto.randomUUID();
    const newAuction: Auction = {
      ...auction,
      id,
      currentBid: auction.startingBid,
      bidsCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    this.auctions.set(id, newAuction);
    this.bids.set(id, []);
    return newAuction;
  }

  placeBid(auctionId: string, bidder: { id: string; username: string }, amount: number): { success: boolean; error?: string; auction?: Auction } {
    const auction = this.auctions.get(auctionId);
    if (!auction) return { success: false, error: 'Auction not found' };
    if (auction.status !== 'active') return { success: false, error: 'Auction is no longer active' };
    if (auction.sellerId === bidder.id) return { success: false, error: 'You cannot bid on your own auction' };

    const minRequired = auction.bidsCount === 0 ? auction.startingBid : auction.currentBid + auction.minBidIncrement;
    if (amount < minRequired) {
      return { success: false, error: `Bid must be at least ${minRequired} Robux` };
    }

    auction.currentBid = amount;
    auction.highestBidderId = bidder.id;
    auction.highestBidderUsername = bidder.username;
    auction.bidsCount += 1;

    const bidList = this.bids.get(auctionId) || [];
    bidList.push({
      id: crypto.randomUUID(),
      auctionId,
      bidderId: bidder.id,
      bidderUsername: bidder.username,
      amount,
      createdAt: new Date().toISOString(),
    });
    this.bids.set(auctionId, bidList);

    // Notify seller
    this.addNotification(auction.sellerId, {
      type: 'auction',
      title: 'New Bid on Your Auction',
      message: `${bidder.username} placed a bid of ${amount} Robux on "${auction.itemTitle}".`,
      link: '/auctions',
    });

    return { success: true, auction };
  }

  // COMMUNITY POSTS
  getPosts(section?: string): CommunityPost[] {
    let list = Array.from(this.posts.values());
    if (section && section !== 'All') {
      list = list.filter((p) => p.section.toLowerCase() === section.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createPost(post: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'viewsCount'>): CommunityPost {
    const id = crypto.randomUUID();
    const newPost: CommunityPost = {
      ...post,
      id,
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 1,
      createdAt: new Date().toISOString(),
    };
    this.posts.set(id, newPost);
    return newPost;
  }

  likePost(postId: string): CommunityPost | undefined {
    const post = this.posts.get(postId);
    if (!post) return undefined;
    post.likesCount += 1;
    return post;
  }

  // NOTIFICATIONS
  getNotifications(userId: string): Notification[] {
    return this.notifications.get(userId) || [];
  }

  addNotification(userId: string, notif: Omit<Notification, 'id' | 'userId' | 'createdAt' | 'read'>): void {
    const list = this.notifications.get(userId) || [];
    list.unshift({
      ...notif,
      id: crypto.randomUUID(),
      userId,
      read: false,
      createdAt: new Date().toISOString(),
    });
    this.notifications.set(userId, list);
  }

  markAllNotificationsRead(userId: string): void {
    const list = this.notifications.get(userId) || [];
    for (const n of list) n.read = true;
    this.notifications.set(userId, list);
  }

  markNotificationRead(userId: string, notificationId: string): void {
    const list = this.notifications.get(userId) || [];
    const item = list.find((n) => n.id === notificationId);
    if (item) item.read = true;
  }

  // CHALLENGES (No fake active challenges; returns empty list)
  getChallenges(): Challenge[] {
    return [];
  }

  // GLOBAL SEARCH
  search(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { users: [], projects: [], listings: [], auctions: [], posts: [] };

    const matchingUsers = Array.from(this.profiles.values()).filter(
      (p) => p.username.toLowerCase().includes(q) || p.displayName.toLowerCase().includes(q)
    );

    const matchingProjects = Array.from(this.projects.values()).filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
    );

    const matchingListings = Array.from(this.listings.values()).filter(
      (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)
    );

    const matchingAuctions = Array.from(this.auctions.values()).filter(
      (a) => a.itemTitle.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );

    const matchingPosts = Array.from(this.posts.values()).filter(
      (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
    );

    return {
      users: matchingUsers,
      projects: matchingProjects,
      listings: matchingListings,
      auctions: matchingAuctions,
      posts: matchingPosts,
    };
  }
}

export const storage = new StorageEngine();
