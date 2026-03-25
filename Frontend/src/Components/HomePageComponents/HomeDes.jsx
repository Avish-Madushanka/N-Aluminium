import React from 'react';
import { Link } from 'react-router-dom';
import './HomeDes.css';

const HomeDes = () => {
  const adventureData = [
    {
      id: 1,
      title: "EXTREME RIDING",
      desc: "Ride the wild slopes — snowboard, ski, or mountain bike among breathtaking peaks. For those who live for adrenaline and untamed freedom.",
      img: "https://www.inotherm.com/wp-content/uploads/2024/11/moderna_AGE_1326_MS-6071_-RAL_MATT_serija-70_BT-610-1-896x753.jpg?x10087",
      bgColor: "hmd-bg-grey",
      path: "/extreme-riding"
    },
    {
      id: 2,
      title: "ROCK CLIMBING",
      desc: "Climb beyond your limits — challenge your strength, balance, and spirit. Reach the top, conquer yourself.",
      img: "https://ey2msiqxj7z.exactdn.com/wp-content/uploads/2019/12/13223504/ao200309_weather01-scaled.jpg?strip=all&lossy=1&ssl=1",
      bgColor: "hmd-bg-navy",
      textColor: "hmd-text-light",
      path: "/rock-climbing"
    },
    {
      id: 3,
      title: "ADVENTURE TOURS",
      desc: "Join guided adventure trips — from mountain biking and jeep safaris to kayaking through wild mountain rivers. Go beyond the ordinary.",
      img: "https://aluminco.com/wp-content/uploads/2025/06/1.SAWAKI-VILLA-810x570.jpg",
      bgColor: "hmd-bg-orange",
      textColor: "hmd-text-light",
      path: "/adventure-tours"
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
                    START JOURNEY
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