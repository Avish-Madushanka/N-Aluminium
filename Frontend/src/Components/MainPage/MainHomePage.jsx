import React from 'react';
import './MainHomePage.css';

const MainHomePage = () => {
  return (
    <div className="MHP-container">
      <div className="MHP-hero">
        <div className="MHP-heroContent">
          <h1>WELCOME</h1>
        </div>
      </div>
      
      <div className="MHP-releases">
        <div className="MHP-postersRow">
          <div className="MHP-posterItem">
            <div className="MHP-posterBox MHP-twinPoster">
              <span>The Twins</span>
            </div>
            <button className="MHP-watchBtn">Watch Now</button>
          </div>
          <div className="MHP-posterItem">
            <div className="MHP-posterBox MHP-dogdaysPoster">
              <span>DOG DAYS</span>
            </div>
            <button className="MHP-watchBtn">Watch Now</button>
          </div>
          <div className="MHP-posterItem">
            <div className="MHP-posterBox MHP-grandfatherPoster">
              <span>How I Met Your Grand Father</span>
            </div>
            <button className="MHP-watchBtn">Watch Now</button>
          </div>
          <div className="MHP-posterItem">
            <div className="MHP-posterBox MHP-orangePoster">
              <span>Black Is The New Orange</span>
            </div>
            <button className="MHP-watchBtn">Watch Now</button>
          </div>
          <div className="MHP-posterItem">
            <div className="MHP-posterBox MHP-zooPoster">
              <span>Zoo Park</span>
            </div>
            <button className="MHP-watchBtn">Watch Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHomePage;
