/*
  # Meal finder API

  ## Meal results

  An event listener is used on the search input field to generate realtime search results

  Searches for meals based on the first typed letter in the input search field

  Stores the meals as:
  - Array of meal data objects returned by the API response (using the spread operator)
  - Array of appended meal nodes

  On subsequent input, existing meals are filtered by matching them against the input search field's value
  - Entire list of meals is rerendered in the DOM for every letter (except the first) after filtering has concluded

  ## Single meal popup

  Render a single meal popup based on associated data-meal-id attribute which is stored on the HTML thumbnail
  data-meal-id is used to make another API call
*/

import { MealsHandler } from './MealsHandler';

const meals = new MealsHandler();
