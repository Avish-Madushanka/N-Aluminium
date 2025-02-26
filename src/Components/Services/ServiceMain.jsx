import React from 'react';
import './ServiceMain.css';

const ServiceMain = () => {
  const servicesData = [
    {
      imageUrl: "https://willoughbyohio.com/wp-content/uploads/2019/08/refuse.jpg",
      title: "Our Service",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable, nce, and modern-looking. An aluminum door is strong, lightweight, weather-resistant",
    },
    {
      imageUrl: "https://www.shutterstock.com/image-illustration/buy-sell-gold-stock-market-600nw-2394746603.jpg",
      title: "Our Service",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable, nce, and modern-looking. An aluminum door is strong, lightweight, weather-resistant",
    },
    {
      imageUrl: "https://www.bifoldingdoorssussex.co.uk/wp-content/uploads/2020/06/2389a06_50P-01.jpg",
      title: "Our Service",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable, nce, and modern-looking. An aluminum door is strong, lightweight, weather-resistant",
    },
  ];

  return (
    <div className="serviceX-container">
      <div className="serviceX-header">
        <h1 className="serviceX-title">Our Service</h1>
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
              <button className="cardX-button">Button 1</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceMain;