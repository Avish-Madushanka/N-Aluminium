import React from 'react';
import './ServiceMain.css';

const ServiceMain = () => {
  const servicesData = [
    {
      imageUrl: "https://www.sjcfl.us/wp-content/uploads/2024/07/recycling-truck-1024x684.png",
      title: "Our Service",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable, nce, and modern-looking. An aluminum door is strong, lightweight, weather-resistant",
    },
    {
      imageUrl: "https://img.freepik.com/premium-vector/businessman-hold-buy-sell-signs_140689-4467.jpg",
      title: "Our Service",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable, nce, and modern-looking. An aluminum door is strong, lightweight, weather-resistant",
    },
    {
      imageUrl: "https://qph.cf2.quoracdn.net/main-qimg-c9d420c785f4e90372abc836d2ac8f45-lq",
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