import React from 'react';
import { User, UserRole } from '../types';
import { Utensils, Bell, MapPin, UserCheck, Shield } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenAuthModal: () => void;
  onOpenLocationModal: () => void;
  selectedCity: string;
  selectedLocality: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  onSelectRole,
  activeTab,
  onNavigateTab,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenAuthModal,
  onOpenLocationModal,
  selectedCity,
  selectedLocality,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('discover')}
              className="flex items-center gap-2 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
                Mess<span className="text-amber-600">Bhojan</span>
              </span>
            </button>

            {/* City / Campus Quick Selector */}
            {currentRole === 'student' && (
              <button
                onClick={onOpenLocationModal}
                className="hidden md:flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap"
                title="Change Campus / Locality"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate max-w-[140px]">{selectedLocality === 'All Areas' ? selectedCity : selectedLocality}</span>
              </button>
            )}
          </div>

          {/* Zone 2: 4-5 Nav Links (Single line, text with hover underlines) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {currentRole === 'student' && (
              <>
                <button
                  onClick={() => onNavigateTab('discover')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'discover'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Discover Messes
                </button>
                <button
                  onClick={() => onNavigateTab('orders')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'orders'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  My Orders
                </button>
                <button
                  onClick={() => onNavigateTab('subscriptions')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'subscriptions'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Subscriptions
                </button>
                <button
                  onClick={() => onNavigateTab('coupons')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'coupons'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  My QR Tokens
                </button>
                <button
                  onClick={() => onNavigateTab('saved')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'saved'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Saved Messes
                </button>
              </>
            )}

            {currentRole === 'owner' && (
              <>
                <button
                  onClick={() => onNavigateTab('owner_orders')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'owner_orders'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Live Orders
                </button>
                <button
                  onClick={() => onNavigateTab('owner_scanner')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'owner_scanner'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Verify Coupon
                </button>
                <button
                  onClick={() => onNavigateTab('owner_meals')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'owner_meals'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Manage Meals
                </button>
                <button
                  onClick={() => onNavigateTab('owner_plans')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'owner_plans'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Subscription Plans
                </button>
                <button
                  onClick={() => onNavigateTab('owner_settings')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'owner_settings'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Mess Settings
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => onNavigateTab('admin_overview')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'admin_overview'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Platform Overview
                </button>
                <button
                  onClick={() => onNavigateTab('admin_messes')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'admin_messes'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Mess Approvals
                </button>
                <button
                  onClick={() => onNavigateTab('admin_create_owner')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'admin_create_owner'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Create Mess Account
                </button>
                <button
                  onClick={() => onNavigateTab('admin_orders')}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'admin_orders'
                      ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Orders & Payments
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role switch dropdown selector for instant testing */}
            <div className="relative flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
              <button
                onClick={() => onSelectRole('student')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentRole === 'student'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Student View"
              >
                Student
              </button>
              <button
                onClick={() => onSelectRole('owner')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentRole === 'owner'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Mess Owner View"
              >
                Mess Owner
              </button>
              <button
                onClick={() => onSelectRole('admin')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentRole === 'admin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Platform Admin View"
              >
                Admin
              </button>
            </div>

            {/* In-App Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-bold text-white leading-none">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Profile or Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('profile')}
                  className="flex items-center gap-2 py-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-4 hidden sm:block"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="py-2 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
