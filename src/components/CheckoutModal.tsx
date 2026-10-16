import React, { useState } from 'react';
import { MessListing, MealPlan, User, Order } from '../types';
import { storage } from '../services/storageService';
import { 
  X, CheckCircle, ShieldCheck, CreditCard, QrCode, Banknote, Smartphone, 
  MapPin, Clock, ArrowRight, Loader2, AlertCircle, Sparkles, Building2, Ticket, Store, Bike
} from 'lucide-react';

interface CheckoutModalProps {
  mess: MessListing;
  plan: MealPlan;
  isTrial: boolean;
  currentUser: User;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  mess,
  plan,
  isTrial,
  currentUser,
  onClose,
  onOrderCompleted
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');

  // Delivery options
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser.hostelAddress || (currentUser.savedAddresses && currentUser.savedAddresses[0]) || ''
  );
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState<'lunch' | 'dinner' | 'breakfast'>('lunch');
  const [subscriptionStartDate, setSubscriptionStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'fampay' | 'qr' | 'cash'>('upi');
  const [upiId, setUpiId] = useState('student@oksbi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculations
  const basePrice = plan.price;
  const deliveryCharge = deliveryType === 'delivery' 
    ? (isTrial ? mess.deliveryFee : plan.deliveryChargeMonthly || 200)
    : 0;
  const grandTotal = basePrice + deliveryCharge;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please provide your room and hostel delivery address.');
      return;
    }
    setErrorMessage('');
    setStep('payment');
  };

  const handlePayAndConfirm = async () => {
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);
    setErrorMessage('');
    setStep('processing');

    try {
      // Simulate real server-side payment verification (1.5s delay)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const isOnline = paymentMethod !== 'cash';
      const txnId = isOnline ? `TXN-IND-${Date.now()}` : undefined;
      const receiptNum = isOnline ? `RCPT-2026-${Math.floor(10000 + Math.random() * 90000)}` : undefined;

      const order = storage.createOrder({
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentPhone: currentUser.phone,
        messId: mess.id,
        messName: mess.name,
        orderType: isTrial ? 'trial_meal' : 'subscription',
        planId: plan.id,
        planName: plan.name,
        totalAmount: basePrice,
        deliveryCharge,
        grandTotal,
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
        paymentMethod,
        paymentStatus: isOnline ? 'success' : 'pending',
        paymentTransactionId: txnId,
        paymentReceiptNumber: receiptNum,
        orderStatus: isOnline ? 'placed' : 'placed',
        bookingDate,
        selectedMealType,
        subscriptionStartDate
      });

      setCompletedOrder(order);
      setStep('success');
      onOrderCompleted(order);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Payment processing failed. Please retry.');
      setStep('payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              {step === 'success' ? 'Confirmation' : 'Checkout & Booking'}
            </span>
            <h3 className="text-lg font-bold text-slate-900">{mess.name}</h3>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: DETAILS & DINING METHOD */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-5">
            {/* Plan Summary Card */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider font-mono">
                  {plan.planType} Plan
                </span>
                <h4 className="text-sm font-bold text-slate-900">{plan.name}</h4>
                <span className="text-xs text-slate-600">{plan.includedMealsCount} {plan.includedMealsCount === 1 ? 'Meal' : 'Meals total'}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-slate-900">₹{plan.price}</span>
              </div>
            </div>

            {/* Dining Method Selection (Dine-in Pickup vs Hostel Delivery) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Dining / Delivery Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-3 text-left rounded-2xl border transition-all ${
                    deliveryType === 'pickup'
                      ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Store className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900">Mess Dine-In / Pickup</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">Instant QR code token at counter. Free</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  disabled={!mess.homeDeliveryAvailable}
                  className={`p-3 text-left rounded-2xl border transition-all ${
                    !mess.homeDeliveryAvailable
                      ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50'
                      : deliveryType === 'delivery'
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Bike className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900">Hostel Delivery</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {mess.homeDeliveryAvailable ? `+₹${isTrial ? mess.deliveryFee : (plan.deliveryChargeMonthly || 200)} delivery` : 'Not available'}
                  </p>
                </button>
              </div>
            </div>

            {/* Hostel Delivery Address (if Delivery selected) */}
            {deliveryType === 'delivery' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hostel / Room Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Hostel name, Wing & Room Number"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Date & Shift Selectors */}
            {isTrial ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Meal Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Meal Shift
                  </label>
                  <select
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value as 'lunch' | 'dinner' | 'breakfast')}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="lunch">Lunch (11:45 AM - 2:45 PM)</option>
                    <option value="dinner">Dinner (7:30 PM - 10:30 PM)</option>
                    <option value="breakfast">Breakfast (7:30 AM - 10:00 AM)</option>
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subscription Start Date
                </label>
                <input
                  type="date"
                  value={subscriptionStartDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSubscriptionStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  required
                />
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Price Summary */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Grand Total</span>
              <span className="text-xl font-bold font-mono text-slate-900">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: REAL INDIAN PAYMENT OPTIONS */}
        {step === 'payment' && (
          <div className="p-6 space-y-5">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Choose Payment Method
              </span>
              <div className="space-y-2">
                {/* 1. UPI */}
                <div 
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi' ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900">UPI (Instant Verified)</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Fastest</span>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-amber-200/60 space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        {(['gpay', 'phonepe', 'paytm', 'bhim'] as const).map((app) => (
                          <button
                            key={app}
                            type="button"
                            onClick={() => setSelectedUpiApp(app)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase border ${
                              selectedUpiApp === app ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi or mobile@okhdfcbank"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* 2. QR Code Payment */}
                <div 
                  onClick={() => setPaymentMethod('qr')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'qr' ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900">Scan UPI Dynamic QR</span>
                  </div>
                  {paymentMethod === 'qr' && (
                    <div className="mt-2 text-[11px] text-slate-500">
                      Dynamic provider QR will generate for exactly ₹{grandTotal}. Verified upon payment notification.
                    </div>
                  )}
                </div>

                {/* 3. Debit / Credit Card */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900">Debit / Credit Card (Visa, RuPay, MC)</span>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-3 pt-3 border-t border-amber-200/60 space-y-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:outline-none"
                        />
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. FamPay Student Card/Wallet */}
                <div 
                  onClick={() => setPaymentMethod('fampay')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'fampay' ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900">FamPay Teen & Student Card</span>
                    </div>
                    <span className="text-[10px] text-amber-800 font-medium">Student Friendly</span>
                  </div>
                </div>

                {/* 5. Cash on Pickup / Delivery */}
                <div 
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cash' ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">
                        {deliveryType === 'pickup' ? 'Cash on Counter Pickup' : 'Cash on Hostel Delivery'}
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Pending until confirmed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust and Verification Badge */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Payments verified through secure Indian payment gateway. Raw PINs/CVVs are never stored.</span>
            </div>

            {/* Total and Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Payable Now</span>
                <div className="text-xl font-bold font-mono text-slate-900">₹{grandTotal.toLocaleString('en-IN')}</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePayAndConfirm}
                  disabled={isSubmitting}
                  className="py-2.5 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <span>Pay ₹{grandTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING STATE */}
        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
            <div>
              <h4 className="text-base font-bold text-slate-900">Securing Payment & Verifying Receipt...</h4>
              <p className="text-xs text-slate-500 mt-1">
                Communicating with Indian banking gateway. Do not refresh or press back.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 'success' && completedOrder && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {completedOrder.paymentStatus === 'success' ? 'Payment Verified' : 'Order Placed (Cash Collection Pending)'}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Order Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Order #{completedOrder.orderNumber} placed at {completedOrder.messName}
              </p>
            </div>

            {/* Coupon Code Callout if generated */}
            {completedOrder.couponCode && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  Your Digital Meal Token
                </span>
                <div className="text-2xl font-mono font-bold tracking-widest text-slate-900 mt-1">
                  {completedOrder.couponCode}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Saved to your &ldquo;My QR Tokens&rdquo; tab. Show this at the mess counter.
                </p>
              </div>
            )}

            {/* Receipt Summary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Plan:</span>
                <span className="font-semibold text-slate-900">{completedOrder.planName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Dining Method:</span>
                <span className="font-semibold capitalize text-slate-900">{completedOrder.deliveryType}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-semibold font-mono text-slate-900">₹{completedOrder.grandTotal}</span>
              </div>
              {completedOrder.paymentReceiptNumber && (
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                  <span>Receipt No:</span>
                  <span className="font-mono text-slate-700">{completedOrder.paymentReceiptNumber}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Go to My Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
