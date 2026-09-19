export type UserRole = 'member' | 'developer' | 'creator' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  bannerUrl?: string;
  createdAt: string;
  isVerified: boolean;
  robloxUsername?: string;
  discordTag?: string;
  bio?: string;
  skills?: string[];
  portfolioUrl?: string;
}

export interface Profile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  robloxUsername?: string;
  robloxVerified: boolean;
  discordUsername?: string;
  discordVerified: boolean;
  discordTag?: string;
  githubUrl?: string;
  twitterUrl?: string;
  portfolioUrl?: string;
  skills?: string[];
  badges?: string[];
  verifiedBadge?: boolean;
  joinDate: string;
  joinedAt?: string;
  reputationScore: number;
}

export interface DiscordAccount {
  id: string;
  userId: string;
  discordId: string;
  username: string;
  avatar?: string;
  connectedAt: string;
}

export interface RobloxAccount {
  id: string;
  userId: string;
  robloxId: string;
  username: string;
  verifiedAt: string;
}

export interface Project {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorAvatar?: string;
  title: string;
  description: string;
  category: 'Plugin' | 'Model' | 'Framework' | 'UI Library' | 'System' | 'Tool';
  robloxAssetUrl?: string;
  githubUrl?: string;
  tags: string[];
  likesCount: number;
  viewsCount: number;
  createdAt: string;
}

export interface Game {
  id: string;
  creatorId: string;
  creatorUsername: string;
  title: string;
  description: string;
  genre: string;
  placeId?: string;
  universeId?: string;
  visitsCount: number;
  createdAt: string;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Limited';
  description: string;
  assetType: string;
}

export type RarityLevel = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Limited';

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  sellerUsername: string;
  sellerAvatar?: string;
  title: string;
  description: string;
  category: string;
  rarity: RarityLevel;
  priceRobux: number;
  priceTF: number;
  itemType: string;
  tags: string[];
  status: 'active' | 'sold' | 'cancelled';
  createdAt: string;
}

export interface Auction {
  id: string;
  sellerId: string;
  sellerUsername: string;
  sellerAvatar?: string;
  itemTitle: string;
  itemCategory: string;
  itemRarity: RarityLevel;
  description: string;
  startingBid: number;
  currentBid: number;
  minBidIncrement: number;
  highestBidderUsername?: string;
  highestBidderId?: string;
  bidsCount: number;
  endsAt: string;
  status: 'active' | 'ended' | 'cancelled';
  createdAt: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderUsername: string;
  amount: number;
  createdAt: string;
}

export interface Trade {
  id: string;
  senderId: string;
  senderUsername: string;
  receiverId: string;
  receiverUsername: string;
  offeredItems: string[];
  requestedItems: string[];
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
}

export type NotificationType = 'trade' | 'auction' | 'community' | 'system' | 'achievement';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export type CommunitySection = 'Posts' | 'Discussions' | 'Showcases' | 'Questions' | 'Announcements';

export interface CommunityPost {
  id: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatar?: string;
  section: CommunitySection;
  title: string;
  content: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  badgeRarity: 'Bronze' | 'Silver' | 'Gold' | 'Mythic';
  points: number;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  deadline: string;
  participantsCount: number;
  submissionsCount: number;
  rewards: string;
  prize?: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}
