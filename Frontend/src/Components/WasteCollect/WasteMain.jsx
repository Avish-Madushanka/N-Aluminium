import React, { useState } from "react";
import "./WasteMain.css";

const WasteMain = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const imageUrlSell =
    "https://ewasa.org/wp-content/uploads/2022/12/post-scrap-metal-export-prohibition-1024x576.png";
  const imageUrlValue =
    "https://bsmedia.business-standard.com/_media/bs/img/article/2016-12/12/full/1481562212-9804.jpg?im=FeatureCrop,size=(826,465)";

  return (
    <div className="Wrecycling-section">
      <section className="waste-management-section">
        <div className="container">
          <h2 className="section-title">Why choose waste management?</h2>
          <p className="section-description">
            If you are creative, then you never refuse reuse. I love woody trash
            because I use it. Recycling is a saving of money. Don't say sorry
            for recycling. Never kick recycling in life. Reuse, recycle is not
            bullshit. Recycling the environment is our biggest dream. Stop
            chasing waste your material. Far away to be trashy.
          </p>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon electro">
                <img
                  src="https://via.placeholder.com/30x30?text=E"
                  alt="Electronic Waste Icon"
                />
              </div>
              <h3>Electronic waste</h3>
              <p>
                First, you stand for recycling than your family also help. Be
                aware of your family.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon demo">
                <img
                  src="https://via.placeholder.com/30x30?text=D"
                  alt="Demolition Icon"
                />
              </div>
              <h3>Demolition</h3>
              <p>
                First, you stand for recycling than your family also help. Be
                aware of your family.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon recovery">
                <img
                  src="https://via.placeholder.com/30x30?text=R"
                  alt="Recovery Icon"
                />
              </div>
              <h3>Recovery</h3>
              <p>
                First, you stand for recycling than your family also help. Be
                aware of your family.
              </p>
            </div>
          </div>

          <div className="content-and-accordion-grid">
            <div className="image-container">
              <img
                src="https://www.steelradar.com/i/l/011/0118089_glencore-to-take-role-in-aluminium-scrap-recycling.jpeg"
                alt="Waste Management"
              />
            </div>

            <div className="accordion-section">
              <div
                className={`accordion-item ${
                  openAccordion === 0 ? "active" : ""
                }`}
              >
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion(0)}
                >
                  Why is waste management so important?
                  <span className="accordion-toggle-icon">
                    {openAccordion === 0 ? "−" : "+"}
                  </span>
                </button>
                {openAccordion === 0 && (
                  <div className="accordion-content">
                    <p>
                      Waste management is crucial for environmental protection,
                      resource conservation, public health, and sustainable
                      development. Proper management prevents pollution and
                      promotes recycling.
                    </p>
                  </div>
                )}
              </div>

              <div
                className={`accordion-item ${
                  openAccordion === 1 ? "active" : ""
                }`}
              >
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion(1)}
                >
                  How can waste management be improved?
                  <span className="accordion-toggle-icon">
                    {openAccordion === 1 ? "−" : "+"}
                  </span>
                </button>
                {openAccordion === 1 && (
                  <div className="accordion-content">
                    <p>
                      In order to make your waste management processes even more
                      efficient, try to reuse your old cardboard boxes to store
                      things instead of disposing them into the garbage.
                    </p>
                  </div>
                )}
              </div>

              <div
                className={`accordion-item ${
                  openAccordion === 2 ? "active" : ""
                }`}
              >
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion(2)}
                >
                  How to improve your Waste Management at Home?
                  <span className="accordion-toggle-icon">
                    {openAccordion === 2 ? "−" : "+"}
                  </span>
                </button>
                {openAccordion === 2 && (
                  <div className="accordion-content">
                    <p>
                      At home, you can improve waste management by practicing
                      the 3 R's: Reduce, Reuse, Recycle. Separate your waste,
                      compost organic materials, and avoid single-use plastics.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      <div className="waste-section">
        <div className="waste-card-container">
          <div className="waste-card">
            <img
              src={imageUrlSell}
              alt="Sell to Us"
              className="waste-card-image"
            />
            <div className="waste-card-content">
              <h3 className="waste-card-title">Sell to Us</h3>
              <p className="waste-card-description">
                Metal Source is a buyer of all scrap metal grades including
                aluminum, steel, copper, stainless, and all ferrous and
                nonferrous metals, offering competitive prices and reliable
                service.
              </p>
              <a href="/UserCalendar" className="waste-learn-more">
                →
              </a>
            </div>
          </div>

          <div className="waste-card">
            <img
              src={imageUrlValue}
              alt="Scrap Value"
              className="waste-card-image"
            />
            <div className="waste-card-content">
              <h3 className="waste-card-title">Know Your Scrap Value</h3>
              <p className="waste-card-description">
                Know your scrap value in seconds. Enter the weight, get an
                instant estimate, and see how much cash you’ll earn for
                recycling your aluminum. It’s fast, accurate, and helps the
                planet too!
              </p>
              <a href="/Calculate" className="waste-learn-more">
                →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteMain;
