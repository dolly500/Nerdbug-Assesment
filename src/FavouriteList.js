import React from 'react';
import FavoritesItem from './Component/favouriteItem/FavouriteItem';

const FavoritesList = ({ favorites, removeFromFavorites, notes, saveNote }) => (
    <ul>
      {favorites.map((city) => (
        <FavoritesItem
          key={city.cityName}
          city={city}
          removeFromFavorites={removeFromFavorites}
          notes={notes}
          saveNote={saveNote}
        />
      ))}
    </ul>
  );

export default FavoritesList;