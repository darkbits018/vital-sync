import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellDot } from 'lucide-react';
import { BackendNotification } from '../../services/notificationsApiService';

interface NotificationBellProps {
  notifications: BackendNotification[];
  unreadCount: number;
  onMarkRead: (ids?: string[]) => void;
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationBell({ notifications, unreadCount, onMarkRead }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const badgeLabel = unreadCount > 99 ? '99+' : String(unreadCount);

  function handleNotificationClick(n: BackendNotification) {
    if (!n.is_read) onMarkRead([n.id]);
    if (n.action_url) window.location.href = n.action_url;
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
        title="Notifications"
      >
        {unreadCount > 0 ? (
          <BellDot size={16} className="text-white" />
        ) : (
          <Bell size={16} className="text-white" />
        )}

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {badgeLabel}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <span className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={() => { onMarkRead(); setOpen(false); }}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                You're all caught up 🎉
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex gap-3 items-start ${
                    !n.is_read ? 'bg-purple-50 dark:bg-purple-900/10' : ''
                  }`}
                >
                  {/* Unread dot */}
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    !n.is_read ? 'bg-purple-500' : 'bg-transparent'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${!n.is_read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                      {timeAgo(n.created_at)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
