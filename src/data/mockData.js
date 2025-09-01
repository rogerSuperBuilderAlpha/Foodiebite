// Mock data for FoodieBite demo app

export const mockUsers = [
  {
    id: '1',
    username: 'thegoldenbalance',
    displayName: 'The Golden Balance',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b169a5ad?w=150&h=150&fit=crop&crop=face',
    bio: 'Nutrition coach sharing balanced recipes for a golden lifestyle ✨',
    isCreator: true,
    followers: 12500,
    following: 342,
    recipesCount: 89,
    verified: true
  },
  {
    id: '2', 
    username: 'justkriston',
    displayName: 'Just Kriston',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Home cook sharing simple, delicious everyday meals 🍳',
    isCreator: true,
    followers: 8900,
    following: 156,
    recipesCount: 67,
    verified: true
  },
  {
    id: '3',
    username: 'stealth_health_life',
    displayName: 'Stealth Health Life',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Making healthy eating fun and accessible for everyone 🥗💪',
    isCreator: true,
    followers: 15200,
    following: 289,
    recipesCount: 134,
    verified: true
  },
  {
    id: '4',
    username: 'foodie_explorer',
    displayName: 'Foodie Explorer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Exploring flavors from around the world 🌍',
    isCreator: false,
    followers: 234,
    following: 567,
    recipesCount: 12,
    verified: false
  }
];

export const mockRecipes = [
  {
    id: '1',
    title: 'Golden Turmeric Latte Bowl',
    description: 'A warming, anti-inflammatory breakfast bowl perfect for cozy mornings',
    author: mockUsers[0],
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&h=400&fit=crop',
    cookTime: '15 mins',
    servings: 2,
    difficulty: 'Easy',
    rating: 4.8,
    reviewCount: 124,
    tags: ['healthy', 'anti-inflammatory', 'breakfast', 'vegan', 'gluten-free'],
    mood: 'comfort',
    diet: ['vegan', 'gluten-free'],
    ingredients: [
      '1 cup rolled oats',
      '1 tsp turmeric powder',
      '1/2 tsp cinnamon',
      '1 cup coconut milk',
      '1 tbsp maple syrup',
      '1/4 cup chopped almonds',
      'Fresh berries for topping'
    ],
    instructions: [
      'Heat coconut milk in a saucepan over medium heat',
      'Whisk in turmeric, cinnamon, and maple syrup',
      'Add oats and simmer for 5-7 minutes until creamy',
      'Serve in bowls topped with almonds and berries'
    ],
    prepTime: '5 mins',
    totalTime: '15 mins',
    calories: 285,
    isPremium: false,
    createdAt: '2024-01-15T10:00:00Z',
    likes: 1847,
    saves: 592
  },
  {
    id: '2',
    title: 'Energy-Boosting Green Smoothie Bowl',
    description: 'Packed with spinach, banana, and superfoods to fuel your morning',
    author: mockUsers[2],
    image: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=600&h=400&fit=crop',
    cookTime: '10 mins',
    servings: 1,
    difficulty: 'Easy',
    rating: 4.6,
    reviewCount: 89,
    tags: ['healthy', 'energizing', 'breakfast', 'vegan', 'superfood'],
    mood: 'energizing',
    diet: ['vegan'],
    ingredients: [
      '1 frozen banana',
      '1 cup fresh spinach',
      '1/2 avocado',
      '1 cup almond milk',
      '1 tbsp chia seeds',
      '1 tsp spirulina powder',
      'Granola and coconut flakes for topping'
    ],
    instructions: [
      'Add all smoothie ingredients to a blender',
      'Blend until smooth and creamy',
      'Pour into a bowl',
      'Top with granola, coconut flakes, and extra chia seeds'
    ],
    prepTime: '10 mins',
    totalTime: '10 mins',
    calories: 320,
    isPremium: true,
    createdAt: '2024-01-14T09:30:00Z',
    likes: 932,
    saves: 445
  },
  {
    id: '3',
    title: 'Comfort Mac & Cheese with Truffle',
    description: 'Elevated comfort food with a gourmet twist for cozy nights in',
    author: mockUsers[1],
    image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600&h=400&fit=crop',
    cookTime: '25 mins',
    servings: 4,
    difficulty: 'Medium',
    rating: 4.9,
    reviewCount: 267,
    tags: ['comfort', 'cheesy', 'dinner', 'indulgent', 'truffle'],
    mood: 'comfort',
    diet: ['vegetarian'],
    ingredients: [
      '1 lb elbow macaroni',
      '4 cups whole milk',
      '1/2 cup butter',
      '1/2 cup flour',
      '2 cups sharp cheddar cheese',
      '1 cup gruyere cheese',
      '2 tbsp truffle oil',
      'Salt and pepper to taste',
      'Breadcrumbs for topping'
    ],
    instructions: [
      'Cook macaroni according to package directions',
      'Make roux with butter and flour',
      'Gradually add milk, whisking constantly',
      'Add cheeses and truffle oil',
      'Combine with pasta and bake until golden'
    ],
    prepTime: '15 mins',
    totalTime: '40 mins',
    calories: 485,
    isPremium: false,
    createdAt: '2024-01-13T18:45:00Z',
    likes: 2156,
    saves: 832
  },
  {
    id: '4',
    title: 'Mediterranean Buddha Bowl',
    description: 'Fresh, colorful bowl packed with Mediterranean flavors and nutrients',
    author: mockUsers[0],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    cookTime: '20 mins',
    servings: 2,
    difficulty: 'Easy',
    rating: 4.7,
    reviewCount: 156,
    tags: ['healthy', 'mediterranean', 'fresh', 'lunch', 'gluten-free'],
    mood: 'fresh',
    diet: ['vegetarian', 'gluten-free'],
    ingredients: [
      '1 cup quinoa',
      '1 cucumber, diced',
      '1 cup cherry tomatoes',
      '1/2 red onion, sliced',
      '1/2 cup kalamata olives',
      '1/2 cup feta cheese',
      '1/4 cup olive oil',
      '2 tbsp lemon juice',
      'Fresh herbs (parsley, oregano)'
    ],
    instructions: [
      'Cook quinoa according to package directions',
      'Prepare all vegetables',
      'Make lemon-olive oil dressing',
      'Assemble bowls with quinoa base',
      'Top with vegetables, feta, and dressing'
    ],
    prepTime: '15 mins',
    totalTime: '35 mins',
    calories: 395,
    isPremium: true,
    createdAt: '2024-01-12T12:20:00Z',
    likes: 1234,
    saves: 567
  },
  {
    id: '5',
    title: 'Spicy Korean Kimchi Fried Rice',
    description: 'Bold, spicy flavors that wake up your taste buds',
    author: mockUsers[1],
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&h=400&fit=crop',
    cookTime: '15 mins',
    servings: 2,
    difficulty: 'Medium',
    rating: 4.5,
    reviewCount: 98,
    tags: ['spicy', 'asian', 'kimchi', 'dinner', 'bold'],
    mood: 'bold',
    diet: [],
    ingredients: [
      '2 cups cooked rice (preferably day-old)',
      '1 cup kimchi, chopped',
      '2 eggs',
      '2 green onions, sliced',
      '2 tbsp sesame oil',
      '1 tbsp soy sauce',
      '1 tsp gochujang',
      '1 tbsp vegetable oil'
    ],
    instructions: [
      'Heat oil in a large pan or wok',
      'Scramble eggs and set aside',
      'Stir-fry kimchi for 2-3 minutes',
      'Add rice and seasonings',
      'Stir in eggs and green onions before serving'
    ],
    prepTime: '10 mins',
    totalTime: '25 mins',
    calories: 420,
    isPremium: false,
    createdAt: '2024-01-11T19:15:00Z',
    likes: 876,
    saves: 321
  },
  {
    id: '6',
    title: 'Chocolate Avocado Mousse',
    description: 'Guilt-free chocolate indulgence that satisfies your sweet cravings',
    author: mockUsers[2],
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&h=400&fit=crop',
    cookTime: '5 mins',
    servings: 4,
    difficulty: 'Easy',
    rating: 4.4,
    reviewCount: 203,
    tags: ['dessert', 'healthy', 'chocolate', 'vegan', 'sweet'],
    mood: 'indulgent',
    diet: ['vegan'],
    ingredients: [
      '2 ripe avocados',
      '1/4 cup cocoa powder',
      '1/4 cup maple syrup',
      '1 tsp vanilla extract',
      '2 tbsp almond milk',
      'Pinch of salt',
      'Fresh berries for garnish'
    ],
    instructions: [
      'Scoop avocado flesh into a food processor',
      'Add cocoa powder, maple syrup, and vanilla',
      'Process until smooth and creamy',
      'Add almond milk if needed for consistency',
      'Chill for 30 minutes before serving'
    ],
    prepTime: '5 mins',
    totalTime: '35 mins',
    calories: 145,
    isPremium: true,
    createdAt: '2024-01-10T16:30:00Z',
    likes: 1456,
    saves: 789
  }
];

export const mockPhotoFeed = [
  {
    id: '1',
    user: mockUsers[0],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=500&fit=crop',
    caption: 'Sunday brunch vibes with my golden turmeric bowl ✨ #goldentumeric #healthyeating',
    recipe: mockRecipes[0],
    likes: 847,
    comments: 23,
    timestamp: '2024-01-15T11:30:00Z',
    isLiked: false
  },
  {
    id: '2',
    user: mockUsers[2],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
    caption: 'Green smoothie bowl to power through Monday! 💚 Who else needs this energy boost?',
    recipe: mockRecipes[1],
    likes: 632,
    comments: 18,
    timestamp: '2024-01-14T10:15:00Z',
    isLiked: true
  },
  {
    id: '3',
    user: mockUsers[1],
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=500&fit=crop',
    caption: 'Truffle mac and cheese for the soul 🧀 Nothing beats comfort food done right!',
    recipe: mockRecipes[2],
    likes: 1205,
    comments: 56,
    timestamp: '2024-01-13T20:00:00Z',
    isLiked: false
  },
  {
    id: '4',
    user: mockUsers[3],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=500&fit=crop',
    caption: 'Fresh Mediterranean Buddha bowl for lunch! 🌿 #mediterraneandiet #fresh',
    recipe: mockRecipes[3],
    likes: 523,
    comments: 12,
    timestamp: '2024-01-12T13:45:00Z',
    isLiked: true
  },
  {
    id: '5',
    user: mockUsers[1],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=500&fit=crop',
    caption: 'Spicy kimchi fried rice hits different on a cold night 🌶️🔥',
    recipe: mockRecipes[4],
    likes: 789,
    comments: 34,
    timestamp: '2024-01-11T19:30:00Z',
    isLiked: false
  },
  {
    id: '6',
    user: mockUsers[2],
    image: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=500&h=500&fit=crop',
    caption: 'Healthy chocolate mousse that tastes like pure indulgence 🍫',
    recipe: mockRecipes[5],
    likes: 934,
    comments: 41,
    timestamp: '2024-01-10T17:00:00Z',
    isLiked: true
  }
];

export const mockComments = {
  '1': [
    {
      id: '1',
      user: mockUsers[1],
      text: 'This looks absolutely amazing! 😍',
      timestamp: '2024-01-15T11:45:00Z'
    },
    {
      id: '2',
      user: mockUsers[3],
      text: 'I tried this recipe yesterday and it was incredible!',
      timestamp: '2024-01-15T12:30:00Z'
    }
  ],
  '2': [
    {
      id: '3',
      user: mockUsers[0],
      text: 'Green smoothie bowls are life! 💚',
      timestamp: '2024-01-14T10:30:00Z'
    }
  ],
  '3': [
    {
      id: '4',
      user: mockUsers[2],
      text: 'This mac and cheese is next level!',
      timestamp: '2024-01-13T20:15:00Z'
    },
    {
      id: '5',
      user: mockUsers[0],
      text: 'The truffle makes all the difference ✨',
      timestamp: '2024-01-13T20:45:00Z'
    }
  ]
};

export const moodCategories = [
  { id: 'comfort', name: 'Comfort', emoji: '🤗', description: 'Warm, cozy meals that hug your soul' },
  { id: 'energizing', name: 'Energizing', emoji: '⚡', description: 'Boost your energy with nutritious meals' },
  { id: 'fresh', name: 'Fresh', emoji: '🌿', description: 'Light, crisp, and refreshing dishes' },
  { id: 'bold', name: 'Bold', emoji: '🌶️', description: 'Spicy and intense flavors that excite' },
  { id: 'indulgent', name: 'Indulgent', emoji: '🍫', description: 'Treat yourself with rich, decadent dishes' },
  { id: 'healthy', name: 'Healthy', emoji: '🥗', description: 'Nutritious meals that nourish your body' }
];

export const dietaryOptions = [
  { id: 'vegan', name: 'Vegan', emoji: '🌱' },
  { id: 'vegetarian', name: 'Vegetarian', emoji: '🥕' },
  { id: 'gluten-free', name: 'Gluten-Free', emoji: '🌾' },
  { id: 'keto', name: 'Keto', emoji: '🥓' },
  { id: 'paleo', name: 'Paleo', emoji: '🍖' },
  { id: 'mediterranean', name: 'Mediterranean', emoji: '🫒' }
];
