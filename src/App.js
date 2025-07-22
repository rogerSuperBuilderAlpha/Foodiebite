import React, { useState, useEffect } from "react";
import axios from "axios";
import RecipeFilters from "./RecipeFilters";

const moods = ["Happy", "Sad", "Stressed", "Adventurous"];

export default function App() {
  const [mood, setMood] = useState("");
  const [weather, setWeather] = useState(null);
  const [selected, setSelected] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [reviewInputs, setReviewInputs] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const { latitude, longitude } = coords;
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY`
      );
      setWeather(res.data.weather[0].main);
    });
  }, []);

  // Fetch recipes with filters
  useEffect(() => {
    let url = "http://localhost:5000/api/recipes?";
    if (search) url += `q=${encodeURIComponent(search)}&`;
    if (mood) url += `mood=${encodeURIComponent(mood)}&`;
    if (selected.length) url += `dietary=${encodeURIComponent(selected[0])}&`; // For demo, just first dietary
    axios.get(url).then(res => setRecipes(res.data));
  }, [search, mood, selected]);

  // Fetch recommendations
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
    if (!input.user || !input.rating || !input.comment) return;
    await axios.post(`http://localhost:5000/api/recipes/${id}/reviews`, input);
    setReviewInputs(prev => ({ ...prev, [id]: { user: "", rating: 5, comment: "" } }));
    // Refresh recipes
    let url = "http://localhost:5000/api/recipes?";
    if (search) url += `q=${encodeURIComponent(search)}&`;
    if (mood) url += `mood=${encodeURIComponent(mood)}&`;
    if (selected.length) url += `dietary=${encodeURIComponent(selected[0])}&`;
    axios.get(url).then(res => setRecipes(res.data));
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>FoodieBite</h2>
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ margin: "10px 0", padding: "5px", width: "100%" }}
      />
      <div style={{ margin: "10px 0" }}>
        <span>Filter by mood: </span>
        {moods.map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            style={{
              background: mood === m ? "#1976d2" : "#eee",
              color: mood === m ? "#fff" : "#000",
              margin: "0 5px",
              border: "none",
              borderRadius: 4,
              padding: "5px 10px",
              cursor: "pointer"
            }}
          >
            {m}
          </button>
        ))}
        <button onClick={() => setMood("")} style={{ marginLeft: 10, padding: "5px 10px" }}>
          Clear
        </button>
      </div>
      <RecipeFilters selected={selected} setSelected={setSelected} />
      <div>
        {weather && <p>Current Weather: {weather}</p>}
        {mood && <p>Selected Mood: {mood}</p>}
        <ul>
          {recipes.map(r => (
            <li key={r._id || r.name} style={{ margin: "10px 0", padding: 10, border: "1px solid #eee", borderRadius: 4 }}>
              <strong>{r.recipe_name || r.name}</strong>
              {r.image_url && (
                <img src={r.image_url} alt={r.recipe_name} style={{ width: 50, marginLeft: 10 }} />
              )}
              <div>
                {r.dietary_tags && r.dietary_tags.length > 0 && (
                  <span>Dietary: {r.dietary_tags.join(", ")}</span>
                )}
              </div>
              {/* Reviews Section */}
              <div style={{ marginTop: 10 }}>
                <strong>Reviews:</strong>
                <ul>
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
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    submitReview(r._id);
                  }}
                  style={{ marginTop: 5 }}
                >
                  <input
                    type="text"
                    placeholder="Your name"
                    value={(reviewInputs[r._id]?.user) || ""}
                    onChange={e => handleReviewInput(r._id, "user", e.target.value)}
                    style={{ marginRight: 5 }}
                  />
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Rating"
                    value={(reviewInputs[r._id]?.rating) || 5}
                    onChange={e => handleReviewInput(r._id, "rating", e.target.value)}
                    style={{ width: 50, marginRight: 5 }}
                  />
                  <input
                    type="text"
                    placeholder="Comment"
                    value={(reviewInputs[r._id]?.comment) || ""}
                    onChange={e => handleReviewInput(r._id, "comment", e.target.value)}
                    style={{ marginRight: 5 }}
                  />
                  <button type="submit">Add Review</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Recommendations Section */}
      <div style={{ marginTop: 40 }}>
        <h3>Recommended for you</h3>
        <ul>
          {recommendations.map(r => (
            <li key={r._id || r.name}>
              <strong>{r.recipe_name || r.name}</strong>
              {r.image_url && (
                <img src={r.image_url} alt={r.recipe_name} style={{ width: 40, marginLeft: 10 }} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}