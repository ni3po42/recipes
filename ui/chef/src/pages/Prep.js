/* global fetch */
import React, {useState, useEffect} from 'react';


import Recipes from '../features/recipes/Recipes.js';
import Recipe from '../features/recipe/Recipe.js';

import Filter from '../features/filter/Filter';

function Prep() {

  
  const [currentRecipe, setCurrentRecipe] = useState(null);

  async function showRecipe(id) {
    const resp = await fetch(`/api/recipes/${id}`);
    const data = await resp.json();
    setCurrentRecipe(data);
  }
  
  function recipeChanged(r) {
    console.log(r);
    setCurrentRecipe(r);
  }


  return (
    <main>
      <section>
        <Recipes onRecipeSelected={showRecipe}></Recipes>
      </section>
      <section>
        { currentRecipe && <Recipe recipe={currentRecipe} onRecipeChange={recipeChanged}></Recipe> }
      </section>
    </main>
  );
}

export default Prep;
