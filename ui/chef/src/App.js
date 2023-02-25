import React, {useState, useEffect} from 'react';
import './App.css';

import Recipes from './features/recipes/Recipes.js';

function App() {

  const [recipes, setRecipes] = useState([]);

  useEffect(()=>{

    fetch('/api/recipes')
      .then(res => res.json())
      .then(data => setRecipes(data));  
    
  });

  return (
    <main>
      <Recipes recipes={recipes}></Recipes>
    </main>
  );
}

export default App;
