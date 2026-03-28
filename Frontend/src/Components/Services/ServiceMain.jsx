import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import "./ServiceMain.css";

import Img1 from '../../assets/s1.jpg';
import Img2 from '../../assets/s2.jpg';
import Img3 from '../../assets/s3.jpg';
import Img4 from '../../assets/s4.jpg';
import Img5 from '../../assets/s5.jpg';
import Img6 from '../../assets/s6.jpg';

function ServiceMain() {
  const services = [
    {
      title: "Scrap Collection",
      desc: "Easy scheduling for aluminum scrap pickup from homes and businesses.",
      img: Img1,
      link: "/Collection",
    },
    {
      title: "Training Programme",
      desc: "Training programs for aluminum fabrication and recycling skills.",
      img: Img2,
      link: "/AluTReg",
    },
    {
      title: "Material Marketplace",
      desc: "Smart marketplace for trading aluminum materials quickly and efficiently.",
      img: Img3,
      link: "/ItemMarkert",
    },
    {
      title: "test",
      desc: "Support for industrial and personal aluminum fabrication projects.",
      img: Img4,
      link: "/Pro",
    },
    {
      title: "Aluminum Fabrication",
      desc: "Custom aluminum fabrication with strength, quality, and precision.",
      img: Img5,
      link: "/Project",
    },
    {
      title: "Buy & Sell Aluminum",
      desc: "Buy and sell aluminum materials easily with secure transactions.",
      img: Img6,
      link: "/BuyandSell",
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

      <div className="Ser-intro-section">
        <div className="Ser-intro-header">
          <span className="Ser-intro-tag">OUR SERVICES</span>
          <h2 className="Ser-intro-title">
            Smart Aluminum Services <br /> For Fabrication & Trade
          </h2>
          <p className="Ser-intro-sub">
            We provide complete aluminum solutions including fabrication, scrap collection, and a digital marketplace to support efficient and sustainable resource management.
          </p>
        </div>
      </div>

      <section className="Ser-services-section">
        <div className="Ser-uniform-grid">
          {services.map((service, index) => (
            <div className="Ser-img-card" key={index}>
              <div className="Ser-card-image-box">
                <img src={service.img} alt={service.title} />
              </div>

              <div className="Ser-card-info-overlay">
                <h3 className="Ser-card-title">{service.title}</h3>
                <p className="Ser-card-text">{service.desc}</p>
                <Link to={service.link} className="Ser-read-more-btn">
                  Read More
                  <span className="Ser-btn-icon">
                    <ArrowRight size={16} />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="Ser-why-us-minimal">
        <div className="Ser-why-content">
          <h2 className="Ser-why-main-title">WHY CHOOSE US?</h2>
          <p className="Ser-why-main-sub">
            We combine modern fabrication technology, smart systems, and sustainable practices to deliver high-quality aluminum solutions.
          </p>

          <div className="Ser-why-feature-grid">
            <div className="Ser-feature-box">
              <img src="https://cdn-icons-png.flaticon.com/128/8273/8273233.png" alt="" className="Ser-feature-icon" />
              <h3>High Durability</h3>
              <p>Strong and reliable aluminum products designed for long-term performance, offering resistance to corrosion and harsh weather.</p>
            </div>

            <div className="Ser-feature-box">
              <img src="https://cdn-icons-png.flaticon.com/128/17237/17237410.png" alt="" className="Ser-feature-icon" />
              <h3>Precision Fabrication</h3>
              <p>We use advanced fabrication techniques and modern tools to deliver accurate, high-quality aluminum designs and perfect finishing.</p>
            </div>

            <div className="Ser-feature-box">
              <img src="https://cdn-icons-png.flaticon.com/128/12491/12491375.png" alt="" className="Ser-feature-icon" />
              <h3>Smart & Sustainable</h3>
              <p>Our platform combines smart technology with eco-friendly practices to optimize aluminum usage and support recycling.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="Ser-benefits-dark">
        <div className="Ser-ben-header">
          <span className="Ser-ben-tag">USER ADVANTAGES</span>
          <h2 className="Ser-ben-title">BENEFITS OF ALUMINUM REFERENCE</h2>
        </div>

        <div className="Ser-ben-container">
          <div className="Ser-ben-side-left">
            <div className="Ser-ben-item">
              <div className="Ser-ben-text">
                <h3>Save Time</h3>
                <p>Streamlined fabrication orders and instant scrap pickup scheduling for maximum efficiency.</p>
              </div>
              <div className="Ser-ben-num">01</div>
              <div className="Ser-ben-line-left">
                <span className="dot-outer"></span>
                <span className="dot-inner"></span>
              </div>
            </div>

            <div className="Ser-ben-item">
              <div className="Ser-ben-text">
                <h3>Earn Money</h3>
                <p>Get the best market value for your aluminum scrap with real-time pricing and direct trade.</p>
              </div>
              <div className="Ser-ben-num">02</div>
              <div className="Ser-ben-line-left">
                <span className="dot-outer"></span>
                <span className="dot-inner"></span>
              </div>
            </div>
          </div>

          <div className="Ser-ben-center">
            <div className="Ser-ben-circle">
              <div className="Ser-ben-circle-inner">
                 <img src="https://media.licdn.com/dms/image/sync/v2/D4E27AQF2NRPuiM1WkQ/articleshare-shrink_800/B4EZmf5tZBHMAM-/0/1759324330078?e=2147483647&v=beta&t=2glp8IupJWX6x9b5S2sWzL81XTbeAM2IiCw8xnS5mTs" alt="Aluminum Reference" />
              </div>
            </div>
          </div>

          <div className="Ser-ben-side-right">
            <div className="Ser-ben-item">
              <div className="Ser-ben-line-right">
                <span className="dot-outer"></span>
                <span className="dot-inner"></span>
              </div>
              <div className="Ser-ben-num">03</div>
              <div className="Ser-ben-text">
                <h3>Reduce Waste</h3>
                <p>Transforming old aluminum into high-quality reusable materials through circular logistics.</p>
              </div>
            </div>

            <div className="Ser-ben-item">
              <div className="Ser-ben-line-right">
                <span className="dot-outer"></span>
                <span className="dot-inner"></span>
              </div>
              <div className="Ser-ben-num">04</div>
              <div className="Ser-ben-text">
                <h3>Support Sustainability</h3>
                <p>Join our mission to protect the environment by recycling aluminum and reducing carbon footprint.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="Ser-cta-section">
        <div className="Ser-cta-overlay"></div>
        <div className="Ser-cta-content">
          <h2 className="Ser-cta-title">Premium Aluminum Fabrication Services</h2>
          <p className="Ser-cta-text">
            Experience top-quality <strong>aluminum fabrication</strong> with precision craftsmanship, 
            durable materials, and expert solutions tailored to your residential and commercial needs.
          </p>
          <div className="Ser-cta-btns">
            <Link to="/Project" className="Ser-cta-btn-primary">Get Started Now</Link>
            <Link to="/Proreq" className="Ser-cta-btn-secondary">Request Service</Link>
          </div>
          <div className="Ser-cta-trust">
            <span><img src="https://cdn-icons-png.flaticon.com/128/16484/16484401.png" alt="check" width="16" height="16" className="Ser-cta-icon" /> Expert Craftsmanship</span>
            <span><img src="https://cdn-icons-png.flaticon.com/128/18445/18445183.png" alt="check" width="16" height="16" className="Ser-cta-icon" /> Premium Quality</span>
            <span><img src="https://cdn-icons-png.flaticon.com/128/16500/16500445.png" alt="check" width="16" height="16" className="Ser-cta-icon" /> Custom Solutions</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServiceMain;