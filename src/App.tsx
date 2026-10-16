import React, { useState, useEffect } from 'react';
import { User, UserRole, MessListing, MealPlan, FoodItem, Order, Subscription, Coupon, Review, AppNotification } from './types';
import { storage } from './services/storageService';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { MessOwnerDashboard } from './components/MessOwnerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { MessDetailPage } from './components/MessDetailPage';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { ReviewModal } from './components/ReviewModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { 
  Compass, ShoppingBag, Calendar, Ticket, User as UserIcon, 
  Store, QrCode, Utensils, Shield, LayoutDashboard, SlidersHorizontal 
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());
  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser?.role || 'student');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('discover');

  // Selected detail page
  const [selectedMess, setSelectedMess] = useState<MessListing | null>(null);

  // Booking / Checkout modal state
  const [bookingDetails, setBookingDetails] = useState<{
    mess: MessListing;
    plan: MealPlan;
    isTrial: boolean;
  } | null>(null);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Location
  const [selectedCity, setSelectedCity] = useState('Pune');
  const [selectedLocality, setSelectedLocality] = useState('Kothrud');

  // Database snapshot states
  const [messes, setMesses] = useState<MessListing[]>(storage.getMesses());
  const [orders, setOrders] = useState<Order[]>(storage.getOrders());
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(storage.getSubscriptions());
  const [coupons, setCoupons] = useState<Coupon[]>(storage.getCoupons());
  const [savedMessIds, setSavedMessIds] = useState<string[]>(storage.getSavedMessIds());
  const [notifications, setNotifications] = useState<AppNotification[]>(
    currentUser ? storage.getNotifications(currentUser.id) : []
  );

  const refreshAllData = () => {
    setMesses(storage.getMesses());
    setOrders(storage.getOrders());
    setSubscriptions(storage.getSubscriptions());
    setCoupons(storage.getCoupons());
    setSavedMessIds(storage.getSavedMessIds());
    if (currentUser) {
      setNotifications(storage.getNotifications(currentUser.id));
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [currentUser]);

  // Handle Role Switching
  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    setSelectedMess(null);

    if (role === 'student') {
      const student = storage.getUsers().find(u => u.role === 'student');
      if (student) {
        storage.setCurrentUser(student);
        setCurrentUser(student);
      }
      setActiveTab('discover');
    } else if (role === 'owner') {
      // Find an owner or default to mess_1 owner
      const owner = storage.getUsers().find(u => u.role === 'owner');
      if (owner) {
        storage.setCurrentUser(owner);
        setCurrentUser(owner);
      }
      setActiveTab('owner_orders');
    } else if (role === 'admin') {
      const admin = storage.getUsers().find(u => u.role === 'admin');
      if (admin) {
        storage.setCurrentUser(admin);
        setCurrentUser(admin);
      }
      setActiveTab('admin_overview');
    }
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentRole('student');
    setActiveTab('discover');
    setSelectedMess(null);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsAuthModalOpen(false);
    setSelectedMess(null);
    if (user.role === 'owner') {
      setActiveTab('owner_orders');
    } else if (user.role === 'admin') {
      setActiveTab('admin_overview');
    } else {
      setActiveTab('discover');
    }
    refreshAllData();
  };

  const handleToggleSaveMess = (messId: string) => {
    storage.toggleSaveMess(messId);
    setSavedMessIds(storage.getSavedMessIds());
  };

  const handleSelectMessToView = (mess: MessListing) => {
    setSelectedMess(mess);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBooking = (mess: MessListing, plan: MealPlan, isTrial: boolean) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setBookingDetails({ mess, plan, isTrial });
  };

  const handleOrderCompleted = (order: Order) => {
    refreshAllData();
    // Do not close immediately, allow user to view receipt/token in modal
  };

  // Get current mess for logged in owner
  const currentOwnerMess = messes.find(m => m.id === (currentUser?.ownerMessId || 'mess_1')) || messes[0];

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Universal Top Bar */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          setSelectedMess(null);
          setActiveTab(tab);
        }}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {/* If viewing a single mess detail */}
        {selectedMess ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <MessDetailPage
              mess={selectedMess}
              foodItems={storage.getFoodItems(selectedMess.id)}
              weeklyMenu={storage.getWeeklyMenuForMess(selectedMess.id)}
              mealPlans={storage.getMealPlans(selectedMess.id)}
              reviews={storage.getReviews(selectedMess.id)}
              isSaved={savedMessIds.includes(selectedMess.id)}
              currentUser={currentUser}
              onBack={() => setSelectedMess(null)}
              onToggleSave={handleToggleSaveMess}
              onSelectPlanToBook={handleStartBooking}
              onOpenReviewModal={() => setIsReviewModalOpen(true)}
            />
          </div>
        ) : (
          <>
            {/* 1. STUDENT VIEW */}
            {currentRole === 'student' && (
              <StudentDashboard
                currentUser={currentUser || storage.getUsers()[0]}
                activeTab={activeTab}
                onNavigateTab={setActiveTab}
                messes={messes}
                savedMessIds={savedMessIds}
                orders={orders}
                subscriptions={subscriptions}
                coupons={coupons}
                onSelectMess={handleSelectMessToView}
                onBookTrial={(mess) => {
                  const plans = storage.getMealPlans(mess.id);
                  const trial = plans.find(p => p.planType === 'trial') || plans[0];
                  if (trial) handleStartBooking(mess, trial, true);
                }}
                onToggleSaveMess={handleToggleSaveMess}
                onRefreshData={refreshAllData}
                selectedCity={selectedCity}
                selectedLocality={selectedLocality}
              />
            )}

            {/* 2. MESS OWNER VIEW */}
            {currentRole === 'owner' && (
              <MessOwnerDashboard
                mess={currentOwnerMess}
                activeTab={activeTab}
                onNavigateTab={setActiveTab}
                orders={orders}
                foodItems={storage.getFoodItems(currentOwnerMess.id)}
                mealPlans={storage.getMealPlans(currentOwnerMess.id)}
                weeklyMenu={storage.getWeeklyMenuForMess(currentOwnerMess.id)}
                onRefreshData={refreshAllData}
              />
            )}

            {/* 3. PLATFORM ADMIN VIEW */}
            {currentRole === 'admin' && (
              <AdminDashboard
                activeTab={activeTab}
                onNavigateTab={setActiveTab}
                messes={messes}
                orders={orders}
                subscriptions={subscriptions}
                users={storage.getUsers()}
                onRefreshData={refreshAllData}
              />
            )}
          </>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (Follows 15% Mobile Sticky Cap) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
        <div className="grid grid-cols-5 items-center h-16 px-1">
          {currentRole === 'student' && (
            <>
              <button
                onClick={() => { setSelectedMess(null); setActiveTab('discover'); }}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 ${
                  activeTab === 'discover' && !selectedMess ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <Compass className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Discover</span>
              </button>
              <button
                onClick={() => { setSelectedMess(null); setActiveTab('orders'); }}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 ${
                  activeTab === 'orders' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Orders</span>
              </button>
              <button
                onClick={() => { setSelectedMess(null); setActiveTab('subscriptions'); }}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 ${
                  activeTab === 'subscriptions' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Plans</span>
              </button>
              <button
                onClick={() => { setSelectedMess(null); setActiveTab('coupons'); }}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 ${
                  activeTab === 'coupons' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <Ticket className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Tokens</span>
              </button>
              <button
                onClick={() => { setSelectedMess(null); setActiveTab('profile'); }}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 ${
                  activeTab === 'profile' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Profile</span>
              </button>
            </>
          )}

          {currentRole === 'owner' && (
            <>
              <button
                onClick={() => setActiveTab('owner_orders')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 ${
                  activeTab === 'owner_orders' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('owner_scanner')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 ${
                  activeTab === 'owner_scanner' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Scan Token</span>
              </button>
              <button
                onClick={() => setActiveTab('owner_meals')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 ${
                  activeTab === 'owner_meals' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <Utensils className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Meals</span>
              </button>
              <button
                onClick={() => setActiveTab('owner_plans')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 ${
                  activeTab === 'owner_plans' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Plans</span>
              </button>
              <button
                onClick={() => setActiveTab('owner_settings')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 ${
                  activeTab === 'owner_settings' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <Store className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Settings</span>
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('admin_overview')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 col-span-2 ${
                  activeTab === 'admin_overview' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Platform</span>
              </button>
              <button
                onClick={() => setActiveTab('admin_messes')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 ${
                  activeTab === 'admin_messes' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <Store className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Approvals</span>
              </button>
              <button
                onClick={() => setActiveTab('admin_create_owner')}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 col-span-2 ${
                  activeTab === 'admin_create_owner' ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-1">Provision Owner</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* MODALS */}
      {/* 1. Location Selection Modal */}
      {isLocationModalOpen && (
        <LocationSelectorModal
          currentCity={selectedCity}
          currentLocality={selectedLocality}
          onSelectLocation={(city, locality) => {
            setSelectedCity(city);
            setSelectedLocality(locality);
          }}
          onClose={() => setIsLocationModalOpen(false)}
        />
      )}

      {/* 2. Authentication Modal */}
      {isAuthModalOpen && (
        <AuthModal
          initialRole={currentRole}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* 3. Checkout Modal */}
      {bookingDetails && (
        <CheckoutModal
          mess={bookingDetails.mess}
          plan={bookingDetails.plan}
          isTrial={bookingDetails.isTrial}
          currentUser={currentUser || storage.getUsers()[0]}
          onClose={() => {
            setBookingDetails(null);
            refreshAllData();
          }}
          onOrderCompleted={handleOrderCompleted}
        />
      )}

      {/* 4. Student Review Modal */}
      {isReviewModalOpen && selectedMess && (
        <ReviewModal
          mess={selectedMess}
          currentUser={currentUser || storage.getUsers()[0]}
          eligibleOrders={orders.filter(o => o.messId === selectedMess.id)}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={() => {
            setIsReviewModalOpen(false);
            refreshAllData();
          }}
        />
      )}

      {/* 5. In-App Notifications Drawer */}
      <NotificationDrawer
        notifications={notifications}
        currentUserId={currentUser ? currentUser.id : 'user_student_1'}
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onRefresh={refreshAllData}
      />
    </div>
  );
}
