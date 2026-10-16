export type UserRole = 'student' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  college?: string;
  hostelAddress?: string;
  savedAddresses?: string[];
  ownerMessId?: string;
  dietaryPreference?: 'all' | 'veg' | 'non-veg' | 'jain';
  createdAt: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'all';
export type CuisineType = 'north_indian' | 'south_indian' | 'maharashtrian' | 'bengali' | 'pan_indian' | 'punjabi' | 'rajasthani';

export interface FoodItem {
  id: string;
  messId: string;
  name: string;
  description: string;
  price: number;
  category: 'Roti & Sabzi' | 'Dal & Rice' | 'Paneer Dishes' | 'Soya & Sprouts' | 'South Indian' | 'Breakfast' | 'Snacks' | 'Thali' | 'Non-Veg';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'all';
  cuisine: CuisineType;
  isVeg: boolean;
  isHighProtein: boolean;
  proteinGrams: number;
  calories: number;
  isAvailable: boolean;
  ingredients?: string[];
  imageUrl?: string;
}

export interface DayMenu {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  specialNote?: string;
}

export interface WeeklyMenu {
  messId: string;
  monday: DayMenu;
  tuesday: DayMenu;
  wednesday: DayMenu;
  thursday: DayMenu;
  friday: DayMenu;
  saturday: DayMenu;
  sunday: DayMenu;
}

export interface MealPlan {
  id: string;
  messId: string;
  name: string;
  planType: 'trial' | 'weekly' | 'monthly' | 'annual' | 'custom';
  description: string;
  price: number;
  durationDays: number;
  includedMealsCount: number;
  mealTypes: ('breakfast' | 'lunch' | 'dinner')[];
  serviceDays: string; // e.g. "Monday to Sunday (All 7 Days)"
  allowsDelivery: boolean;
  deliveryChargeMonthly: number;
  maxSubscribers?: number;
  isActive: boolean;
  cancellationPolicy: string;
  discountPercentage?: number;
}

export interface MessListing {
  id: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  isVegOnly: boolean;
  hasNonVeg: boolean;
  hasJain: boolean;
  hasSouthIndian: boolean;
  hasNorthIndian: boolean;
  hasHighProtein: boolean;
  monthlyBasePrice: number;
  singleMealPrice: number;
  openingHours: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  homeDeliveryAvailable: boolean;
  pickupAvailable: boolean;
  deliveryRadiusKm: number;
  deliveryFee: number;
  trialMealAvailable: boolean;
  trialMealPrice: number;
  approved: boolean;
  active: boolean;
  contactPhone: string;
  contactEmail: string;
  fssaiNumber: string;
  rules: string[];
  cancellationPolicy: string;
  ownerId: string;
  ownerUsername: string;
  todayMenuSnippet: string;
}

export interface OrderItem {
  foodItemId: string;
  name: string;
  quantity: number;
  price: number;
  isVeg: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  messId: string;
  messName: string;
  orderType: 'trial_meal' | 'subscription' | 'individual_meal';
  planId?: string;
  planName?: string;
  items?: OrderItem[];
  totalAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  deliverySlot?: string;
  paymentMethod: 'upi' | 'card' | 'fampay' | 'qr' | 'cash';
  paymentStatus: 'pending' | 'success' | 'failed' | 'refunded' | 'cancelled';
  paymentTransactionId?: string;
  paymentReceiptNumber?: string;
  orderStatus: 'placed' | 'accepted' | 'preparing' | 'ready_for_pickup' | 'dispatched' | 'delivered' | 'cancelled' | 'rejected';
  rejectionReason?: string;
  couponCode?: string;
  couponRedeemed?: boolean;
  bookingDate: string;
  selectedMealType?: 'breakfast' | 'lunch' | 'dinner' | 'all';
  subscriptionStartDate?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  subscriptionNumber: string;
  studentId: string;
  studentName: string;
  messId: string;
  messName: string;
  planId: string;
  planName: string;
  planType: 'trial' | 'weekly' | 'monthly' | 'annual' | 'custom';
  startDate: string;
  endDate: string;
  totalMeals: number;
  remainingMeals: number;
  mealTypesIncluded: ('breakfast' | 'lunch' | 'dinner')[];
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  pricePaid: number;
  paymentTransactionId: string;
  redemptionHistory: {
    id: string;
    date: string;
    mealType: string;
    couponCode: string;
    redeemedAt: string;
  }[];
  autoRenew: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  studentId: string;
  studentName: string;
  messId: string;
  messName: string;
  orderId: string;
  subscriptionId?: string;
  mealType: string;
  validityDate: string;
  status: 'active' | 'redeemed' | 'expired';
  redeemedAt?: string;
  redeemedByOwner?: string;
  qrPayload: string;
}

export interface Review {
  id: string;
  messId: string;
  studentId: string;
  studentName: string;
  rating: number; // 1 to 5
  foodQuality: number;
  hygiene: number;
  taste: number;
  valueForMoney: number;
  comment: string;
  date: string;
  orderId: string;
  verifiedOrder: boolean;
  reported: boolean;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  recipientRole: UserRole;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'subscription' | 'coupon' | 'system' | 'cancellation';
  timestamp: string;
  isRead: boolean;
  orderId?: string;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  locality: string;
  maxDistanceKm: number;
  foodPreference: 'all' | 'veg_only' | 'non_veg' | 'jain';
  cuisines: string[];
  maxMonthlyPrice: number;
  maxSingleMealPrice: number;
  highProteinOnly: boolean;
  minProteinGrams: number;
  homeDeliveryOnly: boolean;
  pickupOnly: boolean;
  trialMealAvailableOnly: boolean;
  highestRatedOnly: boolean;
  breakfastAvailable: boolean;
  lunchAvailable: boolean;
  dinnerAvailable: boolean;
  sortBy: 'nearest' | 'price_low' | 'rating' | 'popular';
}
