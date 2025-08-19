import React, { useState, useEffect } from "react";
import axios from "axios";
import RecipeFilters from "./RecipeFilters";
import AuthForm from "./components/Auth";
import CookieBanner from "./components/CookieBanner";
import { BrowserRouter as Router, Route, Switch, Link, useHistory, useParams, Navigate } from 'react-router-dom';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AdminDashboard from './pages/AdminDashboard';
import { register as registerSW } from './serviceWorkerRegistration';
import GlobalRecipeSelector from './components/GlobalRecipeSelector';
import NutritionBenefits from './components/NutritionBenefits';
import MealPlanner from './components/MealPlanner';
import PhotoToMeal from './components/PhotoToMeal';

const moods = ["Happy", "Sad", "Stressed", "Adventurous"];

const logoUrl = "https://ui-avatars.com/api/?name=FoodieBite&background=1976d2&color=fff&size=64";
const slogan = "Bite Into Happiness, One Recipe at a Time";

function buildRecipesUrl({ search, mood, selected }) {
  let url = "http://localhost:5000/api/recipes?";
  if (search) url += `q=${encodeURIComponent(search)}&`;
  if (mood) url += `mood=${encodeURIComponent(mood)}&`;
  if (selected && selected.length) url += `dietary=${encodeURIComponent(selected[0])}&`;
  return url;
}

