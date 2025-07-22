import React from 'react';

const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Nut-Free", "Halal", "Kosher"
];

export default function RecipeFilters({ selected, setSelected }) {
  return (
    <div>
      <h3>Dietary Restrictions</h3>
      {dietaryOptions.map(opt => (
        <label key={opt}>
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() =>
              setSelected(selected.includes(opt)
                ? selected.filter(o => o !== opt)
                : [...selected, opt])
            }
          />
          {opt}
        </label>
      ))}
    </div>
  );
} 