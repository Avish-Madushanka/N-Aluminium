import React from 'react';
import './BOwnerBody.css';

const BOCard = ({ imageUrl, title, description }) => {
  return (
    <div className="BO-card">
      <img src={imageUrl} alt={title} className="BO-card-image" />
      <div className="BO-card-content">
        <h2 className="BO-card-title">{title}</h2>
        <p className="BO-card-description">{description}</p>
        <button className="BO-card-button">View More...</button>
      </div>
    </div>
  );
};

const BOwnerBody = () => {
  const cardData = [
    {
      imageUrl: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      title: "DOORS Doors",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable and modern-looking.",
    },
    {
      imageUrl: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      title: "DOORS Doors",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable and modern-looking.",
    },
    {
      imageUrl: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      title: "DOORS Doors",
      description: "An aluminum door is strong, lightweight, weather-resistant, durable and modern-looking.",
    },
  ];

  return (
    <div className="BO-container">
      {cardData.map((card, index) => (
        <BOCard
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