function RecipeForm({ recipe, onSave }) {
  const [form, setForm] = useState(recipe || {
    recipe_name: '',
    country: '',
    dish_of_the_month: false,
    image_url: '',
    ingredients: [],
    dietary_tags: [],
    instructions: '',
    cultural_context: '',
    drinks: []
  });
  const [ingredientInput, setIngredientInput] = useState('');
  const [dietaryInput, setDietaryInput] = useState('');
  const [drinkInput, setDrinkInput] = useState({ name: '', image_url: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (recipe) setForm(recipe);
  }, [recipe]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const addIngredient = () => {
    if (ingredientInput) {
      setForm(f => ({ ...f, ingredients: [...f.ingredients, ingredientInput] }));
      setIngredientInput('');
    }
  };
  const addDietary = () => {
    if (dietaryInput) {
      setForm(f => ({ ...f, dietary_tags: [...f.dietary_tags, dietaryInput] }));
      setDietaryInput('');
    }
  };
  const addDrink = () => {
    if (drinkInput.name) {
      setForm(f => ({ ...f, drinks: [...f.drinks, drinkInput] }));
      setDrinkInput({ name: '', image_url: '', description: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.recipe_name) {
      setError('Recipe name is required');
      return;
    }
    setError('');
    await onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Recipe form" style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>{recipe ? 'Edit Recipe' : 'Submit a Recipe'}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <label htmlFor="recipe_name">Recipe Name*</label>
      <input id="recipe_name" name="recipe_name" value={form.recipe_name} onChange={handleChange} required aria-required="true" />
      <label htmlFor="country">Country</label>
      <input id="country" name="country" value={form.country} onChange={handleChange} />
      <label>
        <input type="checkbox" name="dish_of_the_month" checked={form.dish_of_the_month} onChange={handleChange} />
        Dish of the Month
      </label>
      <label htmlFor="image_url">Image URL</label>
      <input id="image_url" name="image_url" value={form.image_url} onChange={handleChange} />
      <label htmlFor="ingredientInput">Ingredients</label>
      <div style={{ display: 'flex', gap: 5 }}>
        <input id="ingredientInput" value={ingredientInput} onChange={e => setIngredientInput(e.target.value)} aria-label="Add ingredient" />
        <button type="button" onClick={addIngredient} aria-label="Add ingredient">Add</button>
      </div>
      <ul>{form.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
      <label htmlFor="dietaryInput">Dietary Tags</label>
      <div style={{ display: 'flex', gap: 5 }}>
        <input id="dietaryInput" value={dietaryInput} onChange={e => setDietaryInput(e.target.value)} aria-label="Add dietary tag" />
        <button type="button" onClick={addDietary} aria-label="Add dietary tag">Add</button>
      </div>
      <ul>{form.dietary_tags.map((tag, i) => <li key={i}>{tag}</li>)}</ul>
      <label htmlFor="instructions">Instructions</label>
      <textarea id="instructions" name="instructions" value={form.instructions} onChange={handleChange} />
      <label htmlFor="cultural_context">Cultural Context</label>
      <input id="cultural_context" name="cultural_context" value={form.cultural_context} onChange={handleChange} />
      <label htmlFor="drink_name">Drinks</label>
      <div style={{ display: 'flex', gap: 5 }}>
        <input id="drink_name" placeholder="Name" value={drinkInput.name} onChange={e => setDrinkInput(d => ({ ...d, name: e.target.value }))} aria-label="Drink name" />
        <input placeholder="Image URL" value={drinkInput.image_url} onChange={e => setDrinkInput(d => ({ ...d, image_url: e.target.value }))} aria-label="Drink image url" />
        <input placeholder="Description" value={drinkInput.description} onChange={e => setDrinkInput(d => ({ ...d, description: e.target.value }))} aria-label="Drink description" />
        <button type="button" onClick={addDrink} aria-label="Add drink">Add</button>
      </div>
      <ul>{form.drinks.map((d, i) => <li key={i}>{d.name} ({d.description})</li>)}</ul>
      <button type="submit" style={{ marginTop: 10 }}>{recipe ? 'Update Recipe' : 'Save Recipe'}</button>
    </form>
  );
}

function UserProfile({ user, onLogout }) {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: 16, 
        padding: 24, 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e1e8ed'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=1976d2&color=fff&size=64`} 
            alt={`${user.username}'s avatar`}
            style={{ width: 64, height: 64, borderRadius: '50%', marginRight: 16 }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>@{user.username}</h2>
            <p style={{ margin: '4px 0 0 0', color: '#536471' }}>{user.bio || 'No bio yet'}</p>
          </div>
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <h3>Account Info</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <button 
          onClick={onLogout}
          style={{
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: 9999,
            padding: '12px 24px',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function MainApp({ user, onLogout }) {
  const [mood, setMood] = useState("");
  const [weather, setWeather] = useState(null);
  const [selected, setSelected] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [reviewInputs, setReviewInputs] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    document.body.style.fontFamily = 'Roboto, Arial, sans-serif';
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const { latitude, longitude } = coords;
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY`
      );
      setWeather(res.data.weather[0].main);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    const url = buildRecipesUrl({ search, mood, selected });
    axios.get(url)
      .then(res => setRecipes(res.data))
      .catch(() => setError("Failed to load recipes. Please try again later."))
      .finally(() => setLoading(false));
  }, [search, mood, selected]);

  useEffect(() => {
    let url = "http://localhost:5000/api/recommendations?";
    if (mood) url += `mood=${encodeURIComponent(mood)}&`;
    if (selected.length) url += `dietary=${encodeURIComponent(selected[0])}&`;
    axios.get(url).then(res => setRecommendations(res.data));
  }, [mood, selected]);

  const handleReviewInput = (id, field, value) => {
    setReviewInputs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const submitReview = async (id) => {
    const input = reviewInputs[id] || {};
    if (!input.rating || !input.comment) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please sign in to leave a review');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/recipes/${id}/reviews`, input, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviewInputs(prev => ({ ...prev, [id]: { rating: 5, comment: "" } }));
      const url = buildRecipesUrl({ search, mood, selected });
      axios.get(url).then(res => setRecipes(res.data));
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    }
  };

  const handleEdit = (recipe) => {
    if (!user) {
      setError('Please sign in to edit recipes');
      return;
    }
    history.push(`/edit/${recipe._id}`);
  };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 20, fontFamily: 'Roboto, Arial, sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <img src={logoUrl} alt="FoodieBite logo" width={48} height={48} style={{ borderRadius: 8, marginRight: 12 }} />
        <div>
          <h1 style={{ margin: 0, color: '#1976d2', fontSize: 32 }}>FoodieBite</h1>
          <div style={{ fontSize: 16, color: '#555' }}>{slogan}</div>
        </div>
      </header>
      <input
        type="text"
        placeholder="Search recipes..."
        aria-label="Search recipes"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ margin: "10px 0", padding: "8px", width: "100%", borderRadius: 4, border: '1px solid #ccc' }}
      />
      <nav aria-label="Mood filter" style={{ margin: "10px 0", display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ marginRight: 8 }}>Filter by mood:</span>
        {moods.map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            style={{
              background: mood === m ? "#1976d2" : "#eee",
              color: mood === m ? "#fff" : "#000",
              margin: "0 5px 5px 0",
              border: "none",
              borderRadius: 4,
              padding: "5px 10px",
              cursor: "pointer"
            }}
            aria-pressed={mood === m}
          >
            {m}
          </button>
        ))}
        <button onClick={() => setMood("")} style={{ marginLeft: 10, padding: "5px 10px" }}>
          Clear
        </button>
      </nav>
      <section aria-label="Dietary filters">
        <RecipeFilters selected={selected} setSelected={setSelected} />
      </section>
      <section aria-label="Weather and mood" style={{ margin: '10px 0' }}>
        {weather && <p>Current Weather: {weather}</p>}
        {mood && <p>Selected Mood: {mood}</p>}
      </section>
      <section aria-label="Recipe list">
        {loading && <div style={{ textAlign: 'center', margin: 20 }}><span role="status" aria-live="polite">Loading recipes...</span></div>}
        {error && <div style={{ color: 'red', margin: 10 }}>{error}</div>}
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {recipes.map(r => (
            <li key={r._id || r.name} style={{ margin: "10px 0", padding: 10, border: "1px solid #eee", borderRadius: 4, background: '#fafbfc', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
              <strong>{r.recipe_name || r.name}</strong>
              {r.image_url && (
                <img src={r.image_url} alt={r.recipe_name} style={{ width: 50, marginLeft: 10, borderRadius: 4 }} loading="lazy" />
              )}
              <div>
                {r.dietary_tags && r.dietary_tags.length > 0 && (
                  <span>Dietary: {r.dietary_tags.join(", ")}</span>
                )}
              </div>
              {user && (
                <button onClick={() => handleEdit(r)} aria-label={`Edit ${r.recipe_name}`} style={{ margin: '5px 0', background: '#ffc107', border: 'none', borderRadius: 4, padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
              )}
              {/* Reviews Section */}
              <div style={{ marginTop: 10 }}>
                <strong>Reviews:</strong>
                <ul style={{ paddingLeft: 16 }}>
                  {r.reviews && r.reviews.length > 0 ? (
                    r.reviews.map((rev, idx) => (
                      <li key={idx}>
                        <span><b>{rev.user}</b> ({rev.rating}/5): {rev.comment}</span>
                      </li>
                    ))
                  ) : (
                    <li>No reviews yet.</li>
                  )}
                </ul>
                {user && (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      submitReview(r._id);
                    }}
                    style={{ marginTop: 5, display: 'flex', flexWrap: 'wrap', gap: 5 }}
                    aria-label={`Add review for ${r.recipe_name}`}
                  >
                    <input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Rating"
                      aria-label="Rating"
                      value={(reviewInputs[r._id]?.rating) || 5}
                      onChange={e => handleReviewInput(r._id, "rating", e.target.value)}
                      style={{ width: 60 }}
                    />
                    <input
                      type="text"
                      placeholder="Comment"
                      aria-label="Comment"
                      value={(reviewInputs[r._id]?.comment) || ""}
                      onChange={e => handleReviewInput(r._id, "comment", e.target.value)}
                      style={{ flex: 2, minWidth: 120 }}
                    />
                    <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '5px 10px' }}>Add Review</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
      {/* Recommendations Section */}
      <section aria-label="Recommendations" style={{ marginTop: 40 }}>
        <h3>Recommended for you</h3>
        <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {recommendations.map(r => (
            <li key={r._id || r.name} style={{ background: '#f0f4fa', borderRadius: 4, padding: 8, minWidth: 120, display: 'flex', alignItems: 'center' }}>
              <strong>{r.recipe_name || r.name}</strong>
              {r.image_url && (
                <img src={r.image_url} alt={r.recipe_name} style={{ width: 40, marginLeft: 10, borderRadius: 4 }} loading="lazy" />
              )}
            </li>
          ))}
        </ul>
      </section>
      <footer style={{ marginTop: 40, textAlign: 'center', color: '#888', fontSize: 14 }}>
        &copy; {new Date().getFullYear()} FoodieBite. All rights reserved.
      </footer>
    </main>
  );
}

function RecipeSubmitPage({ user }) {
  const history = useHistory();
  const handleSave = async (form) => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/recipes', form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    history.push('/');
  };
  return <RecipeForm onSave={handleSave} />;
}

function RecipeEditPage({ user }) {
  const { id } = useParams();
  const history = useHistory();
  const [recipe, setRecipe] = useState(null);
  useEffect(() => {
    axios.get(`http://localhost:5000/api/recipes?q=&_id=${id}`).then(res => {
      const found = res.data.find(r => r._id === id);
      setRecipe(found);
    });
  }, [id]);
  const handleSave = async (form) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/recipes/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    history.push('/');
  };
  if (!recipe) return <div>Loading...</div>;
  return <RecipeForm recipe={recipe} onSave={handleSave} />;
}

function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');

  const handleAuthSuccess = (data) => {
    if (data.switchMode) {
      setMode(data.switchMode);
    } else {
      onAuthSuccess(data);
    }
  };

  return <AuthForm mode={mode} onSuccess={handleAuthSuccess} />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (data) => {
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '16px 20px',
        background: '#fff',
        borderBottom: '1px solid #e1e8ed',
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 700, fontSize: 18 }}>
            FoodieBite
          </Link>
          {user && (
            <>
              <Link to="/submit" style={{ textDecoration: 'none', color: '#536471' }}>Submit Recipe</Link>
              <Link to="/profile" style={{ textDecoration: 'none', color: '#536471' }}>Profile</Link>
            </>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=1976d2&color=fff&size=32`} 
                alt={`${user.username}'s avatar`}
                style={{ width: 32, height: 32, borderRadius: '50%' }}
              />
              <span style={{ fontSize: 14, color: '#536471' }}>@{user.username}</span>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid #cfd9de',
                  borderRadius: 9999,
                  padding: '8px 16px',
                  fontSize: 14,
                  cursor: 'pointer',
                  color: '#536471'
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setAuthMode('login')}
              style={{
                background: '#1d9bf0',
                color: '#fff',
                border: 'none',
                borderRadius: 9999,
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Sign in
            </button>
          )}
        </div>
      </nav>
      
      <Switch>
        <Route exact path="/" render={() => <MainApp user={user} onLogout={handleLogout} />} />
        <Route path="/submit" render={() => user ? <RecipeSubmitPage user={user} /> : <AuthPage onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/edit/:id" render={() => user ? <RecipeEditPage user={user} /> : <AuthPage onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/profile" render={() => user ? <UserProfile user={user} onLogout={handleLogout} /> : <AuthPage onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/auth" render={() => <AuthPage onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        {user && user.isAdmin && <Route path="/admin" component={AdminDashboard} />}
        <Route path="/global" component={GlobalRecipeSelector} />
        <Route path="/nutrition" component={NutritionBenefits} />
        <Route path="/meal-planner" render={() => user ? <MealPlanner user={user} /> : <Navigate to="/auth" />} />
        <Route path="/photo-meal" render={() => user ? <PhotoToMeal user={user} /> : <Navigate to="/auth" />} />
      </Switch>
      <CookieBanner />
    </Router>
  );
}