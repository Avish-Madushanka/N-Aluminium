import React from "react";
import { Link } from "react-router-dom";
import "./ServiceMain.css";

function ServiceMain() {
  const services = [
    {
      title: "Waste Collection",
      desc: "Door-to-door aluminum and recyclable waste collection with scheduled pickups.",
      img: "https://www.rcmscrapmetal.com/images/blog/1718919338blog-24-06-20.jpg",
      link: "/Collection",
      theme: "ser-theme-green"
    },
    {
      title: "Community Cleanup",
      desc: "Organized community programs to promote environmental responsibility.",
      img: "https://img.freepik.com/free-photo/high-angle-living-room-interior-design_23-2149647173.jpg",
      link: "/community-cleanup",
      theme: "ser-theme-grey"
    },
    {
      title: "Material Marketplace",
      desc: "Buy and sell recyclable materials with transparent pricing.",
      img: "https://www.ohra.net/fileadmin/_processed_/7/f/csm_kragarmregal_alu12_b0ab15b121.jpg",
      link: "/ItemMarkert",
      theme: "ser-theme-navy"
    },
    {
      title: "Training & Registration",
      desc: "Skill development and registration programs for recycling professionals.",
      img: "https://www.alideck.co.uk/wp-content/uploads/2020/08/AliDeck-Non-Combustible-Aluminium-Metal-Balcony-Decking-Rochester-Training-Academy-013.jpg",
      link: "/AluTReg",
      theme: "ser-theme-red"
    },
    {
      title: "Industrial Projects",
      desc: "Support for industrial recycling and large-scale sustainability projects.",
      img: "https://pbs.twimg.com/media/FfCEKerXEAA6dOV?format=jpg&name=large",
      link: "/Project",
      theme: "ser-theme-navy"
    },
    {
      title: "Buy & Sell Aluminum",
      desc: "Direct trading platform for aluminum scraps and processed materials.",
      img: "https://www.musgroves.co.nz/wp-content/uploads/2020/04/how-to-repair-aluminium-window-frames-retina-1.jpg",
      link: "/BuyandSell",
      theme: "ser-theme-green"
    },
  ];

  return (
    <div className="Ser-root">
      <section className="Ser-hero">
        <div className="Ser-hero-overlay"></div>
        <div className="Ser-hero-content">
          <h1>OUR SERVICES</h1>
        </div>
      </section>

      <section className="Ser-services-section">
        <div className="Ser-uniform-grid">
          {services.map((service, index) => (
            <div className={`Ser-adv-card ${service.theme}`} key={index}>
              <div className="Ser-adv-content">
                <h3 className="Ser-adv-card-title">{service.title}</h3>
                <p className="Ser-adv-card-text">{service.desc}</p>
              </div>
              <div className="Ser-adv-img-box">
                <img src={service.img} alt={service.title} />
                <div className="Ser-adv-hover-overlay">
                  <Link to={service.link} className="Ser-adv-inner-btn">
                    EXPLORE SERVICE
                  </Link>
                </div>
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
          style={{ backgroundImage: `url('https://www.alimax.ltd/files/thumbs/Aluminium_window_faqs_w1920_h525.jpg')` }}>
        </div>
      </section>
    </div>
  );
}

export default ServiceMain;