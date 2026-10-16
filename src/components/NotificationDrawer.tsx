import React from 'react';
import { AppNotification } from '../types';
import { storage, playNotificationSound } from '../services/storageService';
import { X, Bell, CheckCheck, Volume2, VolumeX, Clock, Ticket, Bike, ShoppingBag } from 'lucide-react';

interface NotificationDrawerProps {
  notifications: AppNotification[];
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  currentUserId,
  isOpen,
  onClose,
  onRefresh
}) => {
  const [isSoundEnabled, setIsSoundEnabled] = React.useState(storage.isSoundEnabled());

  if (!isOpen) return null;

  const toggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    storage.setSoundEnabled(next);
    if (next) playNotificationSound();
  };

  const handleMarkAllRead = () => {
    storage.markAllNotificationsRead(currentUserId);
    onRefresh();
  };

  const handleItemClick = (n: AppNotification) => {
    if (!n.isRead) {
      storage.markNotificationAsRead(n.id);
      onRefresh();
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'coupon': return <Ticket className="w-4 h-4 text-amber-600" />;
      case 'order': return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      default: return <Bell className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-sm h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-800" />
            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            <span className="text-[11px] font-mono text-slate-500">({notifications.length})</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Audio chime toggle */}
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isSoundEnabled 
                  ? 'bg-amber-50 text-amber-800 border-amber-300' 
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
              title={isSoundEnabled ? 'Notification Sound Enabled' : 'Notification Sound Muted'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">Recent campus activity</span>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllRead}
              className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <span>No notifications yet</span>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-4 transition-colors cursor-pointer ${
                  n.isRead ? 'bg-white hover:bg-slate-50' : 'bg-amber-50/40 hover:bg-amber-50/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
