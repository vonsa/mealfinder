import { ConnectToAPI } from '../Globals/ConnectToAPI';
import { HelperFunctions } from '../Globals/HelperFunctions';

/*
  Class SingleMeal is created when one of the meals rendered by index.js is 
*/

export class SingleMeal {
  constructor(mealId, removeMealFunction) {
    // Fetch data from API which executes callback function prepareMealProperties
    this.mealData = ConnectToAPI.fetchMeals(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=`,
      mealId,
      this.prepareMealProperties.bind(this)
    );

    this.removeMealFromParentClass = removeMealFunction; // Removes itself from the MealsHandler instance
  }

  /*



    PRE PROCESS API DATA



  */

  // Receives API response and prepares the data for further processing
  prepareMealProperties(mealData) {
    const meals = mealData.meals[0];
    const ingredients = [];
    let tags;

    /* Map every ingredient and it's matching measurement, to an object as a property value pair */
    for (let i = 1; i < 21; i++) {
      if (meals[`strIngredient${i}`]) {
        ingredients.push({
          [meals[`strIngredient${i}`]]: meals[`strMeasure${i}`],
        });
      }
    }

    // Create an array of tags
    if (meals['strTags']) {
      tags = meals['strTags'].split(',');
    }

    this.renderSingleMeal(meals, ingredients, tags);
  }

  /*



    PREPARE TEMPLATE ELEMENTS FOR RENDERING



  */

  /* Set dynamic template data based on the API response */
  setDynamicTemplateData(templateClone, mealData, ingredients, tags) {
    if (mealData.strMealThumb) {
      templateClone.querySelector('img').src = mealData.strMealThumb;
    }
    if (mealData.strArea) {
      templateClone.querySelector('.heading__area').innerText =
        mealData.strArea;
    }
    if (mealData.strMeal) {
      templateClone.querySelector('.heading__title').innerText =
        mealData.strMeal;
    }
    if (mealData.strCategory) {
      templateClone.querySelector('.heading__category').innerText =
        mealData.strCategory;
    }
    if (tags) {
      templateClone.querySelector('.heading__tags').innerText = tags.join(', ');
    }
    if (mealData.strInstructions) {
      templateClone.querySelector('.instructions__content').innerText =
        mealData.strInstructions;
    }

    const list = templateClone.querySelector('.ingredients');
    if (ingredients) {
      // Map every ingredient & matching measurement to an object as a property value pair and append it to
      ingredients.forEach((ingredient) => {
        const li = this.createIngredientListItem(ingredient);
        list.appendChild(li);
      });
    }

    return templateClone;
  }

  // Process ingredient object property value pair to generate HTML
  createIngredientListItem(ingredient) {
    const li = document.createElement('li');
    li.classList.add('ingredients__item');
    li.innerHTML = `${Object.keys(ingredient)[0]}: <span>${
      ingredient[Object.keys(ingredient)[0]]
    }</span>`;
    return li;
  }

  /*



    RENDER TO DOM



  */

  // Render a single meal
  renderSingleMeal(mealData, ingredients, tags) {
    HelperFunctions.togglePageScroll();
    this.overlay = HelperFunctions.toggleOverlay();

    const templateClone = document
      .getElementById('recipe')
      .content.cloneNode(true);

    /*
      Set dynamic template data based on the API response
      templateClone is passed by reference and will get updated
    */
    this.setDynamicTemplateData(templateClone, mealData, ingredients, tags);
    const pageContainer = document.getElementById('page-container');
    pageContainer.appendChild(templateClone);

    // Select added template elements and add event listeners to close the single meal popup
    this.templateClone = document.querySelector('section.recipe');
    this.closeBtn = document.querySelector('.recipe__close-btn');
    this.overlay.addEventListener('click', this.closeRecipe.bind(this));
    this.closeBtn.addEventListener('click', this.closeRecipe.bind(this));
  }

  /*



    CLEAR EXISTANCE OF RECIPE IN DOM + REMOVE JAVASCRIPT REFERENCES



  */

  closeRecipe() {
    const pageContainer = document.getElementById('page-container');
    HelperFunctions.togglePageScroll();
    pageContainer.removeChild(this.templateClone);
    HelperFunctions.toggleOverlay();
    HelperFunctions.refreshElements(this.overlay);
    this.removeMealFromParentClass();
  }
}
