import React from 'react';
import './ServiceMain.css';

function ServiceMain() {
  const items = [
    {
      img: "https://www.rcmscrapmetal.com/images/blog/1718919338blog-24-06-20.jpg",
      link: "/Collection",
      title: "Eco-Friendly Waste Disposal",
    },
    {
      img: "https://img.freepik.com/free-photo/high-angle-living-room-interior-design_23-2149647173.jpg?semt=ais_hybrid&w=740&q=80",
      link: "/community-cleanup",
      title: "Community Cleanup Drives",
    },
    {
      img: "https://www.ohra.net/fileadmin/_processed_/7/f/csm_kragarmregal_alu12_b0ab15b121.jpg",
      link: "/ItemMarkert",
      title: "Eco-Friendly Waste Disposal",
    },
    {
      img: "https://www.musgroves.co.nz/wp-content/uploads/2020/04/how-to-repair-aluminium-window-frames-retina-1.jpg",
      link: "/BuyandSell",
      title: "Community Cleanup Drives",
    },
    {
      img: "https://pbs.twimg.com/media/FfCEKerXEAA6dOV?format=jpg&name=large",
      link: "/Project",
      title: "Eco-Friendly Waste Disposal",
    },
    {
      img: "https://antonaluminium.com/wp-content/uploads/2021/01/anton-aluminium.jpg",
      link: "/AluTReg",
      title: "Community Cleanup Drives",
    },
  ];

  return (
    <div className="Ser-App12">
      <div className="Ser-container">
        <div className="Ser-hero-section">
          <div className="Ser-overlay"></div>
          <div className="Ser-hero-content">
            <h1 className="Ser-hero-title">Our Services</h1>
          </div>
        </div>
      </div>

      <main>
        <div className="Ser-gallery-container">
          <h2 className="Ser-gallery-title">
            Building a Sustainable Future Together
          </h2>
          <div className="Ser-gallery-grid">
            {items.map((item, index) => (
              <div key={index} className="Ser-gallery-item">
                <img
                  src={item.img}
                  alt={`Gallery ${index + 1}`}
                  className="Ser-gallery-image"
                />
                <div className="Ser-gallery-overlay">
                  <h3 className="Ser-gallery-overlay-title">{item.title}</h3>
                  <div className="Ser-gallery-icons">
                    <a href={item.link} className="Ser-icon">
                      <i className="fas fa-link"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ServiceMain;
