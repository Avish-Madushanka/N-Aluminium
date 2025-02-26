import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceMain.css';

const ServiceMain = () => {
  const servicesData = [
    {
      imageUrl: "https://willoughbyohio.com/wp-content/uploads/2019/08/refuse.jpg",
      title: "Recycling Service",
      description: "We offer efficient aluminum recycling to reduce waste and promote sustainability.",
      buttons: [
        { text: "Get Tips", link: "/Collection" }
      ]
    },
    {
      imageUrl: "https://www.shutterstock.com/image-illustration/buy-sell-gold-stock-market-600nw-2394746603.jpg",
      title: "Buy & Sell Scrap",
      description: "Connect with aluminum businesses to buy and sell scrap materials easily.",
      buttons: [
        { text: "Sell Your Scrap", link: "/BuyandSell" }
      ]
    },
    {
      imageUrl: "https://www.bifoldingdoorssussex.co.uk/wp-content/uploads/2020/06/2389a06_50P-01.jpg",
      title: "Aluminum Products",
      description: "Browse high-quality aluminum products for construction and industrial use.",
      buttons: [
        { text: "Get a Sample", link: "/Project" }
      ]
    },
  ];

  return (
    <div className="serviceX-container">
      <div className="serviceX-header">
        <h1 className="serviceX-title">Our Services</h1>
      </div>

      <div className="serviceX-list">
        {servicesData.map((service, index) => (
          <div className="serviceX-card" key={index}>
            <div className="imageX-side">
              <img src={service.imageUrl} alt={service.title} className="serviceX-image" />
            </div>
            <div className="contentX-side">
              <h2 className="cardX-title">{service.title}</h2>
              <p className="cardX-description">{service.description}</p>
              <div className="cardX-buttons">
                {service.buttons.map((button, btnIndex) => (
                  <Link to={button.link} key={btnIndex} className="cardX-button">
                    {button.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceMain;
