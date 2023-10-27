import React from "react";

const FavoritesItem = ({ city, removeFromFavorites, notes, saveNote }) => (
    <li>
      {city.cityName} ({city.temperature}°C)
      <button onClick={() => removeFromFavorites(city)}>Remove</button>
      <textarea
        value={notes[city.cityName] || ""}
        onChange={(e) => saveNote(city.cityName, e.target.value)}
      />
    </li>
  );

  export default FavoritesItem