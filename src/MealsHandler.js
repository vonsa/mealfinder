import { ConnectToAPI } from './Globals/ConnectToAPI';
import { HelperFunctions } from './Globals/HelperFunctions';
import { SingleMeal } from './Modules/SingleMeal';

export class MealsHandler {
  constructor() {
    this.meals = [];
    this.mealNodes = [];
    this.storeExistingDOMElementReferences();
    this.addEventListeners();
  }

  /*



        STORE REFERENCES TO HTML ELEMENTS



  */

  storeExistingDOMElementReferences() {
    this.random = document.getElementById('random');
    this.mealsEl = document.getElementById('meals');
    this.searchMealInput = document.getElementById('search');
    this.noResultsIndicator = document.querySelector('.results--none');
  }

  /*



        PROCESS USER INPUT



  */

  addEventListeners() {
    // Instantly search/further process meals when providing input in the search field
    this.searchMealInput.addEventListener(
      'input',
      this.searchEventHandler.bind(this)
    );
    // View a clicked meal
    window.addEventListener('click', this.viewClickedMeal.bind(this));
  }

  searchEventHandler() {
    // Remove no results indication
    this.noResultsIndicator.classList.remove('active');
    // Activate spinner
    HelperFunctions.toggleSpinner();
    // If meals are not fetched yet
    if (this.searchMealInput.value.length === 1) {
      this.sendInputQueryToAPI();
    }
    // if meals are already fetched
    else {
      this.updateRenderedMeals(this.searchMealInput.value);
    }
  }

  /*



      API CALLS



*/

  sendInputQueryToAPI() {
    // Fetch data from API
    ConnectToAPI.fetchMeals(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=`,
      this.searchMealInput.value.charAt(0),
      this.processAPIResponse.bind(this)
    );
  }

  processAPIResponse(response) {
    if (response.status && response.status >= 400) {
      alert('Sorry, something seems to be wrong. Please try again later.');
    }
    if (response.meals) {
      this.meals = [...response.meals];
      this.updateRenderedMeals();
    } else {
      HelperFunctions.toggleSpinner();
      this.noResultsIndicator.classList.add('active');
    }
  }

  /*



        FILTER MEAL SEARCH RESULTS



  */

  // Match inputted meal vs search input value and return matching meals
  checkIfMealsMatchInput(meal, inputWord) {
    const lowerCaseValue = meal.strMeal.toString().toLowerCase();
    if (lowerCaseValue.startsWith(inputWord) && inputWord !== '') {
      return meal;
    }
  }

  /*



        PREPARE HTML ELEMENTS



  */

  // Render and return meal element
  createMealElementNode(meal) {
    // Shorten title
    const shortenedTitle = HelperFunctions.shortenInputString(meal.strMeal);

    const newMealElement = document.createElement('div');
    newMealElement.classList.add('meal');
    newMealElement.innerHTML = `<div class="meal-data" data-mealid="${meal.idMeal}" data-title="${meal.strMeal}"><p>${shortenedTitle}</p><div class="meal__img"><img src="${meal.strMealThumb}"><div class="img__overlay">${meal.strMeal}</div></div></div>`;
    return newMealElement;
  }

  /*



        CLEARING MEAL SEARCH RESULTS FROM DOM
        RENDERING MEAL SEARCH RESULTS TO DOM



  */

  updateRenderedMeals() {
    this.mealsEl.classList.remove('visible'); // Removed temporarily for animation purposes

    // Remove all meal nodes from parent element 'mealsEl'
    if (this.mealNodes.length > 0) {
      this.clearMeals();
    }

    // Deactivate spinner
    HelperFunctions.toggleSpinner();

    this.meals.forEach((meal) => {
      // Render and store meals that match the input string
      this.renderAndStoreMatchedMeal(meal);
    });

    setTimeout((e) => {
      this.mealsEl.classList.add('visible'); // Reactivate with a 10ms delay for animation purposes
    }, 10);
  }

  renderAndStoreMatchedMeal(meal) {
    // Check if meal matches input
    const matchedMeal = this.checkIfMealsMatchInput(
      meal,
      this.searchMealInput.value.toLowerCase()
    );

    // Render and store meal
    if (matchedMeal) {
      this.mealNodes.push(
        this.mealsEl.appendChild(this.createMealElementNode(matchedMeal))
      );
    }
  }

  // Remove all meal nodes from parent element 'mealsEl'
  clearMeals() {
    this.mealNodes.forEach((mealNode) => {
      this.mealsEl.removeChild(mealNode);
    });
    // Remove all meal nodes from array
    this.mealNodes = [];
  }

  /*



        RENDERING SINGLE MEAL TO DOM



  */

  viewClickedMeal() {
    const mealInfo = event.composedPath().find((item) => {
      if (item.classList) {
        return item.classList.contains('meal-data');
      } else {
        return false;
      }
    });

    if (mealInfo) {
      this.renderSingleMeal(mealInfo);
    }
  }

  renderSingleMeal(mealInfo) {
    const mealId = mealInfo.getAttribute('data-mealid');
    this.meal = new SingleMeal(mealId, this.removeMeal.bind(this));
  }

  /*



        PASSED AS CALLBACKFUNCTIONS



  */

  removeMeal() {
    this.meal = {};
  }
}
