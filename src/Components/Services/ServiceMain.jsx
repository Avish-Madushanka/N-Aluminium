import React from 'react';
import './ServiceMain.css';

const ServiceMain = () => {
  const servicesData = [
    {
      imageUrl: "https://i.imgur.com/p0p3zZ6.jpg",
      title: "Our Service",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable, nce, and modern-looking. An aluminum door is strong, lightweight, weather-resistant",
    },
    {
      imageUrl: "https://i.imgur.com/p0p3zZ6.jpg",
      title: "Our Service",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable, nce, and modern-looking. An aluminum door is strong, lightweight, weather-resistant",
    },
    {
      imageUrl: "https://i.imgur.com/p0p3zZ6.jpg",
      title: "Our Service",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable, nce, and modern-looking. An aluminum door is strong, lightweight, weather-resistant",
    },
  ];

  return (
    <div className="service-container">
      <div className="service-header">
        <h1 className="service-title">Our Service</h1>
      </div>

      <div className="service-list">
        {servicesData.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="image-side">
              <img src={service.imageUrl} alt={service.title} className="service-image" />
            </div>
            <div className="content-side">
              <h2 className="card-title">{service.title}</h2>
              <p className="card-description">{service.description}</p>
              <button className="card-button">Button 1</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceMain;