import React from "react";

const CityItem = ({ city, addToFavorites }) => (
    <li>
      {city.cityName} ({city.temperature}°C)
      <button onClick={() => addToFavorites(city)}>Add to Favorites</button>
    </li>
  );

  export default CityItem