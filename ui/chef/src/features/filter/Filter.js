import React, {useState} from 'react';

function Filter({ onFilterChange }){

    const [filter, setFilter] = useState({ lastMade: null });

    function propChanged(prop) {
        return (e) => {
            const updatedFilter = {...filter, [prop] : e.target.value };
            setFilter(updatedFilter);
            onFilterChange(updatedFilter);
        };
    }

    return (
        <div>
          <input type="date" value={(filter?.lastMade || '').split('T')[0]} onChange={propChanged('lastMade')} />
        </div>
    );
}

export default Filter;