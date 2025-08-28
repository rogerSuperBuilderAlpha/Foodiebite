# 🍽️ FoodieBite - Complete Recipe & Nutrition Platform

**Bite Into Happiness, One Recipe at a Time**

A comprehensive full-stack recipe platform with advanced features for athletes, health-conscious individuals, and food enthusiasts worldwide.

## ✨ Features Overview

### 🏃‍♂️ **Athlete Diet Sharing**
- **Sport-specific nutrition plans** for Football, Basketball, Soccer, Tennis, Swimming, Running, Weightlifting, Yoga, CrossFit, and more
- **Detailed meal planning** with timing, foods, and supplements
- **Hydration strategies** for pre, during, and post-workout
- **Training schedule integration** with nutrition timing
- **Performance tracking** and results sharing
- **Community-driven** diet discovery and sharing

### 🥨 **Snack Discovery & Sharing**
- **Comprehensive snack categories**: Sweet, Savory, Healthy, Protein, Energy, Low-carb, Vegan, Gluten-free
- **Detailed nutrition information** with calories, macros, and micronutrients
- **Preparation guidance** with difficulty levels and time estimates
- **Health benefits tracking** and dietary tag filtering
- **Best time to eat** recommendations (pre-workout, post-workout, etc.)
- **Storage instructions** and serving suggestions

### 🍎 **Health Condition Nutrition Guide**
- **Specialized nutrition plans** for Diabetes, Eating Disorders, Heart Disease, Celiac Disease, Lactose Intolerance, Hypertension
- **Severity-based guidance** (Mild, Moderate, Severe)
- **Comprehensive dietary restrictions** and recommended foods
- **Nutritional guidelines** with calorie ranges and macro percentages
- **Cooking method recommendations** and restrictions
- **Health monitoring** checklists and emergency signs
- **Professional advice** and resource links
- **Verified content** by healthcare professionals

### 🌍 **Multi-Language Recipe Translation**
- **12+ language support**: Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean, Arabic, Hindi
- **Cultural adaptations** with local ingredients and cooking methods
- **Accuracy scoring** and community ratings
- **Original vs. translated** content comparison
- **Cultural context** and serving style adaptations
- **Translation status tracking** (Draft, Pending Review, Approved, Rejected)

### 🌎 **Global Recipe Selection**
- **Continent-based filtering**: Africa, Asia, Europe, North America, South America, Oceania
- **Regional cuisine discovery** with health and dietary filters
- **Cultural context** and traditional cooking methods
- **Local ingredient alternatives** and substitutions

### 💪 **Nutrition Benefits System**
- **Demographic-specific guidance**: Youth, Elderly, Women (including period nutrition), General
- **Health-focused meal planning** with nutritional goals
- **Dietary restriction support** and alternatives
- **Seasonal nutrition** and local food recommendations

### 📅 **Advanced Meal Planning**
- **Weekly meal grid** with drag-and-drop functionality
- **Nutritional goal tracking** and dietary restriction management
- **Shopping list generation** with ingredient quantities
- **Recipe search and assignment** to meal slots
- **Meal prep optimization** with batch cooking strategies

### 📸 **Photo-to-Meal Recognition**
- **AI-powered food identification** from photos
- **Ingredient detection** with confidence scores
- **Recipe suggestions** based on identified foods
- **Meal creation** from photo analysis
- **Camera integration** and file upload support

### 🔐 **X.com-Style Authentication**
- **Secure user registration** and login system
- **Profile management** with avatar uploads
- **Role-based access** (User, Premium, Admin)
- **Social features** including friends system and friend requests
- **Favorites management** with limits based on user tier

### 👥 **Social Features**
- **Photo sharing** with likes, ratings, and comments
- **Recipe sharing** on social media platforms
- **Friend system** with request/accept functionality
- **Comment sections** with edit/delete capabilities
- **Content moderation** and reporting system

### ⭐ **Premium Features**
- **Ad-free experience** for premium users
- **Exclusive content** and early access to features
- **Higher limits** for favorites and uploads
- **Priority support** and direct creator access
- **Advanced analytics** and personalization

### 🛡️ **Elite Admin Panel**
- **Comprehensive dashboard** with platform statistics
- **User management** with role promotion/demotion
- **Content moderation** for recipes, photos, and comments
- **Analytics and reporting** tools
- **Bulk actions** and content filtering

### 📱 **Progressive Web App (PWA)**
- **Offline support** with service worker caching
- **Mobile-optimized** for iOS and Android
- **Install prompts** for home screen addition
- **Push notifications** support
- **Responsive design** across all devices

### 🍪 **Legal & Compliance**
- **Privacy Policy** and Terms of Service pages
- **Cookie consent banner** with GDPR compliance
- **Data export/delete** functionality
- **User rights management** and transparency

### 🤖 **AI Assistant Integration**
- **Contextual help** throughout the platform
- **Smart recommendations** based on user preferences
- **Device optimization** suggestions
- **Accessibility features** and guidance

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/foodiebite.git
   cd foodiebite
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../src
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend (.env)
   cd backend
   cp .env.example .env
   
   # Configure your environment variables:
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service
   # The app will automatically create collections on first run
   ```

5. **Start the application**
   ```bash
   # Start backend server
   cd backend
   npm start
   
   # Start frontend (in new terminal)
   cd src
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **Models**: User, Recipe, Photo, Comment, MealPlan, PhotoMeal, AthleteDiet, Snack, HealthCondition, RecipeTranslation
- **Security**: JWT authentication, rate limiting, input validation, CORS, Helmet.js
- **File Handling**: Multer for image uploads, cloud storage support
- **API Endpoints**: RESTful design with comprehensive CRUD operations

