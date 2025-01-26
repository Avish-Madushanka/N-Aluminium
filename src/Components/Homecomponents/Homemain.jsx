import React from "react";
import { Play, Ticket } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.css';
import '../../css/Homemain.css'
import { Link } from 'react-router-dom';

function createSlug(title) {
  if (!title) {
    return '';
  }
  return title
    .toLowerCase()
    .replace(/ /g, '-') 
    .replace(/[^\w-]+/g, '');
}

const Homemain = ({ movie, isActive }) => {
  return (
    <div className={`homemain-container ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      {movie && (
        <>
          <div
            className="background-image"
            style={{ backgroundImage: `url(${movie.moviePoster})` }}
          >
            <div className="gradient-overlay"></div>
          </div>
          <div className="content-container">
            <div className="text-container">
              <h1 className="title">{movie.title}</h1>
              <p className="description">{movie.description}</p>
              <div className="buttons-container">
                <Link to={`/booking/${createSlug(movie.title)}`} className="btn btn-primary">
                  <Ticket className="icon" />
                  Buy Tickets
                </Link>
                <Link to={`/${createSlug(movie.title)}`} className="btn btn-primary">
                  <Play className="icon" />
                  Watch Trailer
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Homemain;
