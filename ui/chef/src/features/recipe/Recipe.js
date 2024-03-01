import React, {useState, useEffect} from 'react';

function Recipe({recipe, onRecipeChange }){

    const [r, setR] = useState(recipe);
    const initNewIngredient = { itemName: '', size: 0, unit: '', note: '' };
    const [newIngredient, setNewIngredient] = useState(initNewIngredient);
    const [newAttr, setNewAttr] = useState('');

    function setProp(prop) {
        return (e) => {
            const updated = {...structuredClone(r), [prop] : e.target.value};
            setR(updated);
            onRecipeChange(updated);
        };
    }
    
    function setAttr(attr) {
        return (e) => {
            const clone = structuredClone(r);
            
            const attrs = {...clone.attrs, [attr] : e.target.checked };
            
            const updated = {...clone, attrs };
            setR(updated);
            onRecipeChange(updated);
        }
    }
    
    function addAttr() {
        return (e) => {
            const clone = structuredClone(r);
            
            const attrs = {...clone.attrs, [newAttr] : true };
            
            const updated = {...clone, attrs };
            setR(updated);
            setNewAttr('');
            onRecipeChange(updated);
        }
    }
    
    function addIngredient() {
        return () => {
            const updated = {...structuredClone(r), ingredients : [...structuredClone(r.ingredients), newIngredient] };
            setR(updated);
            setNewIngredient(initNewIngredient);
            onRecipeChange(updated);
        }
    }
    
    function updateIngredient(prop, index) {
        return (e) => {
            const ingredients = structuredClone(r.ingredients);
            ingredients[index][prop] = e.target.value;
            const updated = {...structuredClone(r), ingredients };
            setR(updated);
            onRecipeChange(updated);
        }
    }
    
    function updateNewIngredient(prop) {
      return (e) => {
        
        const updated = { ...newIngredient, [prop] : e.target.value };
        setNewIngredient(updated);
          
      };
    }
    
    function deleteIngredient(index) {
        const ingredients = [...r.ingredients];
        ingredients.splice(index, 1);
        const updated = {...structuredClone(r), ingredients };
        setR(updated);
        onRecipeChange(updated);
    }

    return (
        <>
            <section>
                <label>Name</label>
                <input type="text" value={r?.name} onChange={setProp('name')} />
            </section>
            <section>
                <label>Location</label>
                <input type="text" value={r?.book} onChange={setProp('book')} />
                <span> on page: </span>
                <input type="text" value={r?.page} onChange={setProp('page')} />
            </section>
            <section>
                <label>Last Made:</label>
                <input type="date" value={(r?.lastMade || '').split('T')[0]} onChange={setProp('lastMade')} />
            </section>
            
            <section>
                <label>Attributes:</label>
                <ul>
                    {
                        Object
                            .keys(r?.attrs || {})
                            .map(attr => (
                                <li key={attr}>{attr}<input type="checkbox" checked={!!r?.attrs[attr]} onChange={setAttr(attr)} /></li>
                            ))
                    }
                    <li>
                        <input type="text" value={newAttr} onChange={e => setNewAttr(e.target.value)} />
                        <button onClick={addAttr()}>Add</button>
                    </li>
                </ul>
            </section>
            
            <section>
                <label>Ingredients:</label>
                <div>
                {
                    r?.ingredients
                        .map((ingredient, i) => (
                        
                        <div key={i}>
                            <input type="text" value={ingredient.itemName} onChange={updateIngredient('itemName', i)} />
                            <input type="number" value={ingredient.size} onChange={updateIngredient('size', i)} />
                            <input type="text" value={ingredient.unit} onChange={updateIngredient('unit', i)} />
                            <input type="text" value={ingredient.note} onChange={updateIngredient('note', i)} />
                            <button onClick={e => deleteIngredient(i) }>Delete</button>
                        </div>
                        
                        ))
                }
                <div>
                    <input type="text" value={newIngredient.itemName} onChange={updateNewIngredient('itemName')} />
                    <input type="number" value={newIngredient.size} onChange={updateNewIngredient('size')} />
                    <input type="text" value={newIngredient.unit} onChange={updateNewIngredient('unit')} />
                    <input type="text" value={newIngredient.note} onChange={updateNewIngredient('note')} />
                    <button onClick={addIngredient()}>Add</button>
                </div>
                </div>
            </section>
            <section>
                <label>Notes:</label>
                <textarea value={r?.note} onChange={setProp('note')}></textarea>
            </section>
            
            
        </>
    );
}

export default Recipe;