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