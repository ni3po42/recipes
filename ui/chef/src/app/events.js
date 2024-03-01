export function listenRecipeSelected(handler) {
    document.addEventListener('onrecipeselected', handler);
}

export function stopListenRecipeSelected(handler) {
    document.removeEventListener('onrecipeselected', handler);
}


export function dispatchRecipeSelected(id) {
    const event = new CustomEvent('onrecipeselected', { detail : id });
    
    document.dispatchEvent(event);
}


export function listenRecipeDeleted(handler) {
    document.addEventListener('onrecipedeleted', handler);
}

export function stopListenRecipeDeleted(handler) {
    document.removeEventListener('onrecipedeleted', handler);
}


export function dispatchRecipeDeleted(id) {
    const event = new CustomEvent('onrecipedeleted', { detail : id });
    
    document.dispatchEvent(event);
}