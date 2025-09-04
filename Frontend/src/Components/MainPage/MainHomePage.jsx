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
                src="https://www.dcw.co.uk/wp-content/uploads/2021/09/The-Benefits-of-Waste-Collection-Services-for-Your-Business-scaled.jpg"
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
                src="https://media.sketchfab.com/models/a4865b88e73b4fde9bccf7e737af79f1/thumbnails/413e7489934c40a19b5e1c3bc349d8d2/9b5e29773a1a4381a699388b12a2aa02.jpeg"
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
                src="https://image.made-in-china.com/318f0j00jTbfmRsKripd/12%E6%9C%885%E6%97%A5+%2813%29.mp4.webp"
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
                src="https://builtoffsite.com.au/wp-content/uploads/2021/09/Modular-home-made-from-aluminium.jpg"
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
                src="https://r2.erweima.ai/imgcompressed/compressed_0d88209b48f99ceb051065e52ecf260b.webp"
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
