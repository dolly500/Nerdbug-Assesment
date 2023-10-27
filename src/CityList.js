import React from 'react';
import CityItem from './Component/CityItem/CityItem';

const CityList = ({ cities, addToFavorites }) => (
    <ul>
      {cities.map((city) => (
        <CityItem key={city.cityName} city={city} addToFavorites={addToFavorites} />
      ))}
    </ul>
  );

export default CityList