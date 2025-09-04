import React from "react";
import "./MainHomePage.css"; 
import { FaSearch } from "react-icons/fa";

export default function MainHomePage() {
  const handleSearch = () => {
    const searchQuery = prompt("What are you looking for?");
    if (searchQuery) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const handleExploreCategory = (category) => {
    alert("Exploring category: " + category);
  };

  const handleHeroClick = () => {
    alert("Exploring the entire collection!");
  };

  return (
    <div>
      <section className="MHP-hero">
        <h1 className="MHP-heroTitle">
         WELCOME
        </h1>
        <p className="MHP-heroText">
          Explore our curated collections to discover the perfect pieces for your unique vision.
        </p>
      </section>

      <section className="MHP-categories">
        <div className="MHP-container">
          <div className="MHP-categoryGrid">
            
            <div className="MHP-categoryCard">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80"
                alt="Living Room"
                className="MHP-categoryImage"
              />
              <div className="MHP-categoryContent">
                <h3 className="MHP-categoryName">Living Room</h3>
                <p className="MHP-categoryDesc">
                  Create a cozy and inviting living space with our stylish furniture and decor.
                </p>
                <button
                  className="MHP-categoryButton"
                  onClick={() => handleExploreCategory("Living Room")}
                >
                  Explore
                </button>
              </div>
            </div>

            <div className="MHP-categoryCard">
              <img
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
                alt="Dining Room"
                className="MHP-categoryImage"
              />
              <div className="MHP-categoryContent">
                <h3 className="MHP-categoryName">Dining Room</h3>
                <p className="MHP-categoryDesc">
                  Elevate your dining experience with our elegant tables and chairs.
                </p>
                <button
                  className="MHP-categoryButton"
                  onClick={() => handleExploreCategory("Dining Room")}
                >
                  Explore
                </button>
              </div>
            </div>

            <div className="MHP-categoryCard">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80"
                alt="Bedroom"
                className="MHP-categoryImage"
              />
              <div className="MHP-categoryContent">
                <h3 className="MHP-categoryName">Bedroom</h3>
                <p className="MHP-categoryDesc">
                  Transform your bedroom into a peaceful retreat with our collections.
                </p>
                <button
                  className="MHP-categoryButton"
                  onClick={() => handleExploreCategory("Bedroom")}
                >
                  Explore
                </button>
              </div>
            </div>

            <div className="MHP-categoryCard">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
                alt="Office"
                className="MHP-categoryImage"
              />
              <div className="MHP-categoryContent">
                <h3 className="MHP-categoryName">Home Office</h3>
                <p className="MHP-categoryDesc">
                  Boost productivity with our ergonomic and stylish office furniture.
                </p>
                <button
                  className="MHP-categoryButton"
                  onClick={() => handleExploreCategory("Home Office")}
                >
                  Explore
                </button>
              </div>
            </div>

            <div className="MHP-categoryCard">
              <img
                src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80"
                alt="Outdoor"
                className="MHP-categoryImage"
              />
              <div className="MHP-categoryContent">
                <h3 className="MHP-categoryName">Outdoor</h3>
                <p className="MHP-categoryDesc">
                  Create an outdoor oasis with our durable and beautiful patio collections.
                </p>
                <button
                  className="MHP-categoryButton"
                  onClick={() => handleExploreCategory("Outdoor")}
                >
                  Explore
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
