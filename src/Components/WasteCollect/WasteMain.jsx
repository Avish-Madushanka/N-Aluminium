import React from 'react';
import './WasteMain.css';

function WasteMain() {
    const imageUrlSell = "https://salvage.jksalvageco.com/wp-content/uploads/2021/06/image-1.jpg";
    const imageUrlBuy = "https://t4.ftcdn.net/jpg/09/48/95/49/360_F_948954917_QggcaJkTcmvaxNlK5nU2cZjfS7NRxBlD.jpg"; 

    return (
        <div className="Wrecycling-section">
            <div className="Wheader-content">
                <div className="Wmain-heading">Industry Leader in Scrap Metal Recycling & Raw Material Conversion</div>
                <div className="Wdescription">Metal Source strives to have the very best processes, technology, and operations to convert raw materials into renewable and reusable resources for the sustainable future and to the continual improvement of social, economic, and environmental well-being of the global community.</div>
            </div>

            <div className="Wcard-container">
                <div className="Wcard">
                    <img src={imageUrlSell} alt="Sell to Us" className="Wcard-image" />
                    <div className="Wcard-content">
                        <h3 className="Wcard-title">Sell to Us</h3>
                        <p className="Wcard-description">Metal Source is a buyer of all scrap metal grades including aluminum, steel, copper, stainless, and all ferrous and nonferrous metals.</p>
                        <a href="/WastePickForm" className="Wlearn-more">→</a>
                    </div>
                </div>

                <div className="Wcard">
                    <img src={imageUrlBuy} alt="Buy From Us" className="Wcard-image" />
                    <div className="Wcard-content">
                        <h3 className="Wcard-title">Buy From Us</h3>
                        <p className="Wcard-description">Contact our Commercial Team for your ferrous and nonferrous recycled metal requirements, and we can assist you in obtaining the metal you need.</p>
                        <a href="#" className="Wlearn-more">→</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WasteMain;