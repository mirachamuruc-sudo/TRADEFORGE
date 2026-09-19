import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, X, Shield, ArrowRightLeft, Flame, MessageSquare, Award, ExternalLink } from 'lucide-react';
import type { Notification, NotificationType } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { token, clearUnread, decrementUnread } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      setLoading(true);
      fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : { notifications: [] }))
        .then((data) => setNotifications(data.notifications || []))
        .finally(() => setLoading(false));
    }
  }, [isOpen, token]);

  const markAllRead = async () => {
    if (!token) return;
    try {
      await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      clearUnread();
    } catch {
      // silent
    }
  };

  const markSingleRead = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      decrementUnread();
    } catch {
      // silent
    }
  };

  if (!isOpen) return null;

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'trade':
        return <ArrowRightLeft className="w-4 h-4 text-[#FF6A00]" />;
      case 'auction':
        return <Flame className="w-4 h-4 text-[#FF3D00]" />;
      case 'community':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'system':
      default:
        return <Shield className="w-4 h-4 text-[#FF6A00]" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0D0D0D] border border-[#242424] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#242424]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF6A00]" />
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#FF6A00]/20 text-[#FF6A00] border border-[#FF6A00]/30 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#999999] hover:text-white flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Read all</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[#999999] hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-[#1A1A1A]">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#999999]">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#242424] flex items-center justify-center mx-auto mb-2 text-[#999999]">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-white">No notifications yet</p>
              <p className="text-xs text-[#999999] mt-1">
                You will receive alerts here when users bid on your auctions, interact with listings, or send messages.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.read) markSingleRead(notif.id);
                  if (notif.link) {
                    onNavigate(notif.link.replace('/', ''));
                    onClose();
                  }
                }}
                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                  notif.read ? 'bg-transparent hover:bg-[#121212]' : 'bg-[#FF6A00]/5 hover:bg-[#FF6A00]/10'
                }`}
              >
                <div className="p-2 rounded-lg bg-[#141414] border border-[#242424] flex-shrink-0 mt-0.5">
                  {getTypeIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-semibold ${notif.read ? 'text-neutral-300' : 'text-white'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-[#777777] font-mono whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#999999] mt-0.5 leading-relaxed">{notif.message}</p>
                  {notif.link && (
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#FF6A00] font-medium">
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-[#FF6A00] flex-shrink-0 mt-1.5"></span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
