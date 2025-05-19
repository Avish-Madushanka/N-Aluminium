import React from 'react';
import { Link } from 'react-router-dom';
import './BOwnerBody.css';

const BOCard = ({ imageUrl, title, description, button }) => {
  return (
    <div className="BO-card">
      <img src={imageUrl} alt={title} className="BO-card-image" />
      <div className="BO-card-content">
        <h2 className="BO-card-title">{title}</h2>
        <p className="BO-card-description">{description}</p>
        
        <Link to={button} className="BO-card-button">
          View More
        </Link>
      </div>
    </div>
  );
};

const BOwnerBody = () => {
  const cardData = [
    {
      imageUrl: "https://images.jdmagicbox.com/quickquotes/images_main/2160mm-height-aluminium-door-2217860786-443b5uch.jpg",
      title: "Projects",
      description: "Innovative aluminum design—strong, sleek, and built for the future!",
      button: "/Project",
    },
    {
      imageUrl: "https://www.gettheedgeuk.co.uk/wp-content/uploads/capitalism-sign-buy-and-sell-buying-selling-marketplace-symbolism_4diueg65e__F0000.png",
      title: "Buy Reuse Items",
      description: "Buy smart, sell fast—maximize your profits with the best deals at the right time!",
      button: "/BuyandSell",
    },
    {
      imageUrl: "https://storage.googleapis.com/mgcpleagcspub1/Industrial-Scrap-1080x750.jpg",
      title: "Pickup Scraps details",
      description: "Here you can view all the details of your scheduled scrap pickups, including dates, and materials.",
      button: "/doors",
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
          button={card.button}
        />
      ))}
    </div>
  );
};

export default BOwnerBody;
