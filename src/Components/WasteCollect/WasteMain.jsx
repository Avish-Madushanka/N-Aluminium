import React from "react";
import "./WasteMain.css";

const WasteMain = () => {
  const imageUrlSell =
    "https://ewasa.org/wp-content/uploads/2022/12/post-scrap-metal-export-prohibition-1024x576.png";
  const imageUrlValue =
    "https://bsmedia.business-standard.com/_media/bs/img/article/2016-12/12/full/1481562212-9804.jpg?im=FeatureCrop,size=(826,465)";

  return (
    <div className="Wrecycling-section">
        <div className="Wheader-content">
            <div className="Wmain-heading">Industry Leader in Scrap Metal Recycling & Raw Material Conversion</div>
            <div className="Wdescription">Metal Source strives to have the very best processes, technology, and operations to convert raw materials into renewable and reusable resources for the sustainable future and to the continual improvement of social, economic, and environmental well-being of the global community.</div>
        </div>

        <div className="waste-section">
        <div className="waste-card-container">
            <div className="waste-card">
            <img src={imageUrlSell} alt="Sell to Us" className="waste-card-image" />
            <div className="waste-card-content">
                <h3 className="waste-card-title">Sell to Us</h3>
                <p className="waste-card-description">
                Metal Source is a buyer of all scrap metal grades including aluminum, steel, copper, stainless, and all ferrous and nonferrous metals, offering competitive prices and reliable service.
                </p>
                <a href="/UserCalendar" className="waste-learn-more">→</a>
            </div>
            </div>

            <div className="waste-card">
            <img src={imageUrlValue} alt="Scrap Value" className="waste-card-image" />
            <div className="waste-card-content">
                <h3 className="waste-card-title">Know Your Scrap Value</h3>
                <p className="waste-card-description">
                Know your scrap value in seconds. Enter the weight, get an instant estimate, and see how much cash you’ll earn for recycling your aluminum. It’s fast, accurate, and helps the planet too!
                </p>
                <a href="/Calculate" className="waste-learn-more">→</a>
            </div>
            </div>
            </div>
        </div>
    </div>
  );
};

export default WasteMain;
