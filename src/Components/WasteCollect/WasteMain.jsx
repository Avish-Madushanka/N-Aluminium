import React from 'react';
import './WasteMain.css';

function WasteMain() {
    const imageUrlSell = "https://images.unsplash.com/photo-1587339404866-ef0484c240c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHNjcmFwJTIwbWV0YWx8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60";
    const imageUrlBuy = "https://images.unsplash.com/photo-1584272955353-56f991b5d8f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c2NyYXAlMjBtZXRhbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"; 

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
                        <a href="#" className="Wlearn-more">→</a>
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