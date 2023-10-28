import React, { useCallback } from 'react'
import { useState, useEffect } from "react";
import FavoritesList from "./FavouriteList";
import CityList from "./CityList";
import './index.css'

const App = () => {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [notes, setNotes] = useState({});
  const [currentNote, setCurrentNote] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
 
  // const apiKey = "3d68fc1de44c7675bcfeafcb08c04b6c"; 
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

  // For Location 
  const getWeatherForUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        )
          .then((response) => response.json())
          .then((data) => {
            setWeatherData(data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      });
    }
  };

  useEffect(() => {
    // Check if the user's location data is already present
    const userLocationData = JSON.parse(localStorage.getItem("userLocationData"));

    if (userLocationData) {
      // If data is found in local storage, use it
      setWeatherData(userLocationData);
    } else {
      // Otherwise, request the user's location and fetch weather data
      getWeatherForUserLocation();
    }
  }, [getWeatherForUserLocation]);     

  // useEffect(() => {
  //   // Fetch data for the 15 largest cities by population (you need to provide the city names)
  //   const largestCities = "New York,London, Paris, Nigeria, Ghana, Cameroon, USA, "; 
  //   fetch(
  //     `http://api.openweathermap.org/data/2.5/group?id=${largestCities}&appid=${apiKey}&units=metric`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data && data.list) {
  //         setCities(data.list);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, [apiKey]);

  
  useEffect(() => {
    const fetchDataAndSetLocalStorage = async () => {
      try {
        const storedCities = localStorage.getItem("weatherCities");
        if (storedCities) {
          setCities(JSON.parse(storedCities));
        } else {
          const largestCities = "New York,London,Paris";
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/group?id=${largestCities}&appid=${apiKey}&units=metric`
          );
          const data = await response.json();
          if (data && data.list) {
            setCities(data.list);
            localStorage.setItem("weatherCities", JSON.stringify(data.list));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndSetLocalStorage();
  }, [apiKey]);

  // const handleSearch = () => {
  //   fetch(
  //     `http://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=metric`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setWeatherData(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // };

  const handleSearch = () => {
    const searchKey = `search:${search}`;
    const cachedData = localStorage.getItem(searchKey);
  
    if (cachedData) {
      setWeatherData(JSON.parse(cachedData));
    } else {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=metric`
      )
        .then((response) => response.json())
        .then((data) => {
          setWeatherData(data);
          localStorage.setItem(searchKey, JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

    // Function to fetch detailed weather data for a specific city
const fetchCityWeather = (cityId) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      setWeatherData(data);
      setSelectedCity(cityId);
      // Fetch detailed weather data for the selected city
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`
      )
        .then((response) => response.json())
        .then((data) => {
          setWeatherData(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};


  const addToFavorites = (city) => {
    setFavorites([...favorites, city]);
  };

  const removeFromFavorites = (city) => {
    const updatedFavorites = favorites.filter((item) => item.id !== city.id);
    setFavorites(updatedFavorites);
  };

  const saveNote = (cityId, note) => {
    setNotes({ ...notes, [cityId]: note });
  };

  return (
    <div>
      <h1>World Weather App</h1>

      <button style={{display: 'none'}} onClick={getWeatherForUserLocation}>Get My Weather</button> 

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <h2>Favorites</h2>
      <FavoritesList
        favorites={favorites}
        removeFromFavorites={removeFromFavorites}
        notes={notes}
        saveNote={saveNote}
      />

      <h2>Cities</h2>
      <CityList cities={cities} addToFavorites={addToFavorites} fetchCityWeather={fetchCityWeather}/>


      {selectedCity && (
        <div>
          <h2>{selectedCity}</h2>
        </div>
      )}

      {weatherData.name && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <button onClick={() => addToFavorites(weatherData)}>Add to Favorites</button>
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)} readOnly={false} disabled={false}
          />
        </div>
      )}
    </div>
  ); 
};

export default App;
