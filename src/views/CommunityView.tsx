import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Heart, MessageCircle, Eye, Plus, 
  HelpCircle, Sparkles, Megaphone, Terminal, Tag 
} from 'lucide-react';
import type { CommunityPost, CommunitySection } from '../types.ts';

interface CommunityViewProps {
  onOpenCreatePost: () => void;
  onNavigate: (route: string, param?: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  onOpenCreatePost,
  onNavigate,
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activeSection, setActiveSection] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    const url = activeSection === 'All' ? '/api/community' : `/api/community?section=${activeSection}`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : { posts: [] }))
      .then((data) => setPosts(data.posts || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, [activeSection]);

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/community/${postId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likesCount: data.likesCount } : p))
        );
      }
    } catch {
      // silent
    }
  };

  const sections = [
    { id: 'All', label: 'All Feeds' },
    { id: 'Discussions', label: 'Discussions' },
    { id: 'Showcases', label: 'Showcases' },
    { id: 'Questions', label: 'Questions & Help' },
    { id: 'Posts', label: 'Posts' },
    { id: 'Announcements', label: 'Announcements' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00]"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF6A00]">Creator Forum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            TradeForge Community
          </h1>
          <p className="text-xs sm:text-sm text-[#999999] mt-1">
            Connect with Roblox developers, share prototypes, troubleshoot Luau code, and discuss trading.
          </p>
        </div>

        <button
          id="community-create-post-btn"
          onClick={onOpenCreatePost}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 hover:opacity-90 shadow-md shadow-[#FF6A00]/25 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Topic</span>
        </button>
      </div>

      {/* Sections Bar */}
      <div className="flex items-center gap-2 border-b border-[#242424] pb-3 mb-8 overflow-x-auto">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeSection === sec.id
                ? 'bg-[#181818] text-[#FF6A00] border border-[#FF6A00]/40'
                : 'text-[#999999] hover:text-white hover:bg-[#111111] border border-transparent'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Feed Content */}
      {loading ? (
        <div className="py-24 text-center text-[#999999] text-sm">
          <div className="inline-block w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin mb-3"></div>
          <div>Loading community discussions...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-24 px-4 text-center rounded-2xl bg-[#0D0D0D] border border-[#242424] max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#242424] flex items-center justify-center mx-auto mb-4 text-[#FF6A00]">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No community posts yet</h3>
          <p className="text-sm text-[#999999] max-w-md mx-auto mb-6">
            Start the conversation. Share a showcase of your latest Roblox project, ask for script help, or propose a trade.
          </p>
          <button
            id="empty-create-post-btn"
            onClick={onOpenCreatePost}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF3D00] text-white font-semibold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md shadow-[#FF6A00]/20 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Post</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-2xl bg-[#111111] border border-[#242424] hover:border-[#383838] transition-all"
            >
              {/* Header: Profile picture, Username, Timestamp */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div
                  onClick={() => onNavigate('profile', post.authorUsername)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1E1E1E] border border-[#2B2B2B] text-[#FF6A00] flex items-center justify-center font-bold text-xs overflow-hidden">
                    {post.authorAvatar ? (
                      <img src={post.authorAvatar} alt={post.authorUsername} className="w-full h-full object-cover" />
                    ) : (
                      post.authorUsername[0]?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-[#FF6A00] transition-colors">
                      {post.authorDisplayName || post.authorUsername}
                    </div>
                    <div className="text-xs text-[#999999]">@{post.authorUsername}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#777777]">
                  <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#262626] text-[#FF6A00] text-[11px]">
                    {post.section}
                  </span>
                  <span className="font-mono text-[11px]">
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Title & Content */}
              <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
              <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed mb-4 whitespace-pre-line">
                {post.content}
              </p>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#161616] text-[#888888] border border-[#242424]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer: Likes, Comments, Views */}
              <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between text-xs text-[#888888]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 hover:text-[#FF6A00] transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{post.likesCount}</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount} comments</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>{post.viewsCount} views</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Replying to topic "${post.title}". Full comment thread expansion ready for future update.`)}
                  className="text-xs text-[#FF6A00] font-medium hover:underline"
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
