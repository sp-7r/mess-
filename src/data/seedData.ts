import { MessListing, FoodItem, WeeklyMenu, MealPlan, User, Review } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_student_1',
    name: 'Pratik Sharma',
    email: 'pratik@student.ac.in',
    phone: '+91 98765 43210',
    role: 'student',
    college: 'Pune Institute of Computer Technology (PICT)',
    hostelAddress: 'Room 304, Kaveri Boys Hostel, Kothrud, Pune, Maharashtra 411038',
    savedAddresses: [
      'Room 304, Kaveri Boys Hostel, Kothrud, Pune, 411038',
      'Flat 12, Swapnashilp Apartments, Paud Road, Pune, 411038'
    ],
    dietaryPreference: 'veg',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'user_owner_1',
    name: 'Ramesh Kulkarni',
    email: 'annapoorna@messbhojan.in',
    phone: '+91 98220 11223',
    role: 'owner',
    ownerMessId: 'mess_1',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'user_owner_2',
    name: 'Murugan Sundaram',
    email: 'srikrishna@messbhojan.in',
    phone: '+91 94440 55667',
    role: 'owner',
    ownerMessId: 'mess_2',
    createdAt: '2026-02-10T09:00:00Z'
  },
  {
    id: 'user_owner_3',
    name: 'Vikram Singh Shekhawat',
    email: 'musclefuel@messbhojan.in',
    phone: '+91 99820 44556',
    role: 'owner',
    ownerMessId: 'mess_3',
    createdAt: '2026-03-01T09:00:00Z'
  },
  {
    id: 'user_admin_1',
    name: 'Platform Administrator',
    email: 'admin@messbhojan.in',
    phone: '+91 80000 12345',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

export const OWNER_CREDENTIALS: Record<string, { username: string; messId: string; messName: string }> = {
  'annapoorna_owner': { username: 'annapoorna_owner', messId: 'mess_1', messName: 'Annapoorna Deluxe Student Mess' },
  'srikrishna_owner': { username: 'srikrishna_owner', messId: 'mess_2', messName: 'Sri Krishna Udupi & Tamil Mess' },
  'musclefuel_owner': { username: 'musclefuel_owner', messId: 'mess_3', messName: 'MuscleFuel Fitness Mess' }
};

export const INITIAL_MESSES: MessListing[] = [
  {
    id: 'mess_1',
    name: 'Annapoorna Deluxe Student Mess',
    tagline: 'Ghar jaisa khana with unlimited warm phulkas & pure ghee',
    description: 'Serving students in Kothrud since 2012. Known for clean stainless steel dining, hygienic steam-cooked rice, authentic Maharashtrian & North Indian curries, and home-like care. Zero soda, zero artificial colors.',
    coverImage: '/src/assets/images/mess_thali_deluxe_1792159589994.jpg',
    galleryImages: [
      '/src/assets/images/mess_thali_deluxe_1792159589994.jpg',
      '/src/assets/images/mess_dining_hall_1792159590759.jpg'
    ],
    address: 'Near MIT WPU Gate 3, Mayur Colony, Kothrud',
    locality: 'Kothrud',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411038',
    lat: 18.5074,
    lng: 73.8077,
    rating: 4.8,
    reviewCount: 342,
    isVegOnly: true,
    hasNonVeg: false,
    hasJain: true,
    hasSouthIndian: false,
    hasNorthIndian: true,
    hasHighProtein: true,
    monthlyBasePrice: 2950,
    singleMealPrice: 90,
    openingHours: {
      breakfast: '07:30 AM - 10:00 AM',
      lunch: '11:45 AM - 02:45 PM',
      dinner: '07:30 PM - 10:30 PM'
    },
    homeDeliveryAvailable: true,
    pickupAvailable: true,
    deliveryRadiusKm: 3.5,
    deliveryFee: 15,
    trialMealAvailable: true,
    trialMealPrice: 85,
    approved: true,
    active: true,
    contactPhone: '+91 98220 11223',
    contactEmail: 'annapoorna.pune@gmail.com',
    fssaiNumber: '11522038000491',
    rules: [
      'Carry your student digital coupon on mobile for mess entry',
      'Lunch timings strictly till 02:45 PM',
      'Waste free dining incentive: Clean plate earns bonus weekly dessert coupon',
      'Hostel delivery orders close 30 minutes before meal shift'
    ],
    cancellationPolicy: 'Subscriptions can be paused up to 4 days per month with 12 hours advance intimation in the app.',
    ownerId: 'user_owner_1',
    ownerUsername: 'annapoorna_owner',
    todayMenuSnippet: 'Paneer Butter Masala, Dal Tadka, Ghee Phulkas, Jeera Rice, Gulab Jamun'
  },
  {
    id: 'mess_2',
    name: 'Sri Krishna Udupi & Tamil Mess',
    tagline: 'Authentic South Indian meals on fresh banana leaf & filter coffee',
    description: 'Traditional South Indian mess catering to Christ & St. John college students. Pure vegetarian, cooked in groundnut oil and fresh coconut. Unlimited sambar, rasam, and fresh moru (spiced buttermilk).',
    coverImage: '/src/assets/images/mess_south_indian_meal_1792159590758.jpg',
    galleryImages: [
      '/src/assets/images/mess_south_indian_meal_1792159590758.jpg',
      '/src/assets/images/mess_dining_hall_1792159590759.jpg'
    ],
    address: '8th Cross, 7th Main, 4th Block, Koramangala',
    locality: 'Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    lat: 12.9352,
    lng: 77.6245,
    rating: 4.7,
    reviewCount: 289,
    isVegOnly: true,
    hasNonVeg: false,
    hasJain: false,
    hasSouthIndian: true,
    hasNorthIndian: false,
    hasHighProtein: false,
    monthlyBasePrice: 2800,
    singleMealPrice: 80,
    openingHours: {
      breakfast: '07:00 AM - 10:30 AM',
      lunch: '12:00 PM - 03:00 PM',
      dinner: '07:00 PM - 10:00 PM'
    },
    homeDeliveryAvailable: true,
    pickupAvailable: true,
    deliveryRadiusKm: 4.0,
    deliveryFee: 20,
    trialMealAvailable: true,
    trialMealPrice: 75,
    approved: true,
    active: true,
    contactPhone: '+91 94440 55667',
    contactEmail: 'srikrishna.udupi@gmail.com',
    fssaiNumber: '11221033000812',
    rules: [
      'Traditional hand-wash protocol before eating',
      'Filter coffee included with monthly breakfast plan',
      'Banana leaf dining available at mess counters'
    ],
    cancellationPolicy: 'Refund calculated pro-rata on remaining eligible meals minus 5% processing fee.',
    ownerId: 'user_owner_2',
    ownerUsername: 'srikrishna_owner',
    todayMenuSnippet: 'Steaming Ponni Rice, Drumstick Sambar, Tomato Rasam, Medu Vada, Appalam'
  },
  {
    id: 'mess_3',
    name: 'MuscleFuel Fitness & Student Kitchen',
    tagline: 'High-protein macro-counted meals for gym & competitive students',
    description: 'Designed specifically for students who hit the gym and need 35g-45g protein per meal. Every box displays grams of protein, carbs, and calories. Prepared with extra virgin olive oil and boiled sprouts.',
    coverImage: '/src/assets/images/mess_high_protein_bowl_1792159590781.jpg',
    galleryImages: [
      '/src/assets/images/mess_high_protein_bowl_1792159590781.jpg',
      '/src/assets/images/mess_thali_deluxe_1792159589994.jpg'
    ],
    address: 'Plot 42, Vigyan Nagar Coaching Corridor, Road No. 1',
    locality: 'Vigyan Nagar',
    city: 'Kota',
    state: 'Rajasthan',
    pincode: '324005',
    lat: 25.1328,
    lng: 75.8361,
    rating: 4.9,
    reviewCount: 412,
    isVegOnly: false,
    hasNonVeg: true,
    hasJain: false,
    hasSouthIndian: false,
    hasNorthIndian: true,
    hasHighProtein: true,
    monthlyBasePrice: 3800,
    singleMealPrice: 130,
    openingHours: {
      breakfast: '06:45 AM - 09:30 AM',
      lunch: '12:00 PM - 02:30 PM',
      dinner: '07:15 PM - 10:30 PM'
    },
    homeDeliveryAvailable: true,
    pickupAvailable: true,
    deliveryRadiusKm: 5.0,
    deliveryFee: 10,
    trialMealAvailable: true,
    trialMealPrice: 110,
    approved: true,
    active: true,
    contactPhone: '+91 99820 44556',
    contactEmail: 'musclefuel.kota@gmail.com',
    fssaiNumber: '12220042000109',
    rules: [
      'Customized diet sheet updated weekly',
      'Egg white / Paneer portion scales verified daily',
      'Timely hostel delivery during peak coaching exam schedules'
    ],
    cancellationPolicy: 'Can pause subscription anytime with 1 day prior notice during study breaks.',
    ownerId: 'user_owner_3',
    ownerUsername: 'musclefuel_owner',
    todayMenuSnippet: 'Grilled Paneer Chunks, Boiled Soya, Sprouted Moong Salad, Brown Rice (42g Protein)'
  },
  {
    id: 'mess_4',
    name: 'Maa Ki Rasoi Ghar Ka Khana',
    tagline: 'North Indian homely dabba service & budget unlimited thali',
    description: 'Favorite among Delhi University North Campus students. Pure vegetarian, Jain options available on request, soft tawa rotis with no maida, and homestyle yellow dal tadka.',
    coverImage: '/src/assets/images/mess_thali_deluxe_1792159589994.jpg',
    galleryImages: ['/src/assets/images/mess_thali_deluxe_1792159589994.jpg'],
    address: 'Near Kirori Mal Hostel, Kamla Nagar Market',
    locality: 'Kamla Nagar',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110007',
    lat: 28.6833,
    lng: 77.2081,
    rating: 4.6,
    reviewCount: 198,
    isVegOnly: true,
    hasNonVeg: false,
    hasJain: true,
    hasSouthIndian: false,
    hasNorthIndian: true,
    hasHighProtein: false,
    monthlyBasePrice: 2600,
    singleMealPrice: 75,
    openingHours: {
      breakfast: '08:00 AM - 10:30 AM',
      lunch: '12:30 PM - 03:00 PM',
      dinner: '08:00 PM - 10:30 PM'
    },
    homeDeliveryAvailable: true,
    pickupAvailable: true,
    deliveryRadiusKm: 3.0,
    deliveryFee: 15,
    trialMealAvailable: true,
    trialMealPrice: 70,
    approved: true,
    active: true,
    contactPhone: '+91 98110 33445',
    contactEmail: 'maakirasoi.du@gmail.com',
    fssaiNumber: '13319007000234',
    rules: ['Jain food requires 1 hour advance notification'],
    cancellationPolicy: 'Full refund if cancelled before 1st of every month.',
    ownerId: 'user_owner_1',
    ownerUsername: 'annapoorna_owner',
    todayMenuSnippet: 'Aloo Gobhi Masala, Yellow Moong Dal, 4 Tawa Rotis, Jeera Rice, Boondi Raita'
  },
  {
    id: 'mess_5',
    name: 'Hyderabadi Ruchulu Andhra Mess',
    tagline: 'Spicy Pappu, Gongura pachadi, curd chillies & Sunday Dum Biryani',
    description: 'Authentic Rayalaseema & Telangana student mess right in the Gachibowli educational hub. Famous for authentic spicy pappu with ghee, gun powder, chicken fry, and egg curries.',
    coverImage: '/src/assets/images/mess_south_indian_meal_1792159590758.jpg',
    galleryImages: ['/src/assets/images/mess_south_indian_meal_1792159590758.jpg'],
    address: 'Telecom Nagar, Gachibowli, Near IIIT Junction',
    locality: 'Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    lat: 17.4401,
    lng: 78.3489,
    rating: 4.7,
    reviewCount: 310,
    isVegOnly: false,
    hasNonVeg: true,
    hasJain: false,
    hasSouthIndian: true,
    hasNorthIndian: false,
    hasHighProtein: true,
    monthlyBasePrice: 3200,
    singleMealPrice: 95,
    openingHours: {
      breakfast: '07:30 AM - 10:30 AM',
      lunch: '12:15 PM - 03:30 PM',
      dinner: '07:30 PM - 10:45 PM'
    },
    homeDeliveryAvailable: true,
    pickupAvailable: true,
    deliveryRadiusKm: 4.5,
    deliveryFee: 20,
    trialMealAvailable: true,
    trialMealPrice: 90,
    approved: true,
    active: true,
    contactPhone: '+91 94900 88990',
    contactEmail: 'ruchulu.mess@gmail.com',
    fssaiNumber: '13620011000678',
    rules: ['Sunday Biryani coupon must be redeemed before 2 PM'],
    cancellationPolicy: '5 meals rollover to next calendar month on active plans.',
    ownerId: 'user_owner_2',
    ownerUsername: 'srikrishna_owner',
    todayMenuSnippet: 'Andhra Tomato Pappu, Gongura Chutney, Chicken Roast, Rasam, Curd'
  }
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  // Mess 1 items
  {
    id: 'food_101',
    messId: 'mess_1',
    name: 'Special Maharaja Thali',
    description: 'Paneer sabzi, seasonal veg, dal tadka, 4 phulkas with pure ghee, jeera rice, salad & sweet.',
    price: 110,
    category: 'Thali',
    mealType: 'lunch',
    cuisine: 'north_indian',
    isVeg: true,
    isHighProtein: true,
    proteinGrams: 28,
    calories: 680,
    isAvailable: true,
    ingredients: ['Paneer', 'Moong Dal', 'Whole Wheat', 'Jeera Rice', 'Desi Ghee'],
    imageUrl: '/src/assets/images/mess_thali_deluxe_1792159589994.jpg'
  },
  {
    id: 'food_102',
    messId: 'mess_1',
    name: 'Regular Student Meal',
    description: 'Dry bhaji, dal fry, 4 warm chapatis, steamed rice, and fresh onion lemon salad.',
    price: 85,
    category: 'Roti & Sabzi',
    mealType: 'all',
    cuisine: 'maharashtrian',
    isVeg: true,
    isHighProtein: false,
    proteinGrams: 16,
    calories: 520,
    isAvailable: true,
    ingredients: ['Seasonal Veg', 'Toor Dal', 'Wheat Phulka', 'Steamed Rice'],
    imageUrl: '/src/assets/images/mess_thali_deluxe_1792159589994.jpg'
  },
  {
    id: 'food_103',
    messId: 'mess_1',
    name: 'High Protein Soya Sabzi + Dal Thali',
    description: 'Boiled soya granules sabzi (30g protein) with whole wheat phulkas & sprouted salad.',
    price: 100,
    category: 'Soya & Sprouts',
    mealType: 'dinner',
    cuisine: 'north_indian',
    isVeg: true,
    isHighProtein: true,
    proteinGrams: 36,
    calories: 590,
    isAvailable: true,
    ingredients: ['Soya Chunks', 'Moong Sprouts', 'Toor Dal', 'Whole Wheat'],
    imageUrl: '/src/assets/images/mess_high_protein_bowl_1792159590781.jpg'
  },
  {
    id: 'food_104',
    messId: 'mess_1',
    name: 'Poha with Roasted Peanuts & Sev',
    description: 'Light Maharashtrian breakfast kanda poha garnished with fresh coconut, coriander & lemon.',
    price: 40,
    category: 'Breakfast',
    mealType: 'breakfast',
    cuisine: 'maharashtrian',
    isVeg: true,
    isHighProtein: false,
    proteinGrams: 7,
    calories: 280,
    isAvailable: true,
    ingredients: ['Flattened Rice', 'Peanuts', 'Onion', 'Curry Leaves']
  },

  // Mess 2 items
  {
    id: 'food_201',
    messId: 'mess_2',
    name: 'South Indian Unlimited Meals',
    description: 'Served on banana leaf with hot rice, drumstick sambar, pepper rasam, vegetable kootu, moru & appalam.',
    price: 85,
    category: 'South Indian',
    mealType: 'lunch',
    cuisine: 'south_indian',
    isVeg: true,
    isHighProtein: false,
    proteinGrams: 18,
    calories: 610,
    isAvailable: true,
    ingredients: ['Ponni Rice', 'Toor Dal', 'Tamarind', 'Vegetables', 'Curd'],
    imageUrl: '/src/assets/images/mess_south_indian_meal_1792159590758.jpg'
  },
  {
    id: 'food_202',
    messId: 'mess_2',
    name: 'Idli Vada Combo with Filter Coffee',
    description: '3 soft steamed idlis, 1 crispy medu vada, fresh coconut chutney & piping hot sambar.',
    price: 60,
    category: 'Breakfast',
    mealType: 'breakfast',
    cuisine: 'south_indian',
    isVeg: true,
    isHighProtein: true,
    proteinGrams: 14,
    calories: 390,
    isAvailable: true,
    ingredients: ['Urad Dal', 'Idli Rice', 'Coconut', 'Spices']
  },

  // Mess 3 items
  {
    id: 'food_301',
    messId: 'mess_3',
    name: 'Pro-Gym Paneer & Sprout Box',
    description: '150g grilled paneer cubes, boiled soya chunks, sprouted moong bowl, broccoli & brown rice.',
    price: 135,
    category: 'Paneer Dishes',
    mealType: 'all',
    cuisine: 'north_indian',
    isVeg: true,
    isHighProtein: true,
    proteinGrams: 44,
    calories: 640,
    isAvailable: true,
    ingredients: ['Low Fat Paneer', 'Soya Chunks', 'Moong Sprouts', 'Broccoli', 'Brown Rice'],
    imageUrl: '/src/assets/images/mess_high_protein_bowl_1792159590781.jpg'
  },
  {
    id: 'food_302',
    messId: 'mess_3',
    name: 'Boiled Egg & Chicken Curry Thali',
    description: 'Homestyle chicken curry with 2 boiled eggs, whole wheat rotis & steamed rice.',
    price: 140,
    category: 'Non-Veg',
    mealType: 'dinner',
    cuisine: 'north_indian',
    isVeg: false,
    isHighProtein: true,
    proteinGrams: 48,
    calories: 690,
    isAvailable: true,
    ingredients: ['Chicken Breast', 'Eggs', 'Whole Wheat', 'Onion Gravy'],
    imageUrl: '/src/assets/images/mess_high_protein_bowl_1792159590781.jpg'
  }
];

export const INITIAL_WEEKLY_MENUS: Record<string, WeeklyMenu> = {
  mess_1: {
    messId: 'mess_1',
    monday: {
      breakfast: ['Kanda Poha', 'Upma', 'Tea / Milk'],
      lunch: ['Paneer Butter Masala', 'Moong Dal Tadka', 'Ghee Phulkas (4)', 'Jeera Rice', 'Kachumber Salad'],
      dinner: ['Sev Bhaji', 'Toor Dal Fry', 'Phulkas', 'Rice', 'Gulab Jamun'],
      specialNote: 'Pure Desi Ghee on phulkas'
    },
    tuesday: {
      breakfast: ['Misal Pav with Farsan', 'Boiled Sprouts', 'Tea'],
      lunch: ['Chole Masala', 'Aloo Palak', 'Phulkas (4)', 'Steamed Rice', 'Boondi Raita'],
      dinner: ['Baingan Bharta', 'Panchmel Dal', 'Phulkas', 'Rice', 'Sheera'],
      specialNote: 'Jain preparation available on notice'
    },
    wednesday: {
      breakfast: ['Aloo Paratha with Curd', 'Poha', 'Tea / Milk'],
      lunch: ['Matar Paneer', 'Dal Fry', 'Phulkas (4)', 'Pulav', 'Green Salad'],
      dinner: ['Mix Veg Handi', 'Kadhi Khichdi', 'Phulkas', 'Papad', 'Moong Halwa']
    },
    thursday: {
      breakfast: ['Sabudana Khichdi (Fast friendly)', 'Banana', 'Milk'],
      lunch: ['Rajma Masala', 'Lauki Kofta', 'Phulkas (4)', 'Jeera Rice', 'Pickle'],
      dinner: ['Soyabean Masala (High Protein)', 'Dal Tadka', 'Phulkas', 'Rice', 'Fruit Custard']
    },
    friday: {
      breakfast: ['Methi Thepla with Chutney', 'Upma', 'Tea'],
      lunch: ['Dum Aloo Kashmiri', 'Yellow Dal', 'Phulkas (4)', 'Veg Biryani', 'Raita'],
      dinner: ['Palak Paneer', 'Dal Fry', 'Phulkas', 'Steamed Rice', 'Jalebi']
    },
    saturday: {
      breakfast: ['Masala Dosa with Chutney', 'Sambar', 'Tea'],
      lunch: ['Shahi Paneer', 'Dal Makhani', 'Phulkas (4)', 'Peas Pulav', 'Papad'],
      dinner: ['Pav Bhaji (Special)', 'Tawa Pulao', 'Sweet Lassi']
    },
    sunday: {
      breakfast: ['Puri Bhaji with Halwa', 'Filter Coffee'],
      lunch: ['Special Sunday Feast: Paneer Tikka Masala, Dal Maharani, Parathas, Veg Dum Biryani, Ice Cream'],
      dinner: ['Khichdi Kadhi', 'Aloo Jeera', 'Phulkas', 'Roasted Papad'],
      specialNote: 'Grand Sunday Feast included in monthly pass'
    }
  },
  mess_2: {
    messId: 'mess_2',
    monday: {
      breakfast: ['Idli & Medu Vada', 'Coconut Chutney', 'Sambar', 'Filter Coffee'],
      lunch: ['Ponni Rice', 'Drumstick Sambar', 'Tomato Rasam', 'Cabbage Kootu', 'Appalam', 'Moru'],
      dinner: ['Chapati with Kurma', 'Curd Rice with Pomegranate', 'Pickle']
    },
    tuesday: {
      breakfast: ['Ven Pongal with Ghee', 'Vada', 'Sambar', 'Coffee'],
      lunch: ['Rice', 'Vathal Kuzhambu', 'Pepper Rasam', 'Avial', 'Appalam', 'Curd'],
      dinner: ['Set Dosa with Vadacurry', 'Chutney', 'Warm Milk']
    },
    wednesday: {
      breakfast: ['Rava Upma with Chutney', 'Poha', 'Filter Coffee'],
      lunch: ['Rice', 'Arachuvitta Sambar', 'Lemon Rasam', 'Potato Roast', 'Papad', 'Curd'],
      dinner: ['Poori with Masala', 'Tomato Rice', 'Raita']
    },
    thursday: {
      breakfast: ['Onion Uttapam', 'Sambar', 'Tomato Chutney', 'Coffee'],
      lunch: ['Rice', 'Mor Kuzhambu (Buttermilk curry)', 'Garlic Rasam', 'Beetroot Poriyal', 'Appalam'],
      dinner: ['Idiyappam with Coconut Milk / Veg Kurma', 'Curd Rice']
    },
    friday: {
      breakfast: ['Poori with Aloo Sagu', 'Kesari Bath', 'Coffee'],
      lunch: ['Rice', 'Brinjal Sambar', 'Mysore Rasam', 'Beans Usili', 'Payasam', 'Curd'],
      dinner: ['Masala Dosa', 'Coconut Chutney', 'Sambar']
    },
    saturday: {
      breakfast: ['Pesarattu with Ginger Chutney', 'Upma', 'Coffee'],
      lunch: ['Rice', 'Radish Sambar', 'Ginger Rasam', 'Raw Banana Fry', 'Curd'],
      dinner: ['Bisibelebath with Boondi', 'Potato Chips', 'Semiya Payasam']
    },
    sunday: {
      breakfast: ['Special Rava Dosa', 'Vada', 'Chutney & Sambar', 'Filter Coffee'],
      lunch: ['Banana Leaf Feast: Rice, Special Sambar, Pineapple Rasam, Sweet Pongal, 2 Poriyals, Appalam, Curd'],
      dinner: ['Light Phulkas with Paneer Kurma', 'Curd Rice']
    }
  },
  mess_3: {
    messId: 'mess_3',
    monday: {
      breakfast: ['4 Boiled Egg Whites / 100g Tofu', 'Oats Porridge with Almonds & Banana'],
      lunch: ['150g Grilled Paneer / Chicken Breast', 'Sprouted Moong Salad', 'Brown Rice', 'Steamed Veggies (45g Protein)'],
      dinner: ['Soya Chunks Curry', 'Dal Tadka', '3 Multigrain Rotis', 'Cucumber Salad']
    },
    tuesday: {
      breakfast: ['Peanut Butter Multigrain Toast', 'Boiled Sprouts Bowl', 'Black Coffee / Milk'],
      lunch: ['Egg Curry (3 Eggs) / Paneer Bhurji (150g)', 'Dal', 'Brown Rice', 'Green Salad'],
      dinner: ['Chicken Roast / Grilled Paneer', 'Lauki Raita', '3 Bajra Rotis']
    },
    wednesday: {
      breakfast: ['Moong Dal Chilla with Paneer Stuffing', 'Mint Chutney', 'Fruit Bowl'],
      lunch: ['Boiled Chicken Breast / Soya Kebab Box', 'Quinoa / Brown Rice', 'Steamed Broccoli'],
      dinner: ['Chana Masala (High Fiber)', 'Palak Dal', '3 Multigrain Rotis']
    },
    thursday: {
      breakfast: ['Scrambled Eggs (4 whites) / Besan Chilla', 'Oatmeal with Seeds'],
      lunch: ['Paneer Tikka Meal Box', 'Brown Rice', 'Lentil Soup', 'Beetroot Salad'],
      dinner: ['Tawa Chicken / Soya Granules Bhurji', 'Phulkas', 'Curd']
    },
    friday: {
      breakfast: ['Sprout Salad Bowl with Roasted Peanuts & Lime', 'Boiled Eggs', 'Whey / Milk'],
      lunch: ['Chicken Biryani (High Protein Low Oil) / Soya Biryani', 'Cucumber Mint Raita'],
      dinner: ['Grilled Fish / Paneer Steak', 'Sautéed Vegetables', 'Brown Rice']
    },
    saturday: {
      breakfast: ['Protein Pancakes with Honey', 'Boiled Eggs / Tofu Cubes'],
      lunch: ['Paneer Butter Masala (Low Calorie) / Egg Roast', '3 Multigrain Rotis', 'Dal'],
      dinner: ['Soya Chunk Pulao with Sprout Salad', 'Curd with Chia Seeds']
    },
    sunday: {
      breakfast: ['Eggs Benedict on Multigrain / Stuffed Paneer Paratha with Curd'],
      lunch: ['Sunday High-Protein Cheat Feast: Grilled Chicken / Paneer Skewers, Jeera Brown Rice, Protein Pudding'],
      dinner: ['Light Moong Dal Khichdi with Steamed Broccoli', 'Sprouts Bowl']
    }
  }
};

export const INITIAL_MEAL_PLANS: MealPlan[] = [
  // Mess 1 Plans
  {
    id: 'plan_101',
    messId: 'mess_1',
    name: 'Single Trial Meal Pass',
    planType: 'trial',
    description: 'Experience one delicious, unlimited homely meal. Try before you subscribe with instant digital coupon.',
    price: 85,
    durationDays: 1,
    includedMealsCount: 1,
    mealTypes: ['lunch', 'dinner'],
    serviceDays: 'Valid for selected date (Lunch or Dinner)',
    allowsDelivery: true,
    deliveryChargeMonthly: 0,
    isActive: true,
    cancellationPolicy: '100% refund if cancelled 2 hours before meal slot.'
  },
  {
    id: 'plan_102',
    messId: 'mess_1',
    name: 'Executive 30-Day Lunch & Dinner Plan',
    planType: 'monthly',
    description: 'Complete student nutrition: 60 meals (Lunch + Dinner) with unlimited warm ghee phulkas, Sunday grand feast & 4 free pause days.',
    price: 2950,
    durationDays: 30,
    includedMealsCount: 60,
    mealTypes: ['lunch', 'dinner'],
    serviceDays: 'Monday to Sunday (All 30 Days)',
    allowsDelivery: true,
    deliveryChargeMonthly: 250,
    isActive: true,
    cancellationPolicy: 'Pause up to 4 days anytime via app. Pro-rata refund on unused meals with 48h notice.'
  },
  {
    id: 'plan_103',
    messId: 'mess_1',
    name: 'All-Inclusive 3-Meal Daily Plan (Breakfast + Lunch + Dinner)',
    planType: 'monthly',
    description: 'Zero food worries! Hot breakfast with tea, unlimited lunch thali, and wholesome dinner for 30 days (90 meals total).',
    price: 3600,
    durationDays: 30,
    includedMealsCount: 90,
    mealTypes: ['breakfast', 'lunch', 'dinner'],
    serviceDays: 'All 7 Days',
    allowsDelivery: true,
    deliveryChargeMonthly: 300,
    isActive: true,
    cancellationPolicy: 'Pause up to 5 days with simple app button.'
  },
  {
    id: 'plan_104',
    messId: 'mess_1',
    name: 'Annual Student Academic Pass (10 Months)',
    planType: 'annual',
    description: 'Full academic year pass with 15% discount. Covers 600 meals with guaranteed seat reservation during exam rush.',
    price: 26500,
    durationDays: 300,
    includedMealsCount: 600,
    mealTypes: ['lunch', 'dinner'],
    serviceDays: 'Academic Calendar (10 Months)',
    allowsDelivery: true,
    deliveryChargeMonthly: 1500,
    isActive: true,
    cancellationPolicy: 'Refundable for remaining academic semester if relocating colleges.',
    discountPercentage: 15
  },

  // Mess 2 Plans
  {
    id: 'plan_201',
    messId: 'mess_2',
    name: 'Banana Leaf Meal Trial',
    planType: 'trial',
    description: 'One full authentic South Indian banana leaf meal with sambar, rasam, kootu & appalam.',
    price: 75,
    durationDays: 1,
    includedMealsCount: 1,
    mealTypes: ['lunch'],
    serviceDays: 'Select day',
    allowsDelivery: true,
    deliveryChargeMonthly: 0,
    isActive: true,
    cancellationPolicy: 'Refundable up to 2 hours before lunch'
  },
  {
    id: 'plan_202',
    messId: 'mess_2',
    name: 'South Indian Monthly Lunch Plan',
    planType: 'monthly',
    description: '30 delicious traditional lunches with authentic Tamil & Udupi sambar and freshly churned spiced buttermilk.',
    price: 1950,
    durationDays: 30,
    includedMealsCount: 30,
    mealTypes: ['lunch'],
    serviceDays: 'Mon to Sun',
    allowsDelivery: true,
    deliveryChargeMonthly: 200,
    isActive: true,
    cancellationPolicy: 'Cancel anytime with remaining meal pro-rata credit.'
  },
  {
    id: 'plan_203',
    messId: 'mess_2',
    name: 'Complete South Indian 2-Meal Subscription (Lunch + Dinner)',
    planType: 'monthly',
    description: '60 wholesome South Indian meals including unlimited rice, sambar, rasam for lunch and light rotis/curd rice for dinner.',
    price: 2800,
    durationDays: 30,
    includedMealsCount: 60,
    mealTypes: ['lunch', 'dinner'],
    serviceDays: 'All 7 Days',
    allowsDelivery: true,
    deliveryChargeMonthly: 250,
    isActive: true,
    cancellationPolicy: '3 pause days allowed per billing cycle.'
  },

  // Mess 3 Plans
  {
    id: 'plan_301',
    messId: 'mess_3',
    name: 'High Protein Fitness Trial Box',
    planType: 'trial',
    description: 'One complete macro-verified box (40g+ protein) with paneer, soya chunks, sprouts, and brown rice.',
    price: 110,
    durationDays: 1,
    includedMealsCount: 1,
    mealTypes: ['lunch', 'dinner'],
    serviceDays: 'Any day',
    allowsDelivery: true,
    deliveryChargeMonthly: 0,
    isActive: true,
    cancellationPolicy: 'Refundable with 4 hours notice'
  },
  {
    id: 'plan_302',
    messId: 'mess_3',
    name: 'MuscleFuel 30-Day Pro Athlete Subscription',
    planType: 'monthly',
    description: '60 high-protein meals (Lunch + Dinner) delivering 35g-45g protein per meal. Macro consultation included.',
    price: 3800,
    durationDays: 30,
    includedMealsCount: 60,
    mealTypes: ['lunch', 'dinner'],
    serviceDays: 'Mon to Sun',
    allowsDelivery: true,
    deliveryChargeMonthly: 200,
    isActive: true,
    cancellationPolicy: 'Pause during exam leave or coaching test series.'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    messId: 'mess_1',
    studentId: 'user_student_1',
    studentName: 'Pratik Sharma (PICT)',
    rating: 5,
    foodQuality: 5,
    hygiene: 5,
    taste: 5,
    valueForMoney: 5,
    comment: 'Best mess in Kothrud! The phulkas are served hot with pure ghee right at your table. Very clean stainless steel plates and the staff is super polite. Saved me from junk food during semester exams.',
    date: '2026-09-12',
    orderId: 'ord_demo_1',
    verifiedOrder: true,
    reported: false
  },
  {
    id: 'rev_2',
    messId: 'mess_1',
    studentId: 'user_student_2',
    studentName: 'Aditi Joshi (MIT WPU)',
    rating: 4.8,
    foodQuality: 5,
    hygiene: 5,
    taste: 4.5,
    valueForMoney: 5,
    comment: 'The monthly subscription QR coupon system is super convenient. I just show my phone and get my hot thali in 2 minutes without waiting in long token queues.',
    date: '2026-09-20',
    orderId: 'ord_demo_2',
    verifiedOrder: true,
    reported: false
  },
  {
    id: 'rev_3',
    messId: 'mess_2',
    studentId: 'user_student_3',
    studentName: 'Karthik Raman (Christ Univ)',
    rating: 4.9,
    foodQuality: 5,
    hygiene: 4.8,
    taste: 5,
    valueForMoney: 5,
    comment: 'Authentic taste just like home in Chennai. Sambar and pepper rasam are unmatched. Filter coffee with morning idli vada is the best routine before lectures.',
    date: '2026-09-18',
    orderId: 'ord_demo_3',
    verifiedOrder: true,
    reported: false
  },
  {
    id: 'rev_4',
    messId: 'mess_3',
    studentId: 'user_student_4',
    studentName: 'Harsh Vardhan (Allen Kota)',
    rating: 5,
    foodQuality: 5,
    hygiene: 5,
    taste: 4.8,
    valueForMoney: 5,
    comment: 'Finally a mess in Kota that tracks actual grams of protein! The grilled paneer and soya chunks bowl keeps me energetic through 12 hours of JEE prep.',
    date: '2026-09-25',
    orderId: 'ord_demo_4',
    verifiedOrder: true,
    reported: false
  }
];

export const POPULAR_CITIES = [
  'Pune',
  'Bengaluru',
  'Delhi',
  'Kota',
  'Hyderabad',
  'Mumbai',
  'Jaipur',
  'Chennai',
  'Ahmedabad'
];

export const CITY_LOCALITIES: Record<string, string[]> = {
  'Pune': ['All Areas', 'Kothrud', 'Deccan Gymkhana', 'Shivajinagar', 'Viman Nagar', 'Akurdi', 'Hinjewadi'],
  'Bengaluru': ['All Areas', 'Koramangala', 'Electronic City', 'HSR Layout', 'BTM Layout', 'Indiranagar', 'Yelahanka'],
  'Delhi': ['All Areas', 'Kamla Nagar', 'Mukherjee Nagar', 'Vijay Nagar', 'Satya Niketan', 'Laxmi Nagar'],
  'Kota': ['All Areas', 'Vigyan Nagar', 'Talwandi', 'Mahaveer Nagar', 'Indraprastha Area', 'Rajeev Gandhi Nagar'],
  'Hyderabad': ['All Areas', 'Gachibowli', 'Madhapur', 'Ameerpet', 'Kondapur', 'Kukatpally']
};