### Frontend (React + Modern JavaScript)
- **Components**: Modular, reusable React components with hooks
- **Routing**: React Router with protected routes and navigation
- **State Management**: React Context and local state
- **Styling**: CSS custom properties, responsive design, dark mode support
- **PWA**: Service worker, manifest, offline capabilities

### Database (MongoDB + Mongoose)
- **Schemas**: Comprehensive data models with validation
- **Relationships**: Referenced documents with population
- **Indexing**: Optimized queries for performance
- **Aggregation**: Advanced data processing and analytics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Recipes
- `GET /api/recipes` - List recipes with filters
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/:id` - Get recipe details
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `GET /api/recipes/global/:continent` - Regional recipes
- `GET /api/recipes/nutrition/:demographic` - Nutrition-focused recipes
- `GET /api/recipes/meal-prep` - Meal prep friendly recipes

### Athlete Diets
- `POST /api/athlete-diets` - Create athlete diet
- `GET /api/athlete-diets` - List athlete diets with filters
- `GET /api/athlete-diets/:id` - Get diet details

### Snacks
- `POST /api/snacks` - Upload snack
- `GET /api/snacks` - List snacks with filters
- `GET /api/snacks/:id` - Get snack details

### Health Conditions
- `POST /api/health-conditions` - Share health information
- `GET /api/health-conditions` - List conditions with filters
- `GET /api/health-conditions/:id` - Get condition details

### Recipe Translations
- `POST /api/recipe-translations` - Create translation
- `GET /api/recipe-translations` - List translations with filters
- `GET /api/recipe-translations/:id` - Get translation details

### Admin (Protected)
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/recipes` - Recipe moderation
- `GET /api/admin/photos` - Photo moderation
- `POST /api/admin/users/:id/promote` - Promote user to admin
- `POST /api/admin/users/:id/demote` - Demote admin user

## 🎨 Customization

### Styling
- **CSS Custom Properties**: Easy color scheme and spacing customization
- **Component-based CSS**: Modular styling for easy maintenance
- **Responsive Design**: Mobile-first approach with breakpoint system
- **Dark Mode Support**: Automatic theme detection with manual toggle

### Branding
- **Logo Integration**: Easy logo replacement in components
- **Color Schemes**: Customizable primary, accent, and neutral colors
- **Typography**: Google Fonts integration with fallback system
- **Icons**: Emoji and SVG icon support throughout the platform

## 📱 Mobile Optimization

### Responsive Design
- **Mobile-first approach** with progressive enhancement
- **Touch-friendly interfaces** with appropriate button sizes
- **Optimized navigation** for small screens
- **Image optimization** with lazy loading and WebP support

### PWA Features
- **Offline functionality** with service worker caching
- **App-like experience** with full-screen mode
- **Push notifications** for updates and engagement
- **Background sync** for offline actions

## 🔒 Security Features

### Authentication & Authorization
- **JWT tokens** with secure storage
- **Role-based access control** (User, Premium, Admin)
- **Password hashing** with bcrypt
- **Session management** with secure cookies

### Data Protection
- **Input validation** and sanitization
- **XSS protection** with content security policies
- **CSRF protection** with token validation
- **Rate limiting** to prevent abuse
- **SQL injection prevention** with parameterized queries

### Privacy & Compliance
- **GDPR compliance** with cookie consent
- **Data export/delete** functionality
- **Privacy policy** and terms of service
- **User consent management**

## 🧪 Testing

### Backend Testing
- **Unit tests** for models and utilities
- **Integration tests** for API endpoints
- **Security testing** for authentication and authorization
- **Performance testing** for database queries

### Frontend Testing
- **Component testing** with React Testing Library
- **User interaction testing** with Jest
- **Accessibility testing** with axe-core
- **Cross-browser testing** with BrowserStack

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd src
npm run build

# Start production server
cd backend
npm start
```

### Environment Variables
```bash
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
PORT=5000
```

### Deployment Platforms
- **Heroku**: Easy deployment with Git integration
- **Vercel**: Frontend deployment with automatic builds
- **Netlify**: Static site hosting with form handling
- **AWS**: Scalable cloud infrastructure
- **DigitalOcean**: VPS deployment with Docker support

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- **ESLint** configuration for consistent code style
- **Prettier** for automatic code formatting
- **Conventional commits** for commit messages
- **TypeScript** support for type safety (optional)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Recipe APIs**: TheMealDB for external recipe data
- **Icons**: Emoji and SVG icon libraries
- **Fonts**: Google Fonts for typography
- **Community**: All contributors and users who provide feedback

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/foodiebite/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/foodiebite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/foodiebite/discussions)
- **Email**: support@foodiebite.com

---

**Made with ❤️ by the FoodieBite Team**

*Empowering people to discover, share, and enjoy food from around the world while maintaining their health and fitness goals.* 