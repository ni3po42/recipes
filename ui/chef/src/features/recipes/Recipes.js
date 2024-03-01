import Recipe from "../recipe/Recipe.js";
import React, {useState, useEffect} from 'react';

function Recipes({onRecipeSelected, onRecipeDeleted, recipesInterator}) {

    const [recipes, setRecipes] = useState([]);

    function getRecipes() {
        return fetch('/api/recipes')
          .then(res => res.json())
          .then(data => setRecipes(data));
        
        
        
    }
    
    function handleRecipeDeleted(id) {
        onRecipeDeleted(id);
        
        const copy = structuredClone(recipes);
        const index = copy.findIndex(x=> x._id === id);
        
        if (index < 0) {
            return;
        }
        
        copy.splice(index, 1);
        
        setRecipes(copy);
    }
    
    useEffect(()=>{
        setTimeout(getRecipes, 0);
        //getRecipes();
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Book</td>
                    <td>Slow Cooker</td>
                    <td>Last Made</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
            {
                recipes
                .map(({name, book, attrs, lastMade, _id}) => (
                    <tr key={_id}>
                        <td>
                            <a onClick={e => onRecipeSelected(_id)}>{name}</a>
                        </td>
                        <td>{book}</td>
                        <td>{attrs?.isSlowCook ? 'Y' : 'N'}</td>
                        <td>{(lastMade || '').split('T')[0]}</td>
                        {
                            onRecipeDeleted && (
                                <td>
                                    <button onClick={e => handleRecipeDeleted(_id)}>Delete</button>
                                </td>     
                            )
                        }
                       
                    </tr>
                ))
            }
            </tbody>
        </table>
    );
}

export default Recipes;