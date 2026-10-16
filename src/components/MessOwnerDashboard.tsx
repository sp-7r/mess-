import React, { useState } from 'react';
import { MessListing, FoodItem, Order, Subscription, MealPlan, WeeklyMenu } from '../types';
import { storage, playNotificationSound } from '../services/storageService';
import { 
  Utensils, Store, CheckCircle, Clock, Volume2, VolumeX, AlertCircle, 
  Plus, Edit2, Trash2, QrCode, Bike, ShieldCheck, Check, X, Dumbbell, Flame, Save 
} from 'lucide-react';

interface MessOwnerDashboardProps {
  mess: MessListing;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  orders: Order[];
  foodItems: FoodItem[];
  mealPlans: MealPlan[];
  weeklyMenu?: WeeklyMenu;
  onRefreshData: () => void;
}

export const MessOwnerDashboard: React.FC<MessOwnerDashboardProps> = ({
  mess,
  activeTab,
  onNavigateTab,
  orders,
  foodItems,
  mealPlans,
  weeklyMenu,
  onRefreshData
}) => {
  const [soundEnabled, setSoundEnabled] = useState(storage.isSoundEnabled());
  const [orderFilter, setOrderFilter] = useState<'all' | 'placed' | 'preparing' | 'ready' | 'delivered'>('all');

  // Coupon Scanner State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);

  // Meal Item Modal State
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState(90);
  const [itemCategory, setItemCategory] = useState<FoodItem['category']>('Thali');
  const [itemMealType, setItemMealType] = useState<FoodItem['mealType']>('lunch');
  const [itemCuisine, setItemCuisine] = useState<FoodItem['cuisine']>('north_indian');
  const [itemIsVeg, setItemIsVeg] = useState(true);
  const [itemIsHighProtein, setItemIsHighProtein] = useState(false);
  const [itemProteinGrams, setItemProteinGrams] = useState(25);
  const [itemCalories, setItemCalories] = useState(550);
  const [itemDesc, setItemDesc] = useState('');

  // Rejection modal
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Kitchen peak hours capacity full');

  // Profile Form state
  const [messName, setMessName] = useState(mess.name);
  const [messDesc, setMessDesc] = useState(mess.description);
  const [contactPhone, setContactPhone] = useState(mess.contactPhone);
  const [deliveryRadius, setDeliveryRadius] = useState(mess.deliveryRadiusKm);
  const [deliveryFee, setDeliveryFee] = useState(mess.deliveryFee);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  const messOrders = orders.filter(o => o.messId === mess.id);
  const filteredOrders = messOrders.filter(o => {
    if (orderFilter === 'placed') return o.orderStatus === 'placed' || o.orderStatus === 'accepted';
    if (orderFilter === 'preparing') return o.orderStatus === 'preparing';
    if (orderFilter === 'ready') return o.orderStatus === 'ready_for_pickup' || o.orderStatus === 'dispatched';
    if (orderFilter === 'delivered') return o.orderStatus === 'delivered';
    return true;
  });

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    storage.setSoundEnabled(next);
    if (next) playNotificationSound();
  };

  // Status updates
  const handleOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    storage.updateOrderStatus(orderId, status);
    onRefreshData();
  };

  const handleRejectOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingOrderId) {
      storage.updateOrderStatus(rejectingOrderId, 'rejected', rejectReason);
      setRejectingOrderId(null);
      onRefreshData();
    }
  };

  const handleConfirmCash = (orderId: string) => {
    storage.confirmCashPayment(orderId);
    onRefreshData();
  };

  // Coupon verification
  const handleVerifyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = storage.redeemCoupon(couponCodeInput, mess.id, mess.name);
    setScanResult(res);
    if (res.success) {
      setCouponCodeInput('');
      onRefreshData();
    }
  };

  // Meal CRUD
  const openAddMeal = () => {
    setEditingItem(null);
    setItemName('');
    setItemPrice(90);
    setItemCategory('Thali');
    setItemMealType('lunch');
    setItemCuisine('north_indian');
    setItemIsVeg(true);
    setItemIsHighProtein(false);
    setItemProteinGrams(20);
    setItemCalories(520);
    setItemDesc('');
    setIsMealModalOpen(true);
  };

  const openEditMeal = (item: FoodItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemPrice(item.price);
    setItemCategory(item.category);
    setItemMealType(item.mealType);
    setItemCuisine(item.cuisine);
    setItemIsVeg(item.isVeg);
    setItemIsHighProtein(item.isHighProtein);
    setItemProteinGrams(item.proteinGrams);
    setItemCalories(item.calories);
    setItemDesc(item.description);
    setIsMealModalOpen(true);
  };

  const handleSaveMealItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    if (editingItem) {
      storage.updateFoodItem({
        ...editingItem,
        name: itemName,
        price: Number(itemPrice),
        category: itemCategory,
        mealType: itemMealType,
        cuisine: itemCuisine,
        isVeg: itemIsVeg,
        isHighProtein: itemIsHighProtein,
        proteinGrams: Number(itemProteinGrams),
        calories: Number(itemCalories),
        description: itemDesc
      });
    } else {
      storage.addFoodItem({
        messId: mess.id,
        name: itemName,
        price: Number(itemPrice),
        category: itemCategory,
        mealType: itemMealType,
        cuisine: itemCuisine,
        isVeg: itemIsVeg,
        isHighProtein: itemIsHighProtein,
        proteinGrams: Number(itemProteinGrams),
        calories: Number(itemCalories),
        description: itemDesc,
        isAvailable: true,
        imageUrl: mess.coverImage
      });
    }

    setIsMealModalOpen(false);
    onRefreshData();
  };

  const handleToggleItemAvailability = (item: FoodItem) => {
    storage.updateFoodItem({ ...item, isAvailable: !item.isAvailable });
    onRefreshData();
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Delete this food item from your menu?')) {
      storage.deleteFoodItem(id);
      onRefreshData();
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateMess({
      ...mess,
      name: messName,
      description: messDesc,
      contactPhone,
      deliveryRadiusKm: Number(deliveryRadius),
      deliveryFee: Number(deliveryFee)
    });
    setProfileSuccessMsg('Mess profile and operating parameters updated successfully.');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
    onRefreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Top Banner with Mess Identity & Notification Sound Toggle */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl shrink-0">
            <Store className="w-7 h-7 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ACTIVE PARTNER
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {mess.ownerUsername}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{mess.name}</h1>
            <p className="text-xs text-slate-500">{mess.address} · FSSAI {mess.fssaiNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Alert Toggle */}
          <button
            onClick={toggleSound}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
              soundEnabled
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title="Toggle incoming order audio chime"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{soundEnabled ? 'Order Alerts: Loud' : 'Order Alerts: Muted'}</span>
          </button>

          <button
            onClick={() => onNavigateTab('owner_scanner')}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <QrCode className="w-4 h-4" />
            <span>Verify Token</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: LIVE ORDERS & SUBSCRIPTIONS */}
      {activeTab === 'owner_orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Live Incoming Student Orders</h2>
              <p className="text-xs text-slate-500 mt-0.5">Accept, prepare, dispatch, and confirm student meal collections.</p>
            </div>

            {/* Filter segments */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto text-xs">
              {(['all', 'placed', 'preparing', 'ready', 'delivered'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`py-1.5 px-3 rounded-lg font-semibold capitalize whitespace-nowrap transition-all ${
                    orderFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'all' ? `All (${messOrders.length})` : st}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No active orders in this queue</h4>
              <p className="text-xs text-slate-500">Incoming student bookings will appear here instantly with an audio alert.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord) => {
                const isPaid = ord.paymentStatus === 'success';
                const isCash = ord.paymentMethod === 'cash';

                return (
                  <div key={ord.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-slate-900">#{ord.orderNumber}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-xs font-semibold text-slate-800">{ord.studentName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-xs text-slate-500 font-mono">{ord.studentPhone}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          <strong>{ord.planName || 'Meal'}</strong> · {ord.selectedMealType || 'Lunch'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Delivery vs Pickup */}
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold capitalize flex items-center gap-1">
                          {ord.deliveryType === 'delivery' ? <Bike className="w-3 h-3 text-amber-600" /> : <Store className="w-3 h-3 text-emerald-600" />}
                          {ord.deliveryType}
                        </span>

                        {/* Payment Verification Badge */}
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold ${
                          isPaid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-300'
                        }`}>
                          {isPaid ? 'PAID VERIFIED' : 'CASH PENDING'}
                        </span>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Location / Delivery Address:</span>
                        <span className="text-slate-800 font-medium">{ord.deliveryAddress || 'Mess Counter Pickup'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Digital Token:</span>
                        <span className="font-mono font-bold text-amber-800">{ord.couponCode || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Total Order Amount:</span>
                        <span className="text-base font-bold font-mono text-slate-900">₹{ord.grandTotal}</span>
                      </div>
                    </div>

                    {/* Operational Actions Strip */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">Current Status:</span>
                        <span className="font-bold capitalize text-slate-900">{ord.orderStatus.replace(/_/g, ' ')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Cash Collection Confirmation */}
                        {!isPaid && isCash && (
                          <button
                            type="button"
                            onClick={() => handleConfirmCash(ord.id)}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                          >
                            Confirm ₹{ord.grandTotal} Cash Collected
                          </button>
                        )}

                        {ord.orderStatus === 'placed' && (
                          <>
                            <button
                              type="button"
                              onClick={() => setRejectingOrderId(ord.id)}
                              className="py-1.5 px-3 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl border border-rose-200 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOrderStatus(ord.id, 'accepted')}
                              className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                            >
                              Accept Order
                            </button>
                          </>
                        )}

                        {ord.orderStatus === 'accepted' && (
                          <button
                            type="button"
                            onClick={() => handleOrderStatus(ord.id, 'preparing')}
                            className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors"
                          >
                            Mark Preparing in Kitchen
                          </button>
                        )}

                        {ord.orderStatus === 'preparing' && (
                          <button
                            type="button"
                            onClick={() => handleOrderStatus(ord.id, ord.deliveryType === 'delivery' ? 'dispatched' : 'ready_for_pickup')}
                            className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
                          >
                            {ord.deliveryType === 'delivery' ? 'Dispatch for Delivery' : 'Ready for Counter Pickup'}
                          </button>
                        )}

                        {(ord.orderStatus === 'ready_for_pickup' || ord.orderStatus === 'dispatched') && (
                          <button
                            type="button"
                            onClick={() => handleOrderStatus(ord.id, 'delivered')}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                          >
                            Mark Delivered / Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: DIGITAL COUPON SCANNER & CODE VERIFIER */}
      {activeTab === 'owner_scanner' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-3xl flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Verify & Redeem Digital Token</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter student token code or scan QR code shown on student mobile screen.
            </p>
          </div>

          <form onSubmit={handleVerifyCoupon} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Student Coupon / Token Code
              </label>
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                placeholder="e.g. ANN-LUN-7729 or ANN-4821"
                className="w-full px-4 py-3 text-lg font-mono font-bold uppercase text-center bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Verify Token & Dispense Meal
            </button>
          </form>

          {/* Verification Result Feedback */}
          {scanResult && (
            <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
              scanResult.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {scanResult.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block text-sm">
                  {scanResult.success ? 'Verification Successful' : 'Invalid or Denied'}
                </span>
                <p className="mt-0.5">{scanResult.message}</p>
              </div>
            </div>
          )}

          {/* Guidelines */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <span className="font-bold text-slate-800 block">Redemption Verification Rules:</span>
            <p>1. Tokens can only be redeemed once. Repeated entries will be rejected.</p>
            <p>2. Subscription balance will automatically decrement by 1 meal.</p>
            <p>3. Tokens issued for other messes cannot be redeemed here.</p>
          </div>
        </div>
      )}

      {/* SECTION 3: MANAGE MEALS & FOOD ITEMS */}
      {activeTab === 'owner_meals' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Manage Menu & Food Items</h2>
              <p className="text-xs text-slate-500 mt-0.5">Add dishes, set prices, edit protein/calories, and toggle daily stock.</p>
            </div>
            <button
              onClick={openAddMeal}
              className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Food Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foodItems.map((item) => (
              <div 
                key={item.id}
                className={`p-4 bg-white rounded-3xl border transition-all flex items-start gap-4 ${
                  item.isAvailable ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-slate-100"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 capitalize">{item.category} · {item.mealType}</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-slate-900">₹{item.price}</span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description}</p>

                  <div className="flex items-center gap-3 text-[11px] mt-2 pt-2 border-t border-slate-100 text-slate-600 font-mono">
                    <span>{item.proteinGrams}g Protein</span>
                    <span>·</span>
                    <span>{item.calories} kcal</span>
                  </div>

                  {/* Controls */}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleItemAvailability(item)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        item.isAvailable 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {item.isAvailable ? 'In Stock' : 'Mark Out of Stock'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditMeal(item)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                        title="Edit dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                        title="Delete dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: SUBSCRIPTION PLANS MANAGER */}
      {activeTab === 'owner_plans' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Active Subscription Packages</h2>
            <p className="text-xs text-slate-500 mt-0.5">Configure monthly passes, trial meals, and student pricing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mealPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-amber-800 font-mono">{plan.planType}</span>
                    <span className="text-xs text-slate-400">{plan.durationDays} Days</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{plan.name}</h4>
                  <p className="text-xs text-slate-500 mt-2">{plan.description}</p>
                  <div className="text-2xl font-bold font-mono text-slate-900 mt-4">
                    ₹{plan.price}
                    <span className="text-xs font-normal text-slate-500 font-sans"> / {plan.includedMealsCount} meals</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold">Active & Live</span>
                  <span className="text-slate-400">{plan.serviceDays}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: MESS PROFILE & SETTINGS */}
      {activeTab === 'owner_settings' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Mess Listing Profile & Delivery Settings</h2>
            <p className="text-xs text-slate-500 mt-0.5">Keep contact details, delivery fee, and radius updated for students.</p>
          </div>

          {profileSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mess Name</label>
              <input
                type="text"
                value={messName}
                onChange={(e) => setMessName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description & Philosophy</label>
              <textarea
                value={messDesc}
                onChange={(e) => setMessDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Support Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Fee (₹)</label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Delivery Radius (km)</label>
              <input
                type="number"
                step="0.5"
                value={deliveryRadius}
                onChange={(e) => setDeliveryRadius(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      )}

      {/* Add / Edit Meal Item Modal */}
      {isMealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-md my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden" role="dialog">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button onClick={() => setIsMealModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMealItem} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Shahi Paneer Thali"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value as FoodItem['category'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="Thali">Thali</option>
                    <option value="Roti & Sabzi">Roti & Sabzi</option>
                    <option value="Dal & Rice">Dal & Rice</option>
                    <option value="Paneer Dishes">Paneer Dishes</option>
                    <option value="Soya & Sprouts">Soya & Sprouts</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Meal Shift</label>
                  <select
                    value={itemMealType}
                    onChange={(e) => setItemMealType(e.target.value as FoodItem['mealType'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="all">All Day</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dietary Type</label>
                  <select
                    value={itemIsVeg ? 'veg' : 'non_veg'}
                    onChange={(e) => setItemIsVeg(e.target.value === 'veg')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non_veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Protein (grams)</label>
                  <input
                    type="number"
                    value={itemProteinGrams}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      setItemProteinGrams(v);
                      if (v >= 30) setItemIsHighProtein(true);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={itemCalories}
                    onChange={(e) => setItemCalories(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
              >
                Save Food Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reject Order Modal */}
      {rejectingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Decline Student Order</h3>
            <p className="text-xs text-slate-500">Provide a helpful reason so the student can reorder or receive a refund.</p>
            <form onSubmit={handleRejectOrder} className="space-y-4">
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Kitchen peak hours capacity full">Kitchen peak hours capacity full</option>
                <option value="Selected dish sold out today">Selected dish sold out today</option>
                <option value="Delivery address out of service area">Delivery address out of service area</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingOrderId(null)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl"
                >
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
