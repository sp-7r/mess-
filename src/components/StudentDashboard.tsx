import React, { useState } from 'react';
import { MessListing, FoodItem, Order, Subscription, Coupon, User, FilterState } from '../types';
import { storage } from '../services/storageService';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { MessCard } from './MessCard';
import { MessMapView } from './MessMapView';
import { QRCodeModal } from './QRCodeModal';
import { 
  Sparkles, Calendar, Clock, Ticket, Bike, Store, CheckCircle, 
  AlertCircle, RefreshCw, QrCode, Heart, MapPin, User as UserIcon, 
  Dumbbell, FileText, ChevronRight, PauseCircle, PlayCircle, ShieldCheck, Utensils
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: User;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  messes: MessListing[];
  savedMessIds: string[];
  orders: Order[];
  subscriptions: Subscription[];
  coupons: Coupon[];
  onSelectMess: (mess: MessListing) => void;
  onBookTrial: (mess: MessListing) => void;
  onToggleSaveMess: (messId: string) => void;
  onRefreshData: () => void;
  selectedCity: string;
  selectedLocality: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  activeTab,
  onNavigateTab,
  messes,
  savedMessIds,
  orders,
  subscriptions,
  coupons,
  onSelectMess,
  onBookTrial,
  onToggleSaveMess,
  onRefreshData,
  selectedCity,
  selectedLocality
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedCouponForQR, setSelectedCouponForQR] = useState<Coupon | null>(null);
  const [cancellingSubId, setCancellingSubId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    city: selectedCity,
    locality: selectedLocality,
    maxDistanceKm: 8,
    foodPreference: 'all',
    cuisines: [],
    maxMonthlyPrice: 4500,
    maxSingleMealPrice: 150,
    highProteinOnly: false,
    minProteinGrams: 0,
    homeDeliveryOnly: false,
    pickupOnly: false,
    trialMealAvailableOnly: false,
    highestRatedOnly: false,
    breakfastAvailable: false,
    lunchAvailable: false,
    dinnerAvailable: false,
    sortBy: 'nearest'
  });

  const handleUpdateFilters = (partial: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...partial }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      city: selectedCity,
      locality: selectedLocality,
      maxDistanceKm: 8,
      foodPreference: 'all',
      cuisines: [],
      maxMonthlyPrice: 4500,
      maxSingleMealPrice: 150,
      highProteinOnly: false,
      minProteinGrams: 0,
      homeDeliveryOnly: false,
      pickupOnly: false,
      trialMealAvailableOnly: false,
      highestRatedOnly: false,
      breakfastAvailable: false,
      lunchAvailable: false,
      dinnerAvailable: false,
      sortBy: 'nearest'
    });
  };

  // Filter messes
  const filteredMesses = messes.filter(m => {
    if (!m.approved || !m.active) return false;

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchLocality = m.locality.toLowerCase().includes(q);
      const matchSnippet = m.todayMenuSnippet.toLowerCase().includes(q);
      const matchDesc = m.description.toLowerCase().includes(q);
      if (!matchName && !matchLocality && !matchSnippet && !matchDesc) return false;
    }

    // Food preference
    if (filters.foodPreference === 'veg_only' && !m.isVegOnly) return false;
    if (filters.foodPreference === 'non_veg' && !m.hasNonVeg) return false;
    if (filters.foodPreference === 'jain' && !m.hasJain) return false;

    // High protein
    if (filters.highProteinOnly && !m.hasHighProtein) return false;

    // Cuisines
    if (filters.cuisines.includes('South Indian') && !m.hasSouthIndian) return false;
    if (filters.cuisines.includes('North Indian') && !m.hasNorthIndian) return false;

    // Monthly budget
    if (m.monthlyBasePrice > filters.maxMonthlyPrice) return false;

    // Delivery & options
    if (filters.homeDeliveryOnly && !m.homeDeliveryAvailable) return false;
    if (filters.pickupOnly && !m.pickupAvailable) return false;
    if (filters.trialMealAvailableOnly && !m.trialMealAvailable) return false;
    if (filters.highestRatedOnly && m.rating < 4.7) return false;

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price_low') return a.monthlyBasePrice - b.monthlyBasePrice;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'popular') return b.reviewCount - a.reviewCount;
    return a.id.localeCompare(b.id); // pseudo nearest
  });

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const studentOrders = orders.filter(o => o.studentId === currentUser.id);
  const activeCoupons = coupons.filter(c => c.studentId === currentUser.id && c.status === 'active');
  const pastCoupons = coupons.filter(c => c.studentId === currentUser.id && c.status !== 'active');
  const savedMesses = messes.filter(m => savedMessIds.includes(m.id));

  // Generate today's subscription coupon
  const handleGenerateDailyCoupon = (sub: Subscription, mealType: string) => {
    try {
      const coup = storage.generateDailySubscriptionCoupon(sub.id, mealType);
      onRefreshData();
      setSelectedCouponForQR(coup);
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleCancelSubscription = (subId: string) => {
    if (window.confirm('Are you sure you want to cancel this subscription? Refund will be credited as per mess policy.')) {
      storage.cancelSubscription(subId);
      onRefreshData();
      setNotificationMsg('Subscription cancelled. Refund details sent to notifications.');
      setTimeout(() => setNotificationMsg(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Dynamic Alert Banner */}
      {notificationMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* TAB 1: DISCOVER MESSES */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          {/* Active Subscription Quick Reminder Banner if student has one */}
          {activeSubscriptions.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white/90">Active Pass: {activeSubscriptions[0].messName}</div>
                  <div className="text-sm font-bold">{activeSubscriptions[0].remainingMeals} meals remaining on plan</div>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('subscriptions')}
                className="py-2 px-4 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors shrink-0 shadow-xs"
              >
                Use Today&apos;s Meal Token
              </button>
            </div>
          )}

          {/* Search, Filter & View Mode Bar */}
          <SearchAndFilterBar
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onResetFilters={handleResetFilters}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
            totalResultsCount={filteredMesses.length}
          />

          {/* Content: Map or Grid */}
          {viewMode === 'map' ? (
            <MessMapView
              messes={filteredMesses}
              userLocationName={selectedLocality === 'All Areas' ? selectedCity : selectedLocality}
              onSelectMess={onSelectMess}
              onBookTrial={onBookTrial}
            />
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {filteredMesses.length} Messes in {selectedLocality === 'All Areas' ? selectedCity : selectedLocality}
                </span>
                <span className="text-xs text-slate-400">All prices in INR (₹)</span>
              </div>

              {filteredMesses.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                  <UtensilsCrossedIcon className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-base font-bold text-slate-800">No student messes match this criteria</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try clearing or widening your dietary and distance filters to discover more food options nearby.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="py-2 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMesses.map((mess, idx) => (
                    <MessCard
                      key={mess.id}
                      mess={mess}
                      distanceKm={0.6 + (idx * 0.7)}
                      isSaved={savedMessIds.includes(mess.id)}
                      onToggleSave={onToggleSaveMess}
                      onSelectMess={onSelectMess}
                      onBookTrial={onBookTrial}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Orders & Meal Bookings</h2>
            <p className="text-xs text-slate-500 mt-0.5">Track kitchen preparation, delivery and view verified receipts.</p>
          </div>

          {studentOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <ShoppingBagIcon className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No orders yet</h4>
              <p className="text-xs text-slate-500">Book a trial meal or monthly plan to start dining.</p>
              <button
                onClick={() => onNavigateTab('discover')}
                className="py-2 px-4 bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                Find Food Near Campus
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {studentOrders.map((order) => {
                const isPaid = order.paymentStatus === 'success';
                return (
                  <div key={order.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-slate-900">#{order.orderNumber}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-0.5">{order.messName}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold capitalize ${
                          order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          order.orderStatus === 'ready_for_pickup' ? 'bg-amber-50 text-amber-900 border border-amber-300' :
                          order.orderStatus === 'dispatched' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                          order.orderStatus === 'rejected' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {order.orderStatus.replace(/_/g, ' ')}
                        </span>

                        {/* Payment Badge */}
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${
                          isPaid ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
                        }`}>
                          {isPaid ? 'PAID' : 'CASH PENDING'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Meal / Plan</span>
                        <span className="font-semibold text-slate-900">{order.planName || 'Single Meal'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Method</span>
                        <span className="capitalize font-semibold text-slate-900">{order.deliveryType} {order.deliveryAddress ? `(${order.deliveryAddress})` : ''}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Amount</span>
                        <span className="font-bold font-mono text-slate-900">₹{order.grandTotal}</span>
                      </div>
                    </div>

                    {/* Digital Coupon Action if present */}
                    {order.couponCode && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-amber-900 uppercase">Pickup Digital Token</span>
                          <div className="text-base font-mono font-bold text-slate-900">{order.couponCode}</div>
                        </div>
                        <button
                          onClick={() => {
                            const c = coupons.find(cp => cp.code === order.couponCode) || {
                              id: 'c_temp',
                              code: order.couponCode!,
                              studentId: order.studentId,
                              studentName: order.studentName,
                              messId: order.messId,
                              messName: order.messName,
                              orderId: order.id,
                              mealType: order.selectedMealType || 'Meal',
                              validityDate: order.bookingDate,
                              status: order.couponRedeemed ? 'redeemed' : 'active',
                              qrPayload: JSON.stringify({ code: order.couponCode, orderId: order.id })
                            };
                            setSelectedCouponForQR(c);
                          }}
                          className="py-1.5 px-3 bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Show QR Code</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY SUBSCRIPTIONS */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Active Meal Subscriptions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage daily meal tokens, review remaining balances, and pause passes.</p>
          </div>

          {subscriptions.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No subscriptions active</h4>
              <p className="text-xs text-slate-500">Subscribe to a monthly mess plan to save up to 25% on daily meals.</p>
              <button
                onClick={() => onNavigateTab('discover')}
                className="py-2 px-4 bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Student Plans
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {subscriptions.map((sub) => {
                const percentLeft = Math.round((sub.remainingMeals / sub.totalMeals) * 100);
                return (
                  <div key={sub.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded">
                            {sub.subscriptionNumber}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            sub.status === 'active' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {sub.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">{sub.messName}</h3>
                        <p className="text-xs text-slate-500">{sub.planName}</p>
                      </div>

                      {/* Remaining Meals Dial */}
                      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
                        <div className="text-right">
                          <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
                            {sub.remainingMeals} <span className="text-xs text-slate-400 font-sans font-normal">/ {sub.totalMeals}</span>
                          </div>
                          <span className="text-[11px] text-slate-500">Meals Remaining</span>
                        </div>
                        <div className="w-10 h-10 rounded-full border-4 border-amber-500 border-t-amber-200 flex items-center justify-center font-mono font-bold text-[10px] text-amber-900">
                          {percentLeft}%
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentLeft}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                        <span>Valid From: {sub.startDate}</span>
                        <span>Valid Till: {sub.endDate}</span>
                      </div>
                    </div>

                    {/* Daily Action: Generate Today's Coupon */}
                    {sub.status === 'active' && sub.remainingMeals > 0 && (
                      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-xs font-bold text-amber-900">Redeem Today&apos;s Meal Token</h4>
                          <p className="text-xs text-slate-600">Select lunch or dinner to generate a fresh QR token for counter dining.</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleGenerateDailyCoupon(sub, 'Lunch')}
                            className="py-2 px-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                          >
                            Generate Lunch QR
                          </button>
                          <button
                            type="button"
                            onClick={() => handleGenerateDailyCoupon(sub, 'Dinner')}
                            className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                          >
                            Generate Dinner QR
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Redemption History */}
                    {sub.redemptionHistory && sub.redemptionHistory.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                          Recent Redemptions Log
                        </span>
                        <div className="divide-y divide-slate-100 text-xs text-slate-600 max-h-36 overflow-y-auto pr-1">
                          {sub.redemptionHistory.map((red) => (
                            <div key={red.id} className="py-2 flex items-center justify-between">
                              <span className="font-medium text-slate-900">{red.mealType} at counter</span>
                              <span className="text-slate-500">{new Date(red.redeemedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="font-mono text-emerald-700 font-semibold">{red.couponCode}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subscription Footer Options */}
                    {sub.status === 'active' && (
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Auto-renewal: Off</span>
                        <button
                          type="button"
                          onClick={() => handleCancelSubscription(sub.id)}
                          className="text-rose-600 hover:text-rose-700 font-medium"
                        >
                          Cancel / Refund Request
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MY QR TOKENS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Digital Meal Tokens</h2>
            <p className="text-xs text-slate-500 mt-0.5">Show these scannable QR tokens at the mess counter for instant food collection.</p>
          </div>

          {activeCoupons.length === 0 && pastCoupons.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No tokens generated</h4>
              <p className="text-xs text-slate-500">Tokens are automatically generated when you book a meal or claim a daily pass.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Tokens */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                  Available for Redemption Today ({activeCoupons.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCoupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      onClick={() => setSelectedCouponForQR(coupon)}
                      className="p-5 bg-white rounded-3xl border-2 border-amber-400 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider font-mono">
                          {coupon.mealType}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">{coupon.messName}</h4>
                        <div className="text-2xl font-mono font-bold tracking-widest text-slate-900 mt-1">
                          {coupon.code}
                        </div>
                        <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Tap to enlarge QR Code
                        </span>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-700">
                        <QrCode className="w-8 h-8" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past / Redeemed Tokens */}
              {pastCoupons.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                    Redeemed Tokens History
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-70">
                    {pastCoupons.map((coupon) => (
                      <div key={coupon.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-800">{coupon.messName}</span>
                          <div className="font-mono text-slate-600">{coupon.code} · {coupon.mealType}</div>
                          <span className="text-[11px] text-slate-400">Redeemed on {new Date(coupon.redeemedAt || '').toLocaleDateString()}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold uppercase">
                          Redeemed
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SAVED MESSES */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Saved Favorite Messes</h2>
            <p className="text-xs text-slate-500 mt-0.5">Quick access to the messes you trust for your campus dining.</p>
          </div>

          {savedMesses.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Heart className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No saved messes</h4>
              <p className="text-xs text-slate-500">Click the heart icon on any mess card to bookmark it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedMesses.map((mess, idx) => (
                <MessCard
                  key={mess.id}
                  mess={mess}
                  distanceKm={0.8 + idx}
                  isSaved={true}
                  onToggleSave={onToggleSaveMess}
                  onSelectMess={onSelectMess}
                  onBookTrial={onBookTrial}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: STUDENT PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-bold font-mono">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{currentUser.name}</h3>
              <p className="text-xs text-slate-500">{currentUser.email} · {currentUser.phone}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[11px] font-semibold">
                Verified Student Account
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">College / University</label>
              <input
                type="text"
                defaultValue={currentUser.college || 'Pune Institute of Computer Technology (PICT)'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                readOnly
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Hostel Delivery Address</label>
              <textarea
                rows={2}
                defaultValue={currentUser.hostelAddress || 'Room 304, Kaveri Boys Hostel, Kothrud, Pune, Maharashtra 411038'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                readOnly
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dietary Preference</label>
              <span className="inline-block capitalize py-1.5 px-3 bg-slate-100 text-slate-800 rounded-xl font-medium">
                {currentUser.dietaryPreference || 'Vegetarian'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scannable QR Token Modal */}
      {selectedCouponForQR && (
        <QRCodeModal
          coupon={selectedCouponForQR}
          onClose={() => setSelectedCouponForQR(null)}
        />
      )}
    </div>
  );
};

// Simple Fallback Icons for empty states
function UtensilsCrossedIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Utensils {...props} />;
}
function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Store {...props} />;
}
