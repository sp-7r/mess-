import React, { useState } from 'react';
import { MessListing, FoodItem, WeeklyMenu, MealPlan, Review, User } from '../types';
import { 
  ArrowLeft, Star, MapPin, Clock, Phone, Mail, ShieldCheck, Heart, 
  Utensils, Calendar, Bike, Store, Dumbbell, Flame, CheckCircle, Info, MessageSquarePlus 
} from 'lucide-react';

interface MessDetailPageProps {
  mess: MessListing;
  foodItems: FoodItem[];
  weeklyMenu?: WeeklyMenu;
  mealPlans: MealPlan[];
  reviews: Review[];
  isSaved: boolean;
  currentUser: User | null;
  onBack: () => void;
  onToggleSave: (messId: string) => void;
  onSelectPlanToBook: (mess: MessListing, plan: MealPlan, isTrial: boolean) => void;
  onOpenReviewModal: () => void;
}

export const MessDetailPage: React.FC<MessDetailPageProps> = ({
  mess,
  foodItems,
  weeklyMenu,
  mealPlans,
  reviews,
  isSaved,
  currentUser,
  onBack,
  onToggleSave,
  onSelectPlanToBook,
  onOpenReviewModal
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'plans' | 'weekly' | 'reviews' | 'rules'>('menu');
  const [selectedDay, setSelectedDay] = useState<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>('monday');
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<string>('all');

  const daysList: { id: typeof selectedDay; label: string }[] = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun (Special)' }
  ];

  const currentDayMenu = weeklyMenu ? weeklyMenu[selectedDay] : null;

  const categories = ['all', ...Array.from(new Set(foodItems.map(f => f.category)))];
  const filteredFoodItems = selectedFoodCategory === 'all' 
    ? foodItems 
    : foodItems.filter(f => f.category === selectedFoodCategory);

  const trialPlan = mealPlans.find(p => p.planType === 'trial');
  const monthlyPlans = mealPlans.filter(p => p.planType === 'monthly');
  const otherPlans = mealPlans.filter(p => p.planType !== 'trial' && p.planType !== 'monthly');

  return (
    <div className="max-w-6xl mx-auto pb-16 animate-fade-in">
      {/* Top Navigation Bar with Back Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Messes</span>
        </button>

        <button
          onClick={() => onToggleSave(mess.id)}
          className={`flex items-center gap-1.5 py-2 px-3.5 text-xs font-semibold rounded-xl border transition-colors ${
            isSaved
              ? 'bg-rose-50 border-rose-300 text-rose-600'
              : 'bg-white border-slate-200 text-slate-700 hover:text-rose-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          <span>{isSaved ? 'Saved in Favorites' : 'Save Mess'}</span>
        </button>
      </div>

      {/* Hero Banner & Gallery */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
          <div className="md:col-span-2 relative aspect-[16/10] md:aspect-auto md:h-80 rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={mess.coverImage}
              alt={mess.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {mess.hasHighProtein && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 py-1.5 px-3 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Macro-Verified High Protein Kitchen</span>
              </div>
            )}
          </div>
          <div className="hidden md:flex flex-col gap-2 h-80">
            {mess.galleryImages.slice(1, 3).map((img, i) => (
              <div key={i} className="flex-1 rounded-2xl overflow-hidden bg-slate-100 relative">
                <img
                  src={img}
                  alt={`${mess.name} photo`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {mess.galleryImages.length <= 1 && (
              <div className="flex-1 rounded-2xl overflow-hidden bg-slate-100 relative">
                <img
                  src="/src/assets/images/mess_dining_hall_1792159590759.jpg"
                  alt="Dining Hall"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Mess Title & Overview Bar */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {mess.isVegOnly ? (
                  <span className="inline-flex items-center gap-1.5 py-0.5 px-2 bg-emerald-50 text-emerald-800 rounded-md text-xs font-bold border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Pure Vegetarian
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 py-0.5 px-2 bg-rose-50 text-rose-800 rounded-md text-xs font-bold border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    Veg & Non-Veg
                  </span>
                )}
                <span className="text-xs text-slate-500 font-medium">{mess.locality}, {mess.city}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{mess.name}</h1>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl">{mess.description}</p>
            </div>

            {/* Quick Pricing & Instant Trial CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Monthly Plan</span>
                <span className="text-2xl font-bold font-mono text-slate-900">₹{mess.monthlyBasePrice}</span>
                <span className="text-xs text-slate-500 font-normal"> / 30 days</span>
              </div>
              {trialPlan && (
                <button
                  type="button"
                  onClick={() => onSelectPlanToBook(mess, trialPlan, true)}
                  className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap"
                >
                  Book Trial Meal (₹{trialPlan.price})
                </button>
              )}
            </div>
          </div>

          {/* Quick Info Strips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">{mess.address}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Lunch: {mess.openingHours.lunch}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{mess.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>FSSAI Lic: {mess.fssaiNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Strip */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('menu')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'menu'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Daily Dishes & Thalis ({foodItems.length})
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'weekly'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          7-Day Full Weekly Menu
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'plans'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Subscription Plans ({mealPlans.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Student Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'rules'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Rules & Cancellation
        </button>
      </div>

      {/* TAB 1: DAILY DISHES & THALIS */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFoodCategory(cat)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  selectedFoodCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? 'All Dishes' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFoodItems.map((item) => (
              <div 
                key={item.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 capitalize">{item.category} · {item.mealType}</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-slate-900 shrink-0">₹{item.price}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.description}</p>

                  {/* Macros Strip */}
                  <div className="flex items-center gap-3 text-[11px] mt-2.5 pt-2 border-t border-slate-100 text-slate-500 font-mono">
                    {item.proteinGrams > 0 && (
                      <span className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                        <Dumbbell className="w-3 h-3 text-amber-600" />
                        {item.proteinGrams}g Protein
                      </span>
                    )}
                    {item.calories > 0 && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {item.calories} kcal
                      </span>
                    )}
                    <span className="ml-auto text-emerald-700 font-sans font-medium">Available</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 7-DAY FULL WEEKLY MENU */}
      {activeTab === 'weekly' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">7-Day Campus Meal Schedule</h3>
            <p className="text-xs text-slate-500 mt-0.5">Rotational nutritious menu prepared fresh 3 times daily.</p>
          </div>

          {/* Days of week selector tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {daysList.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDay(d.id)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDay === d.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {currentDayMenu ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Breakfast */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Breakfast</span>
                  <span className="text-[11px] text-amber-700 font-mono">{mess.openingHours.breakfast}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                  {currentDayMenu.breakfast.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lunch */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Lunch (Main Thali)</span>
                  <span className="text-[11px] text-emerald-700 font-mono">{mess.openingHours.lunch}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                  {currentDayMenu.lunch.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dinner */}
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">Dinner</span>
                  <span className="text-[11px] text-indigo-700 font-mono">{mess.openingHours.dinner}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                  {currentDayMenu.dinner.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Weekly menu is being refreshed by the mess owner.</p>
          )}

          {currentDayMenu?.specialNote && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span><strong>Note:</strong> {currentDayMenu.specialNote}</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SUBSCRIPTION PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mealPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                  plan.planType === 'monthly'
                    ? 'border-amber-400 shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {plan.planType === 'monthly' && (
                  <span className="absolute -top-3 left-6 px-2.5 py-0.5 bg-amber-600 text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-xs">
                    Most Popular Student Plan
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-amber-800 tracking-wider font-mono">
                      {plan.planType.toUpperCase()} PASS
                    </span>
                    <span className="text-xs text-slate-400">{plan.durationDays} Days</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mt-1">{plan.name}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{plan.description}</p>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-2xl font-bold font-mono text-slate-900">
                      ₹{plan.price.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-500 font-sans">
                        {' '}/ {plan.includedMealsCount} {plan.includedMealsCount === 1 ? 'meal' : 'meals'}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Included: {plan.mealTypes.join(', ')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{plan.serviceDays}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Instant Digital QR Coupons on mobile</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectPlanToBook(mess, plan, plan.planType === 'trial')}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                      plan.planType === 'monthly'
                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {plan.planType === 'trial' ? 'Book Trial Meal Now' : 'Select Plan & Subscribe'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REVIEWS & RATINGS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Verified Feedback</span>
                <h3 className="text-xl font-bold text-slate-900">Student Ratings & Reviews</h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                  <div>
                    <div className="text-2xl font-bold font-mono text-slate-900 leading-none">{mess.rating}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{mess.reviewCount} verified reviews</div>
                  </div>
                </div>

                {currentUser?.role === 'student' && (
                  <button
                    onClick={onOpenReviewModal}
                    className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Rate Experience</span>
                  </button>
                )}
              </div>
            </div>

            {/* Reviews List */}
            <div className="divide-y divide-slate-100 mt-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.studentName}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{rev.date}</span>
                        {rev.verifiedOrder && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-700 font-semibold">Verified Student Dine</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-900 text-xs font-mono font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                    <span>Food: {rev.foodQuality}/5</span>
                    <span>·</span>
                    <span>Hygiene: {rev.hygiene}/5</span>
                    <span>·</span>
                    <span>Taste: {rev.taste}/5</span>
                    <span>·</span>
                    <span>VFM: {rev.valueForMoney}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RULES & CANCELLATION */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Mess Code of Conduct & Dining Guidelines</h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {mess.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-2">Transparent Cancellation & Refund Policy</h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {mess.cancellationPolicy}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
