# FoodieBite

A full‑stack recipe and social food platform.

## Features
- Recipes: list, search, advanced filters (mood, dietary, cuisine, prep time, difficulty)
- Experimental recipes section
- Photos: upload (camera or file), like, rate, and link to recipes
- Reviews & recommendations
- Social: share links, comments, friends (requests/accept), favorites (limits for free users)
- Auth: register, login, profiles with avatars, roles (admin, premium)
- Admin panel: manage users/recipes/photos, promote/demote admin & premium
- Premium: exclusive content, ad‑free, higher limits
- AI Assistant widget (optional backend proxy)
- Security: JWT, bcrypt, Helmet, CORS, rate limiting, validation & sanitization
- Support/Help page (contact form)

## Tech Stack
- Frontend: React, React Router, Axios
- Backend: Node.js, Express, Mongoose (MongoDB)
- Security: helmet, express‑rate‑limit, validator, JWT, bcrypt

## Repository Structure
```
backend/
  models/
  scripts/
  server.js
public/
  index.html
src/
  App.js
  Recipes.js
  RecipeFilters.js
  components/
    Auth.js
    AvatarUploader.js
  utils/
    security.js
server.mjs
README.md
```

## Prerequisites
- Node.js LTS (includes npm)
- MongoDB (local or Atlas)
- OpenWeather API key (for weather in UI)

Optional:
- OpenAI API key (for AI assistant)

## 1) Install Node.js and MongoDB
- Node.js: https://nodejs.org (install LTS and ensure “Add to PATH” is checked on Windows)
- Verify:
```
node -v
npm -v
```
- MongoDB: https://www.mongodb.com/try/download/community or use MongoDB Atlas

## 2) Backend Setup
From the project root:
```
cd backend
npm init -y
npm install express mongoose cors dotenv helmet express-rate-limit validator bcryptjs jsonwebtoken
```
Create a `.env` file in `backend/` (copy values from your environment):
```
MONGODB_URI=mongodb://localhost:27017/recipesdb
JWT_SECRET=change_me
PORT=5000
NODE_ENV=development
```
Run the backend:
```
node server.js
```
You should see: `Secure server running on port 5000` and `MongoDB connected securely`

## 3) Frontend Setup
If you already have a React setup, install needed packages in the project root:
```
npm install react react-dom axios react-router-dom
```
If you don’t have a React runner yet, you can bootstrap one (optional):
```
npx create-react-app .
```
Then run your frontend:
```
npm start
```

## 4) Environment Variables Used
- Backend
  - `MONGODB_URI`, `JWT_SECRET`, `PORT`, `NODE_ENV`
- Frontend
  - Replace `YOUR_API_KEY` in `src/App.js` with your OpenWeather API key
  - Optional: set `REACT_APP_API_URL` and update API calls accordingly

## 5) Seeding Experimental Recipes
Seed experimental recipes (thegoldenbalance, justkriston, stealth_health_life):
```
node backend/scripts/seedExperimentalRecipes.js
```
MongoDB must be running and `MONGODB_URI` reachable.

## 6) Useful Endpoints (Backend)
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`, `PUT /api/auth/profile`, `PUT /api/auth/profile/avatar`
- Recipes: `GET /api/recipes` (supports q, mood, dietary, ingredient, cuisine, min_prep, max_prep, difficulty, sort)
- Recipes (mutations): `POST /api/recipes`, `PUT /api/recipes/:id`
- Reviews: `POST /api/recipes/:id/reviews`
- Recommendations: `GET /api/recommendations`
- Favorites: `GET /api/auth/favorites`, `POST /api/auth/favorites/:recipeId`, `DELETE /api/auth/favorites/:recipeId`
- Photos: `POST /api/photos`, `GET /api/photos`, `POST /api/photos/:id/like`, `POST /api/photos/:id/rate`
- Admin: `GET /api/admin/stats`, `GET /api/admin/users`, `DELETE /api/admin/users/:id`, `GET /api/admin/recipes`, `DELETE /api/admin/recipes/:id`, promote/demote admin & premium
- Support (MVP): `POST /api/support`

## 7) Security Notes
- Helmet CSP configured with allowlists (fonts, images, OpenWeather API)
- Rate limits: general & auth specific
- Inputs validated and sanitized (validator)
- JWT required for protected routes; keep `JWT_SECRET` safe

## 8) AI Assistant
- UI widget in React; for production, proxy AI calls via backend to keep API keys secret
- Configure your OpenAI (or Dialogflow) integration server‑side

## 9) Legal & Compliance
- Add `/privacy` and `/terms` pages
- Cookie consent if using analytics/ads
- Support contact (e.g., `support@foodiebite.com`)

## 10) Troubleshooting
### Windows: `node`/`npm` not recognized
- Install Node.js LTS and check “Add to PATH” during setup
- Open a new PowerShell/Command Prompt and run:
```
node -v
npm -v
```

### MongoDB connection errors
- Ensure MongoDB is running and `MONGODB_URI` is correct
- For Atlas, whitelist your IP and use the connection string provided by Atlas

### CORS errors
- Ensure frontend origin is listed in backend CORS config (in production)

### Port conflicts
- Backend default: 5000; Frontend default: 3000
- Change `PORT` in `.env` or via CLI if needed

## 11) Scripts
- Start backend: `node backend/server.js`
- Seed experimental recipes: `node backend/scripts/seedExperimentalRecipes.js`
- Simple Node test server: `node server.mjs`

## 12) Roadmap (Launch Readiness)
- Final UI polish for Social/Admin/Premium
- Testing/QA (unit, integration, e2e) + CI
- Legal pages and cookie consent
- Performance & PWA optimizations (Lighthouse)

---

Made with ❤️ for food lovers. If you encounter issues, please open an issue or contact support. 