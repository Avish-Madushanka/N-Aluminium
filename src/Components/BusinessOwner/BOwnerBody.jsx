import React from 'react';
import './BOwnerBody.css';

const Card = ({ imageUrl, title, description }) => {
  return (
    <div className="card">
      <img src={imageUrl} alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
        <button className="card-button">Button</button>
      </div>
    </div>
  );
};

const BOwnerBody = () => {
  const cardData = [
    {
      imageUrl: "https://via.placeholder.com/400x250/3498db/fff",
      title: "DOORS Doors",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable and modern-looking.",
    },
    {
      imageUrl: "https://via.placeholder.com/400x250/e74c3c/fff",
      title: "DOORS Doors",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable and modern-looking.",
    },
    {
      imageUrl: "https://via.placeholder.com/400x250/2ecc71/fff",
      title: "DOORS Doors",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable and modern-looking.",
    },
  ];

  return (
    <div className="card-container">
      {cardData.map((card, index) => (
        <Card
          key={index}
          imageUrl={card.imageUrl}
          title={card.title}
          description={card.description}
        />
      ))}
    </div>
  );
};

export default BOwnerBody;