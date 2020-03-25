const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsElement = document.getElementById('meal');
const resultHeading = document.getElementById('result-heading');
const singleMealElement = document.getElementById('single-meal');

// Seartch/Fetch meal from API
function searchMeal(event) {
    event.preventDefault();

    // Clear single meal
    singleMealElement.innerHTML = '';

    // Get Search term
    const term = search.value;

    // Check if empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                resultHeading.innerHTML = `<h2>Search results for "${term}"</h2>`;
                if (data.meals == null) {
                    resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
                }
                else {
                    mealsElement.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `).join('');
                }
            });
        // Clear search text
        search.value = '';
    }
    else {
        alert('Please enter a search term')
    }

}

// Fetch a meal by ID
function getMealByID(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        });
}

// Adds meal to DOM 
function addMealToDOM(meal) {
    const ingredients = [];
    // Meal DB has a max of 20 ingredients
    // API returns list of ingredients, seperate list of measurements.
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
        else {
            break;
        }
    }

    singleMealElement.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`)}
                </ul>
            </div>
        </div>
    `;
}

// Fetch a random meal from API
function getRandomMeal() {
    // Clear meals and heading
    mealsElement.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
}

// Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsElement.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        }
        else {
            return false;
        }
    });

    if (mealInfo) {
        //grabing meals id
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealByID(mealID);
    }
});