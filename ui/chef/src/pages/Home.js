/* global fetch */
import React, {useState, useEffect} from 'react';


import Recipes from '../features/recipes/Recipes.js';
import Recipe from '../features/recipe/Recipe.js';

import Filter from '../features/filter/Filter';

function Home() {

  
  const [currentRecipe, setCurrentRecipe] = useState(null);


  function createBlankRecipe() {
    return { name: '', book: '', page: '', attrs: {}, lastMade: '', ingredients: [], note: '' };
  }

  async function showRecipe(id) {
    const resp = await fetch(`/api/recipes/${id}`);
    const data = await resp.json();
    setCurrentRecipe(data);
    document.getElementById('recipeView').show();
    
  }
  
  function addRecipe() {
    setCurrentRecipe(createBlankRecipe());
    document.getElementById('recipeView').show();
  }
  
  function closeRecipe() {
    setCurrentRecipe(null);
    console.log(currentRecipe);
    document.getElementById('recipeView').close();
  }
  
  async function deleteRecipe(id) {
    
    const resp = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    const data = await resp.json();
    setCurrentRecipe(null);
  }
  
  async function saveRecipe() {
    
    const config = {
      method : null,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(currentRecipe)
    };
    
    const url = currentRecipe._id
      ? `/api/recipes/${currentRecipe._id}`
      : '/api/recipes';
      
    config.method = currentRecipe._id
      ? 'PATCH'
      : 'PUT';
    
    const resp = await fetch(url, config);
     
    if (resp.ok) {
      
      if(!currentRecipe._id) {
        const newlyAddedRecipe = await resp.json();
        setCurrentRecipe(newlyAddedRecipe);
      }
      setCurrentRecipe(null);
      document.getElementById('recipeView').close();
    } else {
      console.error(resp);
    }
       
  }
  
  function recipeChanged(r) {
    console.log(r);
    setCurrentRecipe(r);
  }


  return (
    <>
      <main>
      <div>
        <button onClick={addRecipe}>Add</button>
        <Recipes onRecipeSelected={showRecipe} onRecipeDeleted={deleteRecipe}></Recipes>
      </div>
      </main>
      <dialog id="recipeView">
        { currentRecipe && <Recipe recipe={currentRecipe} onRecipeChange={recipeChanged}></Recipe> }
        <button onClick={closeRecipe}>Close</button>
        <button onClick={saveRecipe}>Save</button>
      </dialog>
    </>
  );
}

export default Home;
