import { 
  User, MessListing, FoodItem, WeeklyMenu, MealPlan, Order, Subscription, Coupon, Review, AppNotification 
} from '../types';
import { 
  INITIAL_USERS, INITIAL_MESSES, INITIAL_FOOD_ITEMS, INITIAL_WEEKLY_MENUS, 
  INITIAL_MEAL_PLANS, INITIAL_REVIEWS, OWNER_CREDENTIALS 
} from '../data/seedData';

const KEYS = {
  USERS: 'messbhojan_users_v1',
  MESSES: 'messbhojan_messes_v1',
  FOOD_ITEMS: 'messbhojan_foods_v1',
  WEEKLY_MENUS: 'messbhojan_menus_v1',
  MEAL_PLANS: 'messbhojan_plans_v1',
  ORDERS: 'messbhojan_orders_v1',
  SUBSCRIPTIONS: 'messbhojan_subscriptions_v1',
  COUPONS: 'messbhojan_coupons_v1',
  REVIEWS: 'messbhojan_reviews_v1',
  NOTIFICATIONS: 'messbhojan_notifications_v1',
  CURRENT_USER: 'messbhojan_current_user_v1',
  SAVED_MESSES: 'messbhojan_saved_messes_v1',
  SOUND_ENABLED: 'messbhojan_sound_enabled_v1'
};

// Simple Web Audio API sound alert generator
export function playNotificationSound() {
  try {
    const isSoundOn = localStorage.getItem(KEYS.SOUND_ENABLED) !== 'false';
    if (!isSoundOn) return;
    
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Audio might be blocked until user gesture, ignore silently
  }
}

