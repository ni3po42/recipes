import Recipe from "../recipe/Recipe.js";

function Recipes({recipes}) {

    return recipes
        .map(recipe => {
            return (
                <Recipe recipe={recipe}></Recipe>
            );
        });
}

export default Recipes;