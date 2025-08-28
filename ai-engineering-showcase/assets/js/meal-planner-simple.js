// ===== SIMPLIFIED MEAL PLANNER =====
// Core meal planning functionality

class SimpleMealPlanner {
    constructor() {
        this.currentWeek = this.getCurrentWeek();
        this.recipes = this.loadRecipes();
        this.init();
    }

    init() {
        this.createMealPlannerUI();
        this.setupEventListeners();
        this.renderCurrentWeek();
        this.renderRecipeList();
    }

    // ===== CREATE UI =====
    createMealPlannerUI() {
        const mealPlannerHTML = `
            <div id="meal-planner" class="meal-planner">
                <div class="meal-planner__header">
                    <h2 class="meal-planner__title">Meal Planner & Prep Assistant</h2>
                    <div class="meal-planner__controls">
                        <button class="btn btn--outline" id="prev-week">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span class="week-display" id="week-display"></span>
                        <button class="btn btn--outline" id="next-week">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="btn btn--primary" id="generate-plan">
                            <i class="fas fa-magic"></i>
                            Generate Plan
                        </button>
                    </div>
                </div>

                <div class="meal-planner__content">
                    <div class="meal-planner__sidebar">
                        <div class="recipe-search">
                            <h3>Recipe Library</h3>
                            <div class="search-box">
                                <input type="text" id="recipe-search" placeholder="Search recipes...">
                                <i class="fas fa-search"></i>
                            </div>
                            <div class="recipe-filters">
                                <select id="cuisine-filter">
                                    <option value="">All Cuisines</option>
                                    <option value="italian">Italian</option>
                                    <option value="mexican">Mexican</option>
                                    <option value="asian">Asian</option>
                                    <option value="mediterranean">Mediterranean</option>
                                    <option value="american">American</option>
                                </select>
                                <select id="diet-filter">
                                    <option value="">All Diets</option>
                                    <option value="vegetarian">Vegetarian</option>
                                    <option value="vegan">Vegan</option>
                                    <option value="gluten-free">Gluten-Free</option>
                                    <option value="keto">Keto</option>
                                    <option value="paleo">Paleo</option>
                                </select>
                            </div>
                            <div class="recipe-list" id="recipe-list"></div>
                        </div>
                    </div>

                    <div class="meal-planner__main">
                        <div class="weekly-calendar" id="weekly-calendar"></div>
                        
                        <div class="meal-prep-section">
                            <h3>Meal Prep Assistant</h3>
                            <div class="prep-tools">
                                <button class="btn btn--secondary" id="generate-shopping-list">
                                    <i class="fas fa-shopping-cart"></i>
                                    Shopping List
                                </button>
                                <button class="btn btn--secondary" id="prep-schedule">
                                    <i class="fas fa-clock"></i>
                                    Prep Schedule
                                </button>
                                <button class="btn btn--secondary" id="nutrition-analysis">
                                    <i class="fas fa-chart-pie"></i>
                                    Nutrition
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const targetElement = document.querySelector('.section') || document.body;
        targetElement.insertAdjacentHTML('beforeend', mealPlannerHTML);
    }

    // ===== SETUP EVENTS =====
    setupEventListeners() {
        document.getElementById('prev-week').addEventListener('click', () => this.previousWeek());
        document.getElementById('next-week').addEventListener('click', () => this.nextWeek());
        document.getElementById('generate-plan').addEventListener('click', () => this.generateMealPlan());
        document.getElementById('recipe-search').addEventListener('input', (e) => this.searchRecipes(e.target.value));
        document.getElementById('cuisine-filter').addEventListener('change', () => this.filterRecipes());
        document.getElementById('diet-filter').addEventListener('change', () => this.filterRecipes());
        document.getElementById('generate-shopping-list').addEventListener('click', () => this.showShoppingList());
        document.getElementById('prep-schedule').addEventListener('click', () => this.showPrepSchedule());
        document.getElementById('nutrition-analysis').addEventListener('click', () => this.showNutritionAnalysis());
    }

    // ===== WEEK NAVIGATION =====
    getCurrentWeek() {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return startOfWeek;
    }

    previousWeek() {
        this.currentWeek.setDate(this.currentWeek.getDate() - 7);
        this.renderCurrentWeek();
    }

    nextWeek() {
        this.currentWeek.setDate(this.currentWeek.getDate() + 7);
        this.renderCurrentWeek();
    }

    renderCurrentWeek() {
        const weekDisplay = document.getElementById('week-display');
        const endOfWeek = new Date(this.currentWeek);
        endOfWeek.setDate(this.currentWeek.getDate() + 6);

        weekDisplay.textContent = `${this.currentWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
        this.renderWeeklyCalendar();
    }

    // ===== WEEKLY CALENDAR =====
    renderWeeklyCalendar() {
        const calendar = document.getElementById('weekly-calendar');
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        let calendarHTML = '<div class="weekly-grid">';
        
        days.forEach((day, index) => {
            const currentDate = new Date(this.currentWeek);
            currentDate.setDate(this.currentWeek.getDate() + index);
            
            calendarHTML += `
                <div class="day-column" data-day="${index}">
                    <div class="day-header">
                        <h4>${day}</h4>
                        <span class="date">${currentDate.getDate()}</span>
                    </div>
                    <div class="meals">
                        <div class="meal-slot" data-meal="breakfast" data-day="${index}">
                            <h5>Breakfast</h5>
                            <div class="meal-content">
                                <p class="empty-slot">Click to add meal</p>
                            </div>
                        </div>
                        <div class="meal-slot" data-meal="lunch" data-day="${index}">
                            <h5>Lunch</h5>
                            <div class="meal-content">
                                <p class="empty-slot">Click to add meal</p>
                            </div>
                        </div>
                        <div class="meal-slot" data-meal="dinner" data-day="${index}">
                            <h5>Dinner</h5>
                            <div class="meal-content">
                                <p class="empty-slot">Click to add meal</p>
                            </div>
                        </div>
                        <div class="meal-slot" data-meal="snack" data-day="${index}">
                            <h5>Snack</h5>
                            <div class="meal-content">
                                <p class="empty-slot">Click to add meal</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        calendarHTML += '</div>';
        calendar.innerHTML = calendarHTML;
        
        // Add click events to meal slots
        this.setupMealSlotEvents();
    }

    setupMealSlotEvents() {
        const mealSlots = document.querySelectorAll('.meal-content');
        mealSlots.forEach(slot => {
            slot.addEventListener('click', () => this.showRecipeSelector(slot));
        });
    }

    showRecipeSelector(mealSlot) {
        const recipe = this.recipes[Math.floor(Math.random() * this.recipes.length)];
        mealSlot.innerHTML = `
            <div class="meal-recipe" data-recipe-id="${recipe.id}">
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-thumb">
                <div class="recipe-info">
                    <h6>${recipe.name}</h6>
                    <p class="recipe-meta">
                        <span class="prep-time">${recipe.prepTime}</span>
                        <span class="calories">${recipe.calories} cal</span>
                    </p>
                </div>
                <button class="remove-meal" onclick="this.removeMeal(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        mealSlot.classList.add('has-meal');
    }

    // ===== RECIPE MANAGEMENT =====
    loadRecipes() {
        return [
            {
                id: '1',
                name: 'Grilled Chicken Salad',
                image: 'https://via.placeholder.com/50x50/4CAF50/FFFFFF?text=CS',
                cuisine: 'american',
                diet: 'gluten-free',
                prepTime: '20 min',
                calories: 350,
                ingredients: ['chicken breast', 'mixed greens', 'cherry tomatoes', 'cucumber', 'olive oil']
            },
            {
                id: '2',
                name: 'Quinoa Buddha Bowl',
                image: 'https://via.placeholder.com/50x50/2196F3/FFFFFF?text=QB',
                cuisine: 'mediterranean',
                diet: 'vegan',
                prepTime: '25 min',
                calories: 420,
                ingredients: ['quinoa', 'chickpeas', 'avocado', 'kale', 'sweet potato']
            },
            {
                id: '3',
                name: 'Salmon Teriyaki',
                image: 'https://via.placeholder.com/50x50/FF9800/FFFFFF?text=ST',
                cuisine: 'asian',
                diet: 'gluten-free',
                prepTime: '30 min',
                calories: 380,
                ingredients: ['salmon fillet', 'teriyaki sauce', 'broccoli', 'brown rice', 'sesame seeds']
            },
            {
                id: '4',
                name: 'Pasta Primavera',
                image: 'https://via.placeholder.com/50x50/9C27B0/FFFFFF?text=PP',
                cuisine: 'italian',
                diet: 'vegetarian',
                prepTime: '35 min',
                calories: 450,
                ingredients: ['pasta', 'zucchini', 'bell peppers', 'cherry tomatoes', 'parmesan']
            },
            {
                id: '5',
                name: 'Taco Bowl',
                image: 'https://via.placeholder.com/50x50/F44336/FFFFFF?text=TB',
                cuisine: 'mexican',
                diet: 'gluten-free',
                prepTime: '25 min',
                calories: 400,
                ingredients: ['ground turkey', 'black beans', 'corn', 'avocado', 'lime']
            }
        ];
    }

    renderRecipeList() {
        const recipeList = document.getElementById('recipe-list');
        let recipeHTML = '';
        
        this.recipes.forEach(recipe => {
            recipeHTML += `
                <div class="recipe-item" data-recipe-id="${recipe.id}">
                    <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
                    <div class="recipe-details">
                        <h6>${recipe.name}</h6>
                        <p class="recipe-meta">
                            <span class="cuisine">${recipe.cuisine}</span>
                            <span class="diet">${recipe.diet}</span>
                        </p>
                        <p class="recipe-time">${recipe.prepTime}</p>
                    </div>
                </div>
            `;
        });
        
        recipeList.innerHTML = recipeHTML;
    }

    searchRecipes(query) {
        const filteredRecipes = this.recipes.filter(recipe => 
            recipe.name.toLowerCase().includes(query.toLowerCase()) ||
            recipe.cuisine.toLowerCase().includes(query.toLowerCase()) ||
            recipe.diet.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFilteredRecipes(filteredRecipes);
    }

    filterRecipes() {
        const cuisineFilter = document.getElementById('cuisine-filter').value;
        const dietFilter = document.getElementById('diet-filter').value;
        
        let filteredRecipes = this.recipes;
        
        if (cuisineFilter) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.cuisine === cuisineFilter);
        }
        
        if (dietFilter) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.diet === dietFilter);
        }
        
        this.renderFilteredRecipes(filteredRecipes);
    }

    renderFilteredRecipes(recipes) {
        const recipeList = document.getElementById('recipe-list');
        let recipeHTML = '';
        
        recipes.forEach(recipe => {
            recipeHTML += `
                <div class="recipe-item" data-recipe-id="${recipe.id}">
                    <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
                    <div class="recipe-details">
                        <h6>${recipe.name}</h6>
                        <p class="recipe-meta">
                            <span class="cuisine">${recipe.cuisine}</span>
                            <span class="diet">${recipe.diet}</span>
                        </p>
                        <p class="recipe-time">${recipe.prepTime}</p>
                    </div>
                </div>
            `;
        });
        
        recipeList.innerHTML = recipeHTML;
    }

    // ===== MEAL PLAN GENERATION =====
    generateMealPlan() {
        const plan = this.generateSmartMealPlan();
        this.applyMealPlan(plan);
        this.showSuccessMessage('Meal plan generated successfully!');
    }

    generateSmartMealPlan() {
        const plan = {};
        const days = 7;
        const meals = ['breakfast', 'lunch', 'dinner', 'snack'];
        
        for (let day = 0; day < days; day++) {
            plan[day] = {};
            meals.forEach(meal => {
                const availableRecipes = this.getRecipesForMeal(meal);
                if (availableRecipes.length > 0) {
                    const randomRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
                    plan[day][meal] = randomRecipe;
                }
            });
        }
        
        return plan;
    }

    getRecipesForMeal(meal) {
        switch (meal) {
            case 'breakfast':
                return this.recipes.filter(r => r.cuisine === 'american' || r.diet === 'vegetarian');
            case 'lunch':
                return this.recipes.filter(r => r.prepTime.includes('25') || r.prepTime.includes('30'));
            case 'dinner':
                return this.recipes.filter(r => r.calories > 350);
            case 'snack':
                return this.recipes.filter(r => r.calories < 200);
            default:
                return this.recipes;
        }
    }

    applyMealPlan(plan) {
        Object.keys(plan).forEach(day => {
            Object.keys(plan[day]).forEach(meal => {
                const recipe = plan[day][meal];
                const mealSlot = document.querySelector(`[data-day="${day}"][data-meal="${meal}"]`);
                if (mealSlot) {
                    const mealContent = mealSlot.querySelector('.meal-content');
                    mealContent.innerHTML = `
                        <div class="meal-recipe" data-recipe-id="${recipe.id}">
                            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-thumb">
                            <div class="recipe-info">
                                <h6>${recipe.name}</h6>
                                <p class="recipe-meta">
                                    <span class="prep-time">${recipe.prepTime}</span>
                                    <span class="calories">${recipe.calories} cal</span>
                                </p>
                            </div>
                            <button class="remove-meal" onclick="this.removeMeal(this)">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    mealContent.classList.add('has-meal');
                }
            });
        });
    }

    // ===== MEAL PREP ASSISTANT =====
    showShoppingList() {
        const ingredients = this.generateShoppingList();
        alert(`Shopping List:\n${Object.entries(ingredients).map(([ingredient, count]) => 
            `- ${ingredient} ${count > 1 ? `(${count})` : ''}`
        ).join('\n')}`);
    }

    generateShoppingList() {
        const ingredients = {};
        
        const mealSlots = document.querySelectorAll('.meal-slot');
        mealSlots.forEach(slot => {
            const recipeId = slot.querySelector('.meal-recipe')?.dataset.recipeId;
            if (recipeId) {
                const recipe = this.recipes.find(r => r.id === recipeId);
                if (recipe) {
                    recipe.ingredients.forEach(ingredient => {
                        ingredients[ingredient] = (ingredients[ingredient] || 0) + 1;
                    });
                }
            }
        });
        
        return ingredients;
    }

    showPrepSchedule() {
        const schedule = this.generatePrepSchedule();
        const scheduleText = schedule.map(day => 
            `${day.day}: ${day.tasks.join(', ')}`
        ).join('\n');
        alert(`Meal Prep Schedule:\n${scheduleText}`);
    }

    generatePrepSchedule() {
        return [
            { day: 'Sunday', tasks: ['Batch cook grains', 'Prep vegetables', 'Cook proteins'] },
            { day: 'Monday', tasks: ['Assemble lunch boxes', 'Prep dinner ingredients'] },
            { day: 'Tuesday', tasks: ['Cook dinner', 'Prep tomorrow\'s breakfast'] },
            { day: 'Wednesday', tasks: ['Restock snacks', 'Plan weekend meals'] },
            { day: 'Thursday', tasks: ['Cook dinner', 'Prep weekend prep'] },
            { day: 'Friday', tasks: ['Light prep', 'Plan next week'] },
            { day: 'Saturday', tasks: ['Grocery shopping', 'Meal planning'] }
        ];
    }

    showNutritionAnalysis() {
        const nutrition = this.calculateWeeklyNutrition();
        alert(`Weekly Nutrition Summary:\n` +
              `Total Calories: ${nutrition.calories}\n` +
              `Daily Average Protein: ${Math.round(nutrition.protein / 7)}g\n` +
              `Daily Average Carbs: ${Math.round(nutrition.carbs / 7)}g\n` +
              `Daily Average Fat: ${Math.round(nutrition.fat / 7)}g`);
    }

    calculateWeeklyNutrition() {
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        
        const mealSlots = document.querySelectorAll('.meal-slot');
        mealSlots.forEach(slot => {
            const recipeId = slot.querySelector('.meal-recipe')?.dataset.recipeId;
            if (recipeId) {
                const recipe = this.recipes.find(r => r.id === recipeId);
                if (recipe) {
                    totalCalories += recipe.calories;
                    totalProtein += Math.floor(recipe.calories * 0.3 / 4);
                    totalCarbs += Math.floor(recipe.calories * 0.4 / 4);
                    totalFat += Math.floor(recipe.calories * 0.3 / 9);
                }
            }
        });
        
        return {
            calories: totalCalories,
            protein: totalProtein,
            carbs: totalCarbs,
            fat: totalFat
        };
    }

    // ===== UTILITY METHODS =====
    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'notification notification--success';
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.mealPlanner = new SimpleMealPlanner();
});

// ===== GLOBAL FUNCTIONS =====
window.removeMeal = function(button) {
    const mealContent = button.closest('.meal-content');
    mealContent.innerHTML = '<p class="empty-slot">Click to add meal</p>';
    mealContent.classList.remove('has-meal');
};
