import React from "react";
import "./WasteMain.css";

const WasteMain = () => {
  const imageUrlSell =
    "https://ewasa.org/wp-content/uploads/2022/12/post-scrap-metal-export-prohibition-1024x576.png";
  const imageUrlBuy =
    "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iBHFOg_qyaAU/v1/-1x-1.webp";

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
                Metal Source is a buyer of all scrap metal grades including
                aluminum, steel, copper, stainless, and all ferrous and nonferrous
                metals.
                </p>
                <a href="/WastePickForm" className="waste-learn-more">→</a>
            </div>
            </div>

            <div className="waste-card">
            <img src={imageUrlBuy} alt="Buy From Us" className="waste-card-image" />
            <div className="waste-card-content">
                <h3 className="waste-card-title">Buy From Us</h3>
                <p className="waste-card-description">
                Contact our Commercial Team for your ferrous and nonferrous
                recycled metal requirements, and we can assist you in obtaining
                the metal you need.
                </p>
                <a href="#" className="waste-learn-more">→</a>
            </div>
            </div>
            </div>
        </div>
    </div>
  );
};

export default WasteMain;
