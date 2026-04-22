import React from 'react';
import { Link } from 'react-router-dom';
import './HomeDes.css';

const HomeDes = () => {
  const adventureData = [
    {
      id: 1,
      title: "Custom Glass ",
      desc: "Smart solution for custom glass design and ordering.",
      img: "https://www.flemingconstructiongroup.com/wp-content/uploads/2022/09/AdobeStock_216792368-scaled.jpeg",
      bgColor: "hmd-bg-grey",
      path: "/GlassOrder"
    },
    {
      id: 2,
      title: "Buy & Sell Aluminum",
      desc: "Direct trading platform for aluminum scraps and processed materials.",
      img: "https://ey2msiqxj7z.exactdn.com/wp-content/uploads/2019/12/13223504/ao200309_weather01-scaled.jpg?strip=all&lossy=1&ssl=1",
      bgColor: "hmd-bg-navy",
      textColor: "hmd-text-light",
      path: "/BuyandSell"
    },
    {
      id: 3,
      title: "Industrial Projects",
      desc: "Support for industrial recycling and large-scale sustainability projects",
      img: "https://aluminco.com/wp-content/uploads/2025/06/1.SAWAKI-VILLA-810x570.jpg",
      bgColor: "hmd-bg-orange",
      textColor: "hmd-text-light",
      path: "/Project"
    }
  ];

  return (
    <section className="hmd-adv-section">
      <div className="hmd-adv-container">
        
        <div className="hmd-adv-header">
          <div className="hmd-adv-titles">
            <h2 className="hmd-adv-main-heading">CHOOSE YOUR MOUNTAIN ADVENTURE</h2>
            <p className="hmd-adv-sub-desc">
              Discover the most exciting ways to explore the mountains — from extreme rides to climbing and guided tours.
            </p>
          </div>
          <Link to="/Service" className="hmd-adv-top-btn">View All Services</Link>
        </div>

        <div className="hmd-adv-grid">
          {adventureData.map((item) => (
            <div key={item.id} className={`hmd-adv-card ${item.bgColor} ${item.textColor || ''}`}>
              <div className="hmd-adv-content">
                <h3 className="hmd-adv-card-title">{item.title}</h3>
                <p className="hmd-adv-card-text">{item.desc}</p>
              </div>
              <div className="hmd-adv-img-box">
                <img src={item.img} alt={item.title} />
                <div className="hmd-adv-hover-overlay">
                  <Link to={item.path} className="hmd-adv-inner-btn">
                    More Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeDes;