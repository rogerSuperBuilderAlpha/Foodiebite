// ===== MEAL PLANNER & MEAL PREP ASSISTANT =====
// Comprehensive meal planning system with smart recommendations

class MealPlanner {
    constructor() {
        this.currentWeek = this.getCurrentWeek();
        this.mealPlans = this.loadMealPlans();
        this.recipes = this.loadRecipes();
        this.userPreferences = this.loadUserPreferences();
        this.init();
    }

    init() {
        this.createMealPlannerUI();
        this.setupEventListeners();
        this.renderCurrentWeek();
        this.setupDragAndDrop();
        this.initializeMealPrepAssistant();
    }

    // ===== CREATE MEAL PLANNER UI =====
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

                <!-- Shopping List Modal -->
                <div id="shopping-modal" class="modal">
                    <div class="modal__content">
                        <div class="modal__header">
                            <h3>Shopping List</h3>
                            <button class="modal__close">&times;</button>
                        </div>
                        <div class="modal__body">
                            <div class="shopping-list" id="shopping-list"></div>
                            <div class="shopping-actions">
                                <button class="btn btn--primary" id="print-list">
                                    <i class="fas fa-print"></i>
                                    Print List
                                </button>
                                <button class="btn btn--outline" id="share-list">
                                    <i class="fas fa-share"></i>
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Prep Schedule Modal -->
                <div id="prep-modal" class="modal">
                    <div class="modal__content">
                        <div class="modal__header">
                            <h3>Meal Prep Schedule</h3>
                            <button class="modal__close">&times;</button>
                        </div>
                        <div class="modal__body">
                            <div class="prep-timeline" id="prep-timeline"></div>
                        </div>
                    </div>
                </div>

                <!-- Nutrition Modal -->
                <div id="nutrition-modal" class="modal">
                    <div class="modal__content">
                        <div class="modal__header">
                            <h3>Weekly Nutrition Analysis</h3>
                            <button class="modal__close">&times;</button>
                        </div>
                        <div class="modal__body">
                            <div class="nutrition-charts" id="nutrition-charts"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert into the page (you can modify this selector based on where you want it)
        const targetElement = document.querySelector('.section') || document.body;
        targetElement.insertAdjacentHTML('beforeend', mealPlannerHTML);
    }

    // ===== SETUP EVENT LISTENERS =====
    setupEventListeners() {
        // Week navigation
        document.getElementById('prev-week').addEventListener('click', () => this.previousWeek());
        document.getElementById('next-week').addEventListener('click', () => this.nextWeek());

        // Generate meal plan
        document.getElementById('generate-plan').addEventListener('click', () => this.generateMealPlan());

        // Recipe search
        document.getElementById('recipe-search').addEventListener('input', (e) => this.searchRecipes(e.target.value));
        document.getElementById('cuisine-filter').addEventListener('change', () => this.filterRecipes());
        document.getElementById('diet-filter').addEventListener('change', () => this.filterRecipes());

        // Meal prep tools
        document.getElementById('generate-shopping-list').addEventListener('click', () => this.showShoppingList());
        document.getElementById('prep-schedule').addEventListener('click', () => this.showPrepSchedule());
        document.getElementById('nutrition-analysis').addEventListener('click', () => this.showNutritionAnalysis());

        // Modal close buttons
        document.querySelectorAll('.modal__close').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal(modal);
            });
        });
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
                            <div class="meal-content" ondrop="this.drop(event)" ondragover="this.allowDrop(event)">
                                <p class="empty-slot">Drag recipe here</p>
                            </div>
                        </div>
                        <div class="meal-slot" data-meal="lunch" data-day="${index}">
                            <h5>Lunch</h5>
                            <div class="meal-content" ondrop="this.drop(event)" ondragover="this.allowDrop(event)">
                                <p class="empty-slot">Drag recipe here</p>
                            </div>
                        </div>
                        <div class="meal-slot" data-meal="dinner" data-day="${index}">
                            <h5>Dinner</h5>
                            <div class="meal-content" ondrop="this.drop(event)" ondragover="this.allowDrop(event)">
                                <p class="empty-slot">Drag recipe here</p>
                            </div>
                        </div>
                        <div class="meal-slot" data-meal="snack" data-day="${index}">
                            <h5>Snack</h5>
                            <div class="meal-content" ondrop="this.drop(event)" ondragover="this.allowDrop(event)">
                                <p class="empty-slot">Drag recipe here</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        calendarHTML += '</div>';
        calendar.innerHTML = calendarHTML;
    }

    // ===== DRAG AND DROP =====
    setupDragAndDrop() {
        // Make recipes draggable
        this.renderRecipeList();
        
        // Setup drop zones
        document.addEventListener('DOMContentLoaded', () => {
            const dropZones = document.querySelectorAll('.meal-content');
            dropZones.forEach(zone => {
                zone.addEventListener('dragover', this.allowDrop.bind(this));
                zone.addEventListener('drop', this.drop.bind(this));
            });
        });
    }

    allowDrop(ev) {
        ev.preventDefault();
    }

    drop(ev) {
        ev.preventDefault();
        const recipeId = ev.dataTransfer.getData('text/plain');
        const recipe = this.recipes.find(r => r.id === recipeId);
        
        if (recipe) {
            const mealSlot = ev.target.closest('.meal-slot');
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
            this.saveMealPlan();
        }
    }

    removeMeal(button) {
        const mealContent = button.closest('.meal-content');
        mealContent.innerHTML = '<p class="empty-slot">Drag recipe here</p>';
        mealContent.classList.remove('has-meal');
        this.saveMealPlan();
    }

    // ===== RECIPE MANAGEMENT =====
    loadRecipes() {
        // Mock recipe data - replace with actual API call
        return [
            {
                id: '1',
                name: 'Grilled Chicken Salad',
                image: '/assets/images/recipes/chicken-salad.jpg',
                cuisine: 'american',
                diet: 'gluten-free',
                prepTime: '20 min',
                calories: 350,
                ingredients: ['chicken breast', 'mixed greens', 'cherry tomatoes', 'cucumber', 'olive oil']
            },
            {
                id: '2',
                name: 'Quinoa Buddha Bowl',
                image: '/assets/images/recipes/quinoa-bowl.jpg',
                cuisine: 'mediterranean',
                diet: 'vegan',
                prepTime: '25 min',
                calories: 420,
                ingredients: ['quinoa', 'chickpeas', 'avocado', 'kale', 'sweet potato']
            },
            {
                id: '3',
                name: 'Salmon Teriyaki',
                image: '/assets/images/recipes/salmon-teriyaki.jpg',
                cuisine: 'asian',
                diet: 'gluten-free',
                prepTime: '30 min',
                calories: 380,
                ingredients: ['salmon fillet', 'teriyaki sauce', 'broccoli', 'brown rice', 'sesame seeds']
            },
            {
                id: '4',
                name: 'Pasta Primavera',
                image: '/assets/images/recipes/pasta-primavera.jpg',
                cuisine: 'italian',
                diet: 'vegetarian',
                prepTime: '35 min',
                calories: 450,
                ingredients: ['pasta', 'zucchini', 'bell peppers', 'cherry tomatoes', 'parmesan']
            },
            {
                id: '5',
                name: 'Taco Bowl',
                image: '/assets/images/recipes/taco-bowl.jpg',
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
                <div class="recipe-item" draggable="true" data-recipe-id="${recipe.id}">
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
        
        // Make recipes draggable
        const recipeItems = document.querySelectorAll('.recipe-item');
        recipeItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.recipeId);
            });
        });
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
                <div class="recipe-item" draggable="true" data-recipe-id="${recipe.id}">
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
        
        // Re-attach drag events
        const recipeItems = document.querySelectorAll('.recipe-item');
        recipeItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.recipeId);
            });
        });
    }

    // ===== MEAL PLAN GENERATION =====
    generateMealPlan() {
        // AI-powered meal plan generation
        const plan = this.generateSmartMealPlan();
        this.applyMealPlan(plan);
        this.showSuccessMessage('Meal plan generated successfully!');
    }

    generateSmartMealPlan() {
        // Mock AI meal plan generation
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
        // Filter recipes based on meal type
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
        
        this.saveMealPlan();
    }

    // ===== MEAL PREP ASSISTANT =====
    showShoppingList() {
        const modal = document.getElementById('shopping-modal');
        const shoppingList = document.getElementById('shopping-list');
        
        const ingredients = this.generateShoppingList();
        shoppingList.innerHTML = this.renderShoppingList(ingredients);
        
        modal.style.display = 'block';
    }

    generateShoppingList() {
        const ingredients = {};
        
        // Collect all ingredients from planned meals
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

    renderShoppingList(ingredients) {
        if (Object.keys(ingredients).length === 0) {
            return '<p class="empty-message">No meals planned yet. Add some recipes to generate a shopping list!</p>';
        }
        
        let listHTML = '<ul class="shopping-items">';
        Object.entries(ingredients).forEach(([ingredient, count]) => {
            listHTML += `
                <li class="shopping-item">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" class="shopping-checkbox">
                        <span class="checkmark"></span>
                        <span class="ingredient-name">${ingredient}</span>
                        <span class="ingredient-count">${count > 1 ? `(${count})` : ''}</span>
                    </label>
                </li>
            `;
        });
        listHTML += '</ul>';
        
        return listHTML;
    }

    showPrepSchedule() {
        const modal = document.getElementById('prep-modal');
        const prepTimeline = document.getElementById('prep-timeline');
        
        const schedule = this.generatePrepSchedule();
        prepTimeline.innerHTML = this.renderPrepSchedule(schedule);
        
        modal.style.display = 'block';
    }

    generatePrepSchedule() {
        // Generate optimal meal prep schedule
        const schedule = [
            { day: 'Sunday', tasks: ['Batch cook grains', 'Prep vegetables', 'Cook proteins'] },
            { day: 'Monday', tasks: ['Assemble lunch boxes', 'Prep dinner ingredients'] },
            { day: 'Tuesday', tasks: ['Cook dinner', 'Prep tomorrow\'s breakfast'] },
            { day: 'Wednesday', tasks: ['Restock snacks', 'Plan weekend meals'] },
            { day: 'Thursday', tasks: ['Cook dinner', 'Prep weekend prep'] },
            { day: 'Friday', tasks: ['Light prep', 'Plan next week'] },
            { day: 'Saturday', tasks: ['Grocery shopping', 'Meal planning'] }
        ];
        
        return schedule;
    }

    renderPrepSchedule(schedule) {
        let timelineHTML = '<div class="prep-timeline-container">';
        schedule.forEach(day => {
            timelineHTML += `
                <div class="timeline-day">
                    <div class="day-header">
                        <h4>${day.day}</h4>
                    </div>
                    <div class="day-tasks">
                        ${day.tasks.map(task => `
                            <div class="task-item">
                                <i class="fas fa-check-circle"></i>
                                <span>${task}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        timelineHTML += '</div>';
        
        return timelineHTML;
    }

    showNutritionAnalysis() {
        const modal = document.getElementById('nutrition-modal');
        const nutritionCharts = document.getElementById('nutrition-charts');
        
        const nutrition = this.calculateWeeklyNutrition();
        nutritionCharts.innerHTML = this.renderNutritionCharts(nutrition);
        
        modal.style.display = 'block';
    }

    calculateWeeklyNutrition() {
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        
        // Calculate nutrition from planned meals
        const mealSlots = document.querySelectorAll('.meal-slot');
        mealSlots.forEach(slot => {
            const recipeId = slot.querySelector('.meal-recipe')?.dataset.recipeId;
            if (recipeId) {
                const recipe = this.recipes.find(r => r.id === recipeId);
                if (recipe) {
                    totalCalories += recipe.calories;
                    // Mock nutrition values - replace with actual data
                    totalProtein += Math.floor(recipe.calories * 0.3 / 4); // 30% protein
                    totalCarbs += Math.floor(recipe.calories * 0.4 / 4);  // 40% carbs
                    totalFat += Math.floor(recipe.calories * 0.3 / 9);    // 30% fat
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

    renderNutritionCharts(nutrition) {
        return `
            <div class="nutrition-summary">
                <div class="nutrition-card">
                    <h4>Total Calories</h4>
                    <div class="nutrition-value">${nutrition.calories}</div>
                    <p>Weekly Total</p>
                </div>
                <div class="nutrition-card">
                    <h4>Protein</h4>
                    <div class="nutrition-value">${nutrition.protein}g</div>
                    <p>Daily Average</p>
                </div>
                <div class="nutrition-card">
                    <h4>Carbohydrates</h4>
                    <div class="nutrition-value">${nutrition.carbs}g</div>
                    <p>Daily Average</p>
                </div>
                <div class="nutrition-card">
                    <h4>Fat</h4>
                    <div class="nutrition-value">${nutrition.fat}g</div>
                    <p>Daily Average</p>
                </div>
            </div>
            <div class="nutrition-chart">
                <canvas id="nutrition-pie-chart"></canvas>
            </div>
        `;
    }

    // ===== UTILITY METHODS =====
    closeModal(modal) {
        modal.style.display = 'none';
    }

    showSuccessMessage(message) {
        // Create and show success notification
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

    saveMealPlan() {
        // Save current meal plan to localStorage
        const mealPlan = {};
        const mealSlots = document.querySelectorAll('.meal-slot');
        
        mealSlots.forEach(slot => {
            const day = slot.dataset.day;
            const meal = slot.dataset.meal;
            const recipeId = slot.querySelector('.meal-recipe')?.dataset.recipeId;
            
            if (!mealPlan[day]) mealPlan[day] = {};
            if (recipeId) {
                mealPlan[day][meal] = recipeId;
            }
        });
        
        localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    }

    loadMealPlans() {
        const saved = localStorage.getItem('mealPlan');
        return saved ? JSON.parse(saved) : {};
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('userPreferences');
        return saved ? JSON.parse(saved) : {
            dietaryRestrictions: [],
            cuisinePreferences: [],
            calorieGoal: 2000,
            prepTime: 'medium'
        };
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.mealPlanner = new MealPlanner();
});

// ===== GLOBAL FUNCTIONS FOR HTML ONCLICK =====
window.removeMeal = function(button) {
    if (window.mealPlanner) {
        window.mealPlanner.removeMeal(button);
    }
};
