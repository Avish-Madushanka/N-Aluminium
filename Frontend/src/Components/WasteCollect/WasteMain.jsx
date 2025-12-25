import React, { useState } from "react";
import "./WasteMain.css";
import { Link } from "react-router-dom";

const WasteMain = () => {

  const categories = [
        { name: 'Aluminum Scraps', imgSrc: 'https://media.istockphoto.com/id/645897288/photo/abtract-of-metal-scrap.jpg?s=612x612&w=0&k=20&c=LVynqe8WK5q7m1YL2ldXcy44qjRrY3RyD-solAxi-Lc=' },
        { name: 'Aluminum Wires', imgSrc: 'https://africangoldcompanygroup.com/wp-content/uploads/2023/11/557513186601830.jpg' },
        { name: 'Aluminum Cans', imgSrc: 'https://speed-tradespzoo.com/wp-content/uploads/2022/11/F_20150217155954zJ5cEe.jpg' },
        { name: 'Aluminum Dust', imgSrc: 'https://previews.123rf.com/images/faruki2017/faruki20171702/faruki2017170200190/71630074-iron-dust-aluminum-dust.jpg' },  
        { name: 'Cradding Boards', imgSrc: 'https://i.ytimg.com/vi/S7O8WJ2BFWY/maxresdefault.jpg' },
        { name: 'Glass Scraps', imgSrc: 'https://agecko.com/wp-content/uploads/2025/01/types-of-glass-recycling-window-panes.webp' },
        { name: 'Aluminum Sheets', imgSrc: 'https://5.imimg.com/data5/SELLER/Default/2024/11/466263246/RB/WO/HL/155423973/coated-aluminum-scrap.jpg' },
      
      ];

      
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const imageUrlSell =
    "https://westchicago.org/wp-content/uploads/2022/12/Garbage-Pickup-02.png";
  const imageUrlSell1 =
    "https://www.newswire.lk/wp-content/uploads/2023/12/US-Dollar-1.jpg";

  return (

    
    <div className="Co-recycling-section">
      <section className="Co-waste-management-section">

        <div className="WS2-container">
            <div className="WS2-left-section">
                <div className="WS2-image-container">
                    <img src="https://www.cliftonmetals.com/wp-content/uploads/2024/07/A-Guide-to-Choosing-a-Responsible-Scrap-Metal-Recycler-Clifton-Metals-Blog-632x764.jpg" className="WS2-wall-image" />
                </div>
            </div>
            <div className="WS2-right-section">
                <h1 className="WS2-main-heading">Why Should Aluminum Scraps Be Managed?</h1>
                <p className="WS2-description">
                     Effective aluminum scrap management is crucial for environmental protection and economic growth. Since aluminum can be recycled repeatedly without losing quality, proper collection prevents valuable material from ending up in landfills. Recycling saves up to 95% of the energy used in primary production and significantly reduces emissions. Efficient scrap systems support local industries, create jobs, and promote a circular economy where resources are reused, helping build a cleaner and more sustainable future.
                </p>

                <div className="Co-accordion-section">
              <div
                className={`Co-accordion-item ${
                  openAccordion === 0 ? "active" : ""
                }`}
              >
                <button
                  className="Co-accordion-header"
                  onClick={() => toggleAccordion(0)}
                >
                  How does aluminum scrap collection work?
                  <span className="Co-accordion-toggle-icon">
                    {openAccordion === 0 ? "−" : "+"}
                  </span>
                </button>
                {openAccordion === 0 && (
                  <div className="Co-accordion-content">
                    <p>
                     Users can schedule a pickup through our system. Our team collects aluminum waste from your location, sorts it at recycling centers, and processes it for reuse in new products.
                    </p>
                  </div>
                )}
              </div>

              <div
                className={`Co-accordion-item ${
                  openAccordion === 1 ? "active" : ""
                }`}
              >
                <button
                  className="Co-accordion-header"
                  onClick={() => toggleAccordion(1)}
                >
                  How can I earn from aluminum scraps?
                  <span className="Co-accordion-toggle-icon">
                    {openAccordion === 1 ? "−" : "+"}
                  </span>
                </button>
                {openAccordion === 1 && (
                  <div className="Co-accordion-content">
                    <p>
                     You can earn money by selling your aluminum waste through our platform. The system provides real-time scrap value updates, so you get the best price for your collected items.
                    </p>
                  </div>
                )}
              </div>

              <div
                className={`Co-accordion-item ${
                  openAccordion === 3 ? "active" : ""
                }`}
              >
                <button
                  className="Co-accordion-header"
                  onClick={() => toggleAccordion(3)}
                >
                  Environmental benefits of recycling aluminum?
                  <span className="Co-accordion-toggle-icon">
                    {openAccordion === 3 ? "−" : "+"}
                  </span>
                </button>
                {openAccordion === 3 && (
                  <div className="Co-accordion-content">
                    <p>
                     Recycling aluminum saves up to 95% of the energy required to produce new aluminum from raw materials. It also reduces greenhouse gas emissions, conserves natural resources, and minimizes landfill waste—making it a key step toward a cleaner, more sustainable planet.
                    </p>
                  </div>
                )}
              </div>
            </div>
            </div>
        </div>

        <div className="WS3-category-section">
            <h2 className="WS3-title">What We Collect</h2>
            <div className="WS3-category-container">
                {categories.map((category, index) => (
                    <div key={index} className="WS3-category-item">
                        <img src={category.imgSrc} alt={category.name} className="WS3-category-image" />
                        <p className="WS3-category-name">{category.name}</p>
                    </div>
                ))}
            </div>
        </div>
        </section>

        <section className="scrap-info-section">
            <div className="WS4-container">
              <div className="WS4-section WS4-m">
                <div className="WS4-content">
                  <h2 className="WS4-title">
                    <span className="WS4-highlight-blue">Sell</span> to Us
                  </h2>
                  <p className="WS4-subtitle">
                    Metal Source is a buyer of all scrap metal grades including aluminum,
                    steel, copper, stainless, and all ferrous and nonferrous metals,
                    offering competitive prices and reliable service.
                  </p>
                  <br /><br />
                  <Link to="/UserCalendar" className="WS4-button WS4-button-2">
                    Pickup Request
                  </Link>
                </div>
              </div>

              <div className="WS4-section WS4-w">
                <div className="WS4-content">
                  <h2 className="WS4-title">
                    Know Your<br />
                    <span className="WS4-highlight-pink">Scrap Value</span>
                  </h2>
                  <p className="WS4-subtitle">
                    Know your scrap value in seconds. Enter the weight, get an instant
                    estimate, and see how much cash you’ll earn for recycling your
                    aluminum. It’s fast, accurate, and helps the planet too!
                  </p>
                  <Link to="/Calculate" className="WS4-button WS4-button-2">
                    Check Scraps Values
                  </Link>
                </div>
              </div>
            </div>

         </section>
        </div>
          );
        };

export default WasteMain;