class StorageService {
  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(KEYS.MESSES)) {
      localStorage.setItem(KEYS.MESSES, JSON.stringify(INITIAL_MESSES));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(KEYS.FOOD_ITEMS)) {
      localStorage.setItem(KEYS.FOOD_ITEMS, JSON.stringify(INITIAL_FOOD_ITEMS));
    }
    if (!localStorage.getItem(KEYS.WEEKLY_MENUS)) {
      localStorage.setItem(KEYS.WEEKLY_MENUS, JSON.stringify(INITIAL_WEEKLY_MENUS));
    }
    if (!localStorage.getItem(KEYS.MEAL_PLANS)) {
      localStorage.setItem(KEYS.MEAL_PLANS, JSON.stringify(INITIAL_MEAL_PLANS));
    }
    if (!localStorage.getItem(KEYS.REVIEWS)) {
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    }
    if (!localStorage.getItem(KEYS.ORDERS)) {
      // Seed an initial demo order so student has immediate visible history
      const initialOrders: Order[] = [
        {
          id: 'ord_demo_1',
          orderNumber: 'ORD-2026-9041',
          studentId: 'user_student_1',
          studentName: 'Pratik Sharma',
          studentPhone: '+91 98765 43210',
          messId: 'mess_1',
          messName: 'Annapoorna Deluxe Student Mess',
          orderType: 'trial_meal',
          planName: 'Single Trial Meal Pass',
          totalAmount: 85,
          deliveryCharge: 0,
          grandTotal: 85,
          deliveryType: 'pickup',
          paymentMethod: 'upi',
          paymentStatus: 'success',
          paymentTransactionId: 'UPI-AXS-99210928341',
          paymentReceiptNumber: 'RCPT-2026-081',
          orderStatus: 'delivered',
          couponCode: 'ANN-TRI-4821',
          couponRedeemed: true,
          bookingDate: '2026-09-12',
          selectedMealType: 'lunch',
          createdAt: '2026-09-12T09:30:00Z'
        }
      ];
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(initialOrders));
    }
    if (!localStorage.getItem(KEYS.SUBSCRIPTIONS)) {
      const initialSubs: Subscription[] = [
        {
          id: 'sub_demo_1',
          subscriptionNumber: 'SUB-2026-8820',
          studentId: 'user_student_1',
          studentName: 'Pratik Sharma',
          messId: 'mess_1',
          messName: 'Annapoorna Deluxe Student Mess',
          planId: 'plan_102',
          planName: 'Executive 30-Day Lunch & Dinner Plan',
          planType: 'monthly',
          startDate: '2026-10-01',
          endDate: '2026-10-31',
          totalMeals: 60,
          remainingMeals: 44,
          mealTypesIncluded: ['lunch', 'dinner'],
          deliveryType: 'pickup',
          status: 'active',
          pricePaid: 2950,
          paymentTransactionId: 'UPI-RAZ-8839211029',
          redemptionHistory: [
            {
              id: 'red_1',
              date: '2026-10-15',
              mealType: 'Dinner',
              couponCode: 'SUB-RED-4819',
              redeemedAt: '2026-10-15T20:15:00Z'
            },
            {
              id: 'red_2',
              date: '2026-10-15',
              mealType: 'Lunch',
              couponCode: 'SUB-RED-4818',
              redeemedAt: '2026-10-15T13:10:00Z'
            }
          ],
          autoRenew: false
        }
      ];
      localStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify(initialSubs));
    }
    if (!localStorage.getItem(KEYS.COUPONS)) {
      const initialCoupons: Coupon[] = [
        {
          id: 'coup_demo_1',
          code: 'ANN-LUN-7729',
          studentId: 'user_student_1',
          studentName: 'Pratik Sharma',
          messId: 'mess_1',
          messName: 'Annapoorna Deluxe Student Mess',
          orderId: 'ord_demo_sub_1',
          subscriptionId: 'sub_demo_1',
          mealType: 'Lunch Meal Token',
          validityDate: '2026-10-16',
          status: 'active',
          qrPayload: JSON.stringify({
            code: 'ANN-LUN-7729',
            messId: 'mess_1',
            studentId: 'user_student_1',
            studentName: 'Pratik Sharma',
            subscriptionId: 'sub_demo_1',
            mealType: 'lunch',
            date: '2026-10-16'
          })
        }
      ];
      localStorage.setItem(KEYS.COUPONS, JSON.stringify(initialCoupons));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      const initialNotifs: AppNotification[] = [
        {
          id: 'notif_1',
          recipientId: 'user_student_1',
          recipientRole: 'student',
          title: 'Welcome to MessBhojan!',
          message: 'Explore verified student messes near your college campus, compare healthy plans, and book trial meals.',
          type: 'system',
          timestamp: '2026-10-16T06:00:00Z',
          isRead: false
        },
        {
          id: 'notif_2',
          recipientId: 'user_student_1',
          recipientRole: 'student',
          title: 'Today\'s Lunch Token Ready',
          message: 'Your digital coupon ANN-LUN-7729 for Annapoorna Deluxe is active until 2:45 PM.',
          type: 'coupon',
          timestamp: '2026-10-16T06:30:00Z',
          isRead: false
        }
      ];
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(initialNotifs));
    }
    if (!localStorage.getItem(KEYS.CURRENT_USER)) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    }
  }

  // --- CURRENT USER & AUTH ---
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  }

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  }

  getUsers(): User[] {
    const raw = localStorage.getItem(KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  }

  saveUsers(users: User[]) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }

  registerStudent(name: string, email: string, phone: string, college: string, hostelAddress: string): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists. Please log in.');
    }
    const newUser: User = {
      id: `user_student_${Date.now()}`,
      name,
      email,
      phone,
      role: 'student',
      college,
      hostelAddress,
      savedAddresses: [hostelAddress],
      dietaryPreference: 'all',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    this.addNotification({
      recipientId: newUser.id,
      recipientRole: 'student',
      title: 'Account Created Successfully',
      message: `Welcome ${name}! Your student food profile is now active.`,
      type: 'system',
      timestamp: new Date().toISOString(),
      isRead: false
    });

    return newUser;
  }

  loginStudent(identifier: string): User {
    const users = this.getUsers();
    const user = users.find(u => 
      u.role === 'student' && 
      (u.email.toLowerCase() === identifier.toLowerCase() || u.phone.includes(identifier))
    );
    if (!user) {
      throw new Error('Student account not found with this email or phone.');
    }
    this.setCurrentUser(user);
    return user;
  }

  loginOwner(username: string): User {
    const cleanUsername = username.trim().toLowerCase();
    const creds = OWNER_CREDENTIALS[cleanUsername];
    
    // Also check newly admin-created owners
    const users = this.getUsers();
    const foundUser = users.find(u => u.role === 'owner' && (u.email.toLowerCase().includes(cleanUsername) || u.name.toLowerCase().includes(cleanUsername) || (u as unknown as { adminAssignedUsername?: string }).adminAssignedUsername === cleanUsername));

    if (creds) {
      let user = users.find(u => u.ownerMessId === creds.messId);
      if (!user) {
        user = {
          id: `user_owner_${creds.messId}`,
          name: creds.messName + ' Manager',
          email: `${creds.username}@messbhojan.in`,
          phone: '+91 98000 00000',
          role: 'owner',
          ownerMessId: creds.messId,
          createdAt: new Date().toISOString()
        };
        users.push(user);
        this.saveUsers(users);
      }
      this.setCurrentUser(user);
      return user;
    }

    if (foundUser) {
      this.setCurrentUser(foundUser);
      return foundUser;
    }

    throw new Error('Invalid administrator-provided credentials. Mess owners must be registered by Platform Admin.');
  }

  loginAdmin(): User {
    const users = this.getUsers();
    let admin = users.find(u => u.role === 'admin');
    if (!admin) {
      admin = INITIAL_USERS.find(u => u.role === 'admin')!;
    }
    this.setCurrentUser(admin);
    return admin;
  }

  createMessOwnerByAdmin(ownerName: string, messName: string, email: string, phone: string, assignedUsername: string): { user: User; mess: MessListing } {
    const users = this.getUsers();
    const messes = this.getMesses();

    const newMessId = `mess_${Date.now()}`;
    const newOwnerId = `user_owner_${Date.now()}`;

    const newOwner: User = {
      id: newOwnerId,
      name: ownerName,
      email,
      phone,
      role: 'owner',
      ownerMessId: newMessId,
      createdAt: new Date().toISOString()
    };
    (newOwner as unknown as { adminAssignedUsername: string }).adminAssignedUsername = assignedUsername.trim().toLowerCase();

    const newMess: MessListing = {
      id: newMessId,
      name: messName,
      tagline: 'Fresh wholesome home-cooked student meals',
      description: 'Hygienic daily meals for college students with high quality ingredients and clean dining environment.',
      coverImage: '/src/assets/images/mess_thali_deluxe_1792159589994.jpg',
      galleryImages: ['/src/assets/images/mess_thali_deluxe_1792159589994.jpg'],
      address: 'College Road Campus Area',
      locality: 'Campus Area',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      lat: 18.5204,
      lng: 73.8567,
      rating: 5.0,
      reviewCount: 0,
      isVegOnly: true,
      hasNonVeg: false,
      hasJain: false,
      hasSouthIndian: false,
      hasNorthIndian: true,
      hasHighProtein: false,
      monthlyBasePrice: 2800,
      singleMealPrice: 85,
      openingHours: {
        breakfast: '07:30 AM - 10:00 AM',
        lunch: '12:00 PM - 02:45 PM',
        dinner: '07:30 PM - 10:00 PM'
      },
      homeDeliveryAvailable: true,
      pickupAvailable: true,
      deliveryRadiusKm: 3.0,
      deliveryFee: 15,
      trialMealAvailable: true,
      trialMealPrice: 80,
      approved: true, // admin created
      active: true,
      contactPhone: phone,
      contactEmail: email,
      fssaiNumber: '11526' + Math.floor(10000000 + Math.random() * 90000000),
      rules: ['Carry digital coupon on phone', 'Timely meal collection'],
      cancellationPolicy: 'Refund on pro-rata remaining meals minus standard processing charges.',
      ownerId: newOwnerId,
      ownerUsername: assignedUsername.trim().toLowerCase(),
      todayMenuSnippet: 'Homestyle Thali with Ghee Phulkas, Dal Fry, Seasonal Sabzi & Rice'
    };

    OWNER_CREDENTIALS[assignedUsername.trim().toLowerCase()] = {
      username: assignedUsername.trim().toLowerCase(),
      messId: newMessId,
      messName: messName
    };

    users.push(newOwner);
    messes.push(newMess);
    this.saveUsers(users);
    this.saveMesses(messes);

    return { user: newOwner, mess: newMess };
  }

  // --- MESS LISTINGS ---
  getMesses(): MessListing[] {
    const raw = localStorage.getItem(KEYS.MESSES);
    return raw ? JSON.parse(raw) : INITIAL_MESSES;
  }

  saveMesses(messes: MessListing[]) {
    localStorage.setItem(KEYS.MESSES, JSON.stringify(messes));
  }

  getMessById(id: string): MessListing | undefined {
    return this.getMesses().find(m => m.id === id);
  }

  updateMess(mess: MessListing) {
    const messes = this.getMesses().map(m => m.id === mess.id ? mess : m);
    this.saveMesses(messes);
  }

  // --- FOOD ITEMS ---
  getFoodItems(messId?: string): FoodItem[] {
    const raw = localStorage.getItem(KEYS.FOOD_ITEMS);
    const items: FoodItem[] = raw ? JSON.parse(raw) : INITIAL_FOOD_ITEMS;
    return messId ? items.filter(i => i.messId === messId) : items;
  }

  saveFoodItems(items: FoodItem[]) {
    localStorage.setItem(KEYS.FOOD_ITEMS, JSON.stringify(items));
  }

  addFoodItem(item: Omit<FoodItem, 'id'>): FoodItem {
    const items = this.getFoodItems();
    const newItem: FoodItem = {
      ...item,
      id: `food_${Date.now()}`
    };
    items.push(newItem);
    this.saveFoodItems(items);
    return newItem;
  }

  updateFoodItem(item: FoodItem) {
    const items = this.getFoodItems().map(i => i.id === item.id ? item : i);
    this.saveFoodItems(items);
  }

  deleteFoodItem(id: string) {
    const items = this.getFoodItems().filter(i => i.id !== id);
    this.saveFoodItems(items);
  }

  // --- WEEKLY MENUS ---
  getWeeklyMenus(): Record<string, WeeklyMenu> {
    const raw = localStorage.getItem(KEYS.WEEKLY_MENUS);
    return raw ? JSON.parse(raw) : INITIAL_WEEKLY_MENUS;
  }

  getWeeklyMenuForMess(messId: string): WeeklyMenu | undefined {
    const all = this.getWeeklyMenus();
    return all[messId] || INITIAL_WEEKLY_MENUS[messId];
  }

  saveWeeklyMenu(weeklyMenu: WeeklyMenu) {
    const all = this.getWeeklyMenus();
    all[weeklyMenu.messId] = weeklyMenu;
    localStorage.setItem(KEYS.WEEKLY_MENUS, JSON.stringify(all));
  }

  // --- MEAL PLANS ---
  getMealPlans(messId?: string): MealPlan[] {
    const raw = localStorage.getItem(KEYS.MEAL_PLANS);
    const plans: MealPlan[] = raw ? JSON.parse(raw) : INITIAL_MEAL_PLANS;
    return messId ? plans.filter(p => p.messId === messId) : plans;
  }

  saveMealPlans(plans: MealPlan[]) {
    localStorage.setItem(KEYS.MEAL_PLANS, JSON.stringify(plans));
  }

  addMealPlan(plan: Omit<MealPlan, 'id'>): MealPlan {
    const plans = this.getMealPlans();
    const newPlan: MealPlan = {
      ...plan,
      id: `plan_${Date.now()}`
    };
    plans.push(newPlan);
    this.saveMealPlans(plans);
    return newPlan;
  }

  updateMealPlan(plan: MealPlan) {
    const plans = this.getMealPlans().map(p => p.id === plan.id ? plan : p);
    this.saveMealPlans(plans);
  }

  // --- ORDERS ---
  getOrders(): Order[] {
    const raw = localStorage.getItem(KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  }

  saveOrders(orders: Order[]) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  }

  getOrdersForStudent(studentId: string): Order[] {
    return this.getOrders().filter(o => o.studentId === studentId);
  }

  getOrdersForMess(messId: string): Order[] {
    return this.getOrders().filter(o => o.messId === messId);
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const orders = this.getOrders();

    // Check duplicate throttle (within last 5 seconds for same student, mess, and amount)
    const recent = orders.find(o => 
      o.studentId === orderData.studentId && 
      o.messId === orderData.messId && 
      o.grandTotal === orderData.grandTotal &&
      Date.now() - new Date(o.createdAt).getTime() < 5000
    );
    if (recent) {
      return recent;
    }

    const orderId = `ord_${Date.now()}`;
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    let generatedCouponCode: string | undefined = undefined;
    if (orderData.deliveryType === 'pickup' || orderData.orderType === 'trial_meal') {
      const messPrefix = orderData.messName.substring(0, 3).toUpperCase();
      generatedCouponCode = `${messPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderNumber,
      couponCode: generatedCouponCode,
      couponRedeemed: false,
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    this.saveOrders(orders);

    // If order is trial meal with pickup or coupon, create digital Coupon record
    if (generatedCouponCode) {
      this.createCoupon({
        code: generatedCouponCode,
        studentId: newOrder.studentId,
        studentName: newOrder.studentName,
        messId: newOrder.messId,
        messName: newOrder.messName,
        orderId: newOrder.id,
        mealType: newOrder.selectedMealType || 'Regular Meal',
        validityDate: newOrder.bookingDate,
        status: 'active',
        qrPayload: JSON.stringify({
          code: generatedCouponCode,
          messId: newOrder.messId,
          orderId: newOrder.id,
          studentName: newOrder.studentName,
          bookingDate: newOrder.bookingDate
        })
      });
    }

    // If order is a subscription and paid/confirmed, create subscription record
    if (newOrder.orderType === 'subscription' && newOrder.planId && (newOrder.paymentStatus === 'success' || newOrder.paymentMethod === 'cash')) {
      const plan = this.getMealPlans().find(p => p.id === newOrder.planId);
      if (plan) {
        const startDate = newOrder.subscriptionStartDate || new Date().toISOString().split('T')[0];
        const end = new Date(startDate);
        end.setDate(end.getDate() + plan.durationDays);
        const endDate = end.toISOString().split('T')[0];

        this.createSubscription({
          studentId: newOrder.studentId,
          studentName: newOrder.studentName,
          messId: newOrder.messId,
          messName: newOrder.messName,
          planId: plan.id,
          planName: plan.name,
          planType: plan.planType,
          startDate,
          endDate,
          totalMeals: plan.includedMealsCount,
          remainingMeals: plan.includedMealsCount,
          mealTypesIncluded: plan.mealTypes,
          deliveryType: newOrder.deliveryType,
          deliveryAddress: newOrder.deliveryAddress,
          status: 'active',
          pricePaid: newOrder.grandTotal,
          paymentTransactionId: newOrder.paymentTransactionId || 'CASH_PENDING',
          redemptionHistory: [],
          autoRenew: false
        });
      }
    }

    // Notifications
    this.addNotification({
      recipientId: newOrder.studentId,
      recipientRole: 'student',
      title: 'Order Placed Successfully',
      message: `Your ${newOrder.planName || 'Meal'} order (${orderNumber}) at ${newOrder.messName} has been received.`,
      type: 'order',
      timestamp: new Date().toISOString(),
      isRead: false,
      orderId: newOrder.id
    });

    const mess = this.getMessById(newOrder.messId);
    if (mess) {
      this.addNotification({
        recipientId: mess.ownerId,
        recipientRole: 'owner',
        title: 'New Student Order Received!',
        message: `${newOrder.studentName} placed order #${orderNumber} for ₹${newOrder.grandTotal} (${newOrder.deliveryType.toUpperCase()}).`,
        type: 'order',
        timestamp: new Date().toISOString(),
        isRead: false,
        orderId: newOrder.id
      });
      playNotificationSound();
    }

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['orderStatus'], rejectionReason?: string) {
    const orders = this.getOrders().map(o => {
      if (o.id === orderId) {
        return { ...o, orderStatus: status, rejectionReason: rejectionReason || o.rejectionReason };
      }
      return o;
    });
    this.saveOrders(orders);

    const order = orders.find(o => o.id === orderId);
    if (order) {
      const statusLabels: Record<string, string> = {
        accepted: 'Accepted by Mess',
        preparing: 'Being Prepared in Kitchen',
        ready_for_pickup: 'Ready for Pickup at Mess Counter',
        dispatched: 'Out for Hostel Delivery',
        delivered: 'Delivered / Completed',
        rejected: `Declined: ${rejectionReason || 'Kitchen full'}`
      };

      this.addNotification({
        recipientId: order.studentId,
        recipientRole: 'student',
        title: `Order Update: #${order.orderNumber}`,
        message: `Status: ${statusLabels[status] || status}`,
        type: 'order',
        timestamp: new Date().toISOString(),
        isRead: false,
        orderId: order.id
      });
      playNotificationSound();
    }
  }

  confirmCashPayment(orderId: string) {
    const orders = this.getOrders().map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus: 'success' as const,
          paymentReceiptNumber: `RCPT-CASH-${Date.now().toString().slice(-4)}`
        };
      }
      return o;
    });
    this.saveOrders(orders);

    const order = orders.find(o => o.id === orderId);
    if (order) {
      this.addNotification({
        recipientId: order.studentId,
        recipientRole: 'student',
        title: 'Cash Payment Confirmed',
        message: `Mess owner confirmed receipt of ₹${order.grandTotal} for order #${order.orderNumber}.`,
        type: 'payment',
        timestamp: new Date().toISOString(),
        isRead: false,
        orderId: order.id
      });
    }
  }

  // --- SUBSCRIPTIONS ---
  getSubscriptions(): Subscription[] {
    const raw = localStorage.getItem(KEYS.SUBSCRIPTIONS);
    return raw ? JSON.parse(raw) : [];
  }

  saveSubscriptions(subs: Subscription[]) {
    localStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
  }

  createSubscription(subData: Omit<Subscription, 'id' | 'subscriptionNumber'>): Subscription {
    const subs = this.getSubscriptions();
    const newSub: Subscription = {
      ...subData,
      id: `sub_${Date.now()}`,
      subscriptionNumber: `SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };
    subs.unshift(newSub);
    this.saveSubscriptions(subs);
    return newSub;
  }

  cancelSubscription(subId: string, reason?: string) {
    const subs = this.getSubscriptions().map(s => {
      if (s.id === subId) {
        return { ...s, status: 'cancelled' as const };
      }
      return s;
    });
    this.saveSubscriptions(subs);

    const sub = subs.find(s => s.id === subId);
    if (sub) {
      this.addNotification({
        recipientId: sub.studentId,
        recipientRole: 'student',
        title: 'Subscription Cancelled',
        message: `Your subscription ${sub.subscriptionNumber} at ${sub.messName} was cancelled. Refund processed as per mess policy.`,
        type: 'cancellation',
        timestamp: new Date().toISOString(),
        isRead: false
      });
    }
  }

  // --- COUPONS ---
  getCoupons(): Coupon[] {
    const raw = localStorage.getItem(KEYS.COUPONS);
    return raw ? JSON.parse(raw) : [];
  }

  saveCoupons(coupons: Coupon[]) {
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
  }

  createCoupon(couponData: Omit<Coupon, 'id'>): Coupon {
    const coupons = this.getCoupons();
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup_${Date.now()}`
    };
    coupons.unshift(newCoupon);
    this.saveCoupons(coupons);
    return newCoupon;
  }

  generateDailySubscriptionCoupon(subscriptionId: string, mealType: string): Coupon {
    const subs = this.getSubscriptions();
    const sub = subs.find(s => s.id === subscriptionId);
    if (!sub) throw new Error('Subscription not found');
    if (sub.status !== 'active') throw new Error('Subscription is not currently active');
    if (sub.remainingMeals <= 0) throw new Error('No remaining meal balance on this subscription');

    const todayStr = new Date().toISOString().split('T')[0];
    const mess = this.getMessById(sub.messId);
    const messPrefix = mess ? mess.name.substring(0, 3).toUpperCase() : 'MSS';
    const code = `${messPrefix}-${mealType.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCoupon: Coupon = {
      id: `coup_${Date.now()}`,
      code,
      studentId: sub.studentId,
      studentName: sub.studentName,
      messId: sub.messId,
      messName: sub.messName,
      orderId: '',
      subscriptionId: sub.id,
      mealType: `${mealType} Token`,
      validityDate: todayStr,
      status: 'active',
      qrPayload: JSON.stringify({
        code,
        subscriptionId: sub.id,
        studentId: sub.studentId,
        studentName: sub.studentName,
        messId: sub.messId,
        mealType,
        validityDate: todayStr
      })
    };

    const coupons = this.getCoupons();
    coupons.unshift(newCoupon);
    this.saveCoupons(coupons);

    this.addNotification({
      recipientId: sub.studentId,
      recipientRole: 'student',
      title: `Daily ${mealType} Coupon Generated`,
      message: `Coupon ${code} generated for today's ${mealType} at ${sub.messName}.`,
      type: 'coupon',
      timestamp: new Date().toISOString(),
      isRead: false
    });

    return newCoupon;
  }

  redeemCoupon(code: string, currentMessId: string, ownerName: string): { success: boolean; message: string; coupon?: Coupon } {
    const cleanCode = code.trim().toUpperCase();
    const coupons = this.getCoupons();
    const couponIndex = coupons.findIndex(c => c.code.toUpperCase() === cleanCode);

    if (couponIndex === -1) {
      return { success: false, message: 'Invalid coupon code. No matching coupon found.' };
    }

    const coupon = coupons[couponIndex];

    if (coupon.messId !== currentMessId) {
      return { success: false, message: `Access Denied: This coupon is issued for ${coupon.messName}, not your mess.` };
    }

    if (coupon.status === 'redeemed') {
      return { success: false, message: `Already Redeemed: This coupon was redeemed at ${new Date(coupon.redeemedAt || '').toLocaleTimeString()}.` };
    }

    if (coupon.status === 'expired') {
      return { success: false, message: 'This coupon has expired.' };
    }

    // Mark coupon as redeemed
    coupon.status = 'redeemed';
    coupon.redeemedAt = new Date().toISOString();
    coupon.redeemedByOwner = ownerName;
    coupons[couponIndex] = coupon;
    this.saveCoupons(coupons);

    // If attached to subscription, decrement meal balance
    if (coupon.subscriptionId) {
      const subs = this.getSubscriptions().map(s => {
        if (s.id === coupon.subscriptionId) {
          const newRemaining = Math.max(0, s.remainingMeals - 1);
          const newHistory = [
            {
              id: `red_${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              mealType: coupon.mealType,
              couponCode: coupon.code,
              redeemedAt: new Date().toISOString()
            },
            ...s.redemptionHistory
          ];
          return {
            ...s,
            remainingMeals: newRemaining,
            status: newRemaining === 0 ? ('completed' as const) : s.status,
            redemptionHistory: newHistory
          };
        }
        return s;
      });
      this.saveSubscriptions(subs);
    }

    // If attached to an order, mark couponRedeemed
    if (coupon.orderId) {
      const orders = this.getOrders().map(o => {
        if (o.id === coupon.orderId) {
          return { ...o, couponRedeemed: true, orderStatus: 'delivered' as const };
        }
        return o;
      });
      this.saveOrders(orders);
    }

    this.addNotification({
      recipientId: coupon.studentId,
      recipientRole: 'student',
      title: 'Meal Coupon Redeemed!',
      message: `Your ${coupon.mealType} coupon (${coupon.code}) was verified and redeemed at ${coupon.messName}. Enjoy your meal!`,
      type: 'coupon',
      timestamp: new Date().toISOString(),
      isRead: false
    });
    playNotificationSound();

    return {
      success: true,
      message: `Verified! Coupon redeemed for ${coupon.studentName} (${coupon.mealType}).`,
      coupon
    };
  }

  // --- REVIEWS ---
  getReviews(messId?: string): Review[] {
    const raw = localStorage.getItem(KEYS.REVIEWS);
    const reviews: Review[] = raw ? JSON.parse(raw) : INITIAL_REVIEWS;
    return messId ? reviews.filter(r => r.messId === messId) : reviews;
  }

  saveReviews(reviews: Review[]) {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
  }

  addReview(reviewData: Omit<Review, 'id' | 'date' | 'reported'>): Review {
    const reviews = this.getReviews();

    // Check if already reviewed for this order
    const existing = reviews.find(r => r.orderId === reviewData.orderId && r.orderId !== '');
    if (existing) {
      throw new Error('You have already submitted a review for this completed order.');
    }

    const newReview: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      reported: false
    };

    reviews.unshift(newReview);
    this.saveReviews(reviews);

    // Recalculate mess average rating
    const messReviews = reviews.filter(r => r.messId === reviewData.messId);
    const avg = Number((messReviews.reduce((sum, r) => sum + r.rating, 0) / messReviews.length).toFixed(1));
    const messes = this.getMesses().map(m => {
      if (m.id === reviewData.messId) {
        return { ...m, rating: avg, reviewCount: messReviews.length };
      }
      return m;
    });
    this.saveMesses(messes);

    return newReview;
  }

  // --- NOTIFICATIONS ---
  getNotifications(userId: string): AppNotification[] {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    const notifs: AppNotification[] = raw ? JSON.parse(raw) : [];
    return notifs.filter(n => n.recipientId === userId);
  }

  addNotification(notif: Omit<AppNotification, 'id'>) {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    const notifs: AppNotification[] = raw ? JSON.parse(raw) : [];
    notifs.unshift({
      ...notif,
      id: `notif_${Date.now()}`
    });
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs.slice(0, 50)));
  }

  markNotificationAsRead(id: string) {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!raw) return;
    const notifs: AppNotification[] = JSON.parse(raw).map((n: AppNotification) => 
      n.id === id ? { ...n, isRead: true } : n
    );
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  markAllNotificationsRead(userId: string) {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!raw) return;
    const notifs: AppNotification[] = JSON.parse(raw).map((n: AppNotification) => 
      n.recipientId === userId ? { ...n, isRead: true } : n
    );
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  // --- SAVED MESSES ---
  getSavedMessIds(): string[] {
    const raw = localStorage.getItem(KEYS.SAVED_MESSES);
    return raw ? JSON.parse(raw) : ['mess_1'];
  }

  toggleSaveMess(messId: string): boolean {
    const saved = this.getSavedMessIds();
    let isSaved = false;
    let nextSaved: string[];
    if (saved.includes(messId)) {
      nextSaved = saved.filter(id => id !== messId);
      isSaved = false;
    } else {
      nextSaved = [...saved, messId];
      isSaved = true;
    }
    localStorage.setItem(KEYS.SAVED_MESSES, JSON.stringify(nextSaved));
    return isSaved;
  }

  // --- SOUND TOGGLE ---
  isSoundEnabled(): boolean {
    return localStorage.getItem(KEYS.SOUND_ENABLED) !== 'false';
  }

  setSoundEnabled(enabled: boolean) {
    localStorage.setItem(KEYS.SOUND_ENABLED, enabled ? 'true' : 'false');
  }
}

export const storage = new StorageService();
