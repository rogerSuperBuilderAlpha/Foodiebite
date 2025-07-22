// Example: Select Dish of the Month from recipes DB

const getDishOfTheMonth = async (RecipeModel, date = new Date()) => {
  // Use current year and month to rotate dishes; ensures a new dish each month
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // Get all eligible recipes (could filter by "featured", "global", etc.)
  const allDishes = await RecipeModel.find({});
  if (allDishes.length === 0) return null;

  // Deterministic pick: rotate based on year+month so it's always the same for a given month
  const hash = (year * 12 + monthIndex) % allDishes.length;
  return allDishes[hash];
};

module.exports = getDishOfTheMonth; 