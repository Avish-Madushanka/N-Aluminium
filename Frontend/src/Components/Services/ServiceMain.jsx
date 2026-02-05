import React from "react";
import "./ServiceMain.css";

function ServiceMain() {
  const services = [
    {
      title: "Waste Collection",
      desc: "Door-to-door aluminum and recyclable waste collection with scheduled pickups.",
      img: "https://www.rcmscrapmetal.com/images/blog/1718919338blog-24-06-20.jpg",
      link: "/Collection",
    },
    {
      title: "Community Cleanup",
      desc: "Organized community programs to promote environmental responsibility.",
      img: "https://img.freepik.com/free-photo/high-angle-living-room-interior-design_23-2149647173.jpg",
      link: "/community-cleanup",
    },
    {
      title: "Material Marketplace",
      desc: "Buy and sell recyclable materials with transparent pricing.",
      img: "https://www.ohra.net/fileadmin/_processed_/7/f/csm_kragarmregal_alu12_b0ab15b121.jpg",
      link: "/ItemMarkert",
    },
    {
      title: "Buy & Sell Aluminum",
      desc: "Direct trading platform for aluminum scraps and processed materials.",
      img: "https://www.musgroves.co.nz/wp-content/uploads/2020/04/how-to-repair-aluminium-window-frames-retina-1.jpg",
      link: "/BuyandSell",
    },
    {
      title: "Industrial Projects",
      desc: "Support for industrial recycling and large-scale sustainability projects.",
      img: "https://pbs.twimg.com/media/FfCEKerXEAA6dOV?format=jpg&name=large",
      link: "/Project",
    },
    {
      title: "Training & Registration",
      desc: "Skill development and registration programs for recycling professionals.",
      img: "https://www.alideck.co.uk/wp-content/uploads/2020/08/AliDeck-Non-Combustible-Aluminium-Metal-Balcony-Decking-Rochester-Training-Academy-013.jpg",
      link: "/AluTReg",
    },
  ];

  return (
    <div className="Ser-root">
      <section className="Ser-hero">
        <div className="Ser-hero-overlay"></div>
        <div className="Ser-hero-content">
          <h1>Our Services</h1>
        </div>
      </section>

      <section className="Ser-services">
        <div className="Ser-masonry-grid">
          {services.map((service, index) => (
            <div className={`Ser-masonry-card card-${index + 1}`} key={index}>
              <div
                className="Ser-masonry-image"
                style={{ backgroundImage: `url(${service.img})` }}
              ></div>

              <div className="Ser-masonry-content">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <a href={service.link} className="Ser-card-btn">
                  Explore Service
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="Ser-App-hero">
        <div className="Ser-App-hero-overlay"></div>

        <div className="Ser-App-hero-content">
          <span className="Ser-App-hero-tag">DOWNLOAD APP</span>
          <h1>Download Meta Trade app</h1>

          <div className="Ser-App-hero-buttons">
            <button className="Ser-App-btn apple">Get in App Store</button>
            <button className="Ser-App-btn google">Google Play</button>
          </div>
        </div>

        <div className="Ser-App-hero-image"
         style={{ backgroundImage: `url('https://www.alimax.ltd/files/thumbs/Aluminium_window_faqs_w1920_h525.jpg')` }}></div>
      </section>
      </div>
    
  );
}

export default ServiceMain;