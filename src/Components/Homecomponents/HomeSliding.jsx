import React, { useState, useEffect } from "react";
import Homemain from "./Homemain";
import axios from "axios";

const HomeSliding = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);


    useEffect(() => {
        const fetchFeaturedMovies = async () => {
            setLoading(true);
            setError(null);
          try {
            const response = await axios.get('http://localhost:27017/api/movies/now-showing');
            if (response.data && response.data.length > 0) {
               setMovies(response.data);
            } else {
                setError('No movies found')
            }
          } catch (err) {
            setError(err.message);
          } finally {
             setLoading(false);
          }
        };
         fetchFeaturedMovies();
    }, []);

  useEffect(() => {
        if(movies.length > 0) {
            const interval = setInterval(() => {
                setActiveSlide((prevSlide) => (prevSlide + 1) % movies.length);
            }, 5000);
            return () => clearInterval(interval);
        }
  }, [movies]);

    

    if (error) {
       return <div>Error: {error}</div>
    }

  return (
    <div className="home-container">
      {movies.map((movie, index) => (
        <Homemain
          key={movie._id}
          movie={movie}
          isActive={index === activeSlide}
        />
      ))}
    </div>
  );
};

export default HomeSliding;