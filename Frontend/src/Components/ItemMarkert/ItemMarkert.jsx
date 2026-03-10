import React from 'react';
import './ItemMarkert.css';
import box from "../../assets/box.png";
import l from "../../assets/l.png";
import u from "../../assets/u.png";
import j from "../../assets/j.png";
import rivert from "../../assets/rivert.png";
import cut from "../../assets/cut.png";
import grill from "../../assets/grill.png";
import knife from "../../assets/knife.png";
import Rmac from "../../assets/Rmac.png";
import sivilim from "../../assets/sivilim.png";
import glass from "../../assets/glass.png";

const ItemMarkert = () => {
  return (
    <div className="ItemMAR-container">
      <header className="ItemMAR-header">
        <nav className="ItemMAR-topNav">
          <ul className="ItemMAR-navList">
            <li className="ItemMAR-navItem">Delivery Type</li>
            <li className="ItemMAR-navItem">All Promotions</li>
            <li className="ItemMAR-navItem">Keells Products</li>
            <li className="ItemMAR-navItem">Keells Exclusives</li>
            <li className="ItemMAR-navItem">Utility Bill</li>
            <li className="ItemMAR-navItem">Keells News</li>
            <li className="ItemMAR-navItem">Community</li>
            <li className="ItemMAR-navItem">Help</li>
          </ul>
        </nav>
      </header>

      <main className="ItemMAR-mainContent">
        <section className="ItemMAR-heroSection"></section>

        <section className="ItemMAR-categorySection">
          <h2 className="ItemMAR-categoryTitle">Category</h2>
          <div className="ItemMAR-categoriesGrid">

            <div className="ItemMAR-categoryCard">
              <img src={box} className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Box Bars</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src={u} className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">U Channels</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src={l} className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">L-Bars</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src={box} className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Box Bars</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src={j} className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">J-Channel Bars</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src={sivilim} className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Sivilim Boards</span>
            </div>
           <div className="ItemMAR-categoryCard">
              <img src={cut} className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Aluminum Cutters</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src={grill} className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Grill Machines</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src={Rmac} className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Rivet Guns</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src={knife} className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Rubber Blade</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src={glass} className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Glass Cutters</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src={rivert} className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Rivet Boxs</span>
            </div>
          </div>
        </section>

        <section className="ItemMAR-mainCategories">
          <div className="ItemMAR-mainCategoryCard ItemMAR-Glass">
            <span className="ItemMAR-mainCategoryName">Glass</span>
          </div>
          <div className="ItemMAR-mainCategoryCard ItemMAR-cradding-boards">
            <span className="ItemMAR-mainCategoryName">Cradding Boards</span>
          </div>
          <div className="ItemMAR-mainCategoryCard ItemMAR-silicon">
            <span className="ItemMAR-mainCategoryName">Silicon Gum</span>
          </div>
          <div className="ItemMAR-mainCategoryCard ItemMAR-rubber">
            <span className="ItemMAR-mainCategoryName">Rubber</span>
          </div>
          <div className="ItemMAR-mainCategoryCard ItemMAR-PVC-Marble">
            <span className="ItemMAR-mainCategoryName">PVC-Marble</span>
          </div>
        </section>

        <section className="ItemMAR-productsSection">
          <div className="ItemMAR-productCarousel">
            <div className="ItemMAR-productCard">
              <img src="https://i.ibb.co/r71X71S/coconut.png" alt="Coconut" className="ItemMAR-productImage" />
              <div className="ItemMAR-productDetails">
                <span className="ItemMAR-productPrice">Rs 155.00</span>
                <span className="ItemMAR-productUnit">/ Unit</span>
                <p className="ItemMAR-productDescription">Coconut</p>
                <button className="ItemMAR-addButton">+ Add</button>
              </div>
            </div>
            <div className="ItemMAR-productCard">
              <img src="https://i.ibb.co/tZ5N1N6/milk.png" alt="Anchor Full Cream Fresh Milk Tetra 1L" className="ItemMAR-productImage" />
              <div className="ItemMAR-productDetails">
                <span className="ItemMAR-productPrice">Rs 599.00</span>
                <span className="ItemMAR-productUnit">/ Unit</span>
                <p className="ItemMAR-productDescription">Anchor Full Cream Fresh Milk Tetra 1L</p>
                <button className="ItemMAR-addButton">+ Add</button>
              </div>
            </div>
            <div className="ItemMAR-productCard">
              <img src="https://i.ibb.co/tZ5N1N6/milk.png" alt="Kotmale Full Cream Milk Tetra 1L" className="ItemMAR-productImage" />
              <div className="ItemMAR-productDetails">
                <span className="ItemMAR-productPrice">Rs 599.00</span>
                <span className="ItemMAR-productUnit">/ Unit</span>
                <p className="ItemMAR-productDescription">Kotmale Full Cream Milk Tetra 1L</p>
                <button className="ItemMAR-addButton">+ Add</button>
              </div>
            </div>
            <div className="ItemMAR-productCard">
              <img src="https://i.ibb.co/G9N1G4P/onion.png" alt="Onion" className="ItemMAR-productImage" />
              <div className="ItemMAR-productDetails">
                <span className="ItemMAR-productPrice">Rs 210.00</span>
                <span className="ItemMAR-productUnit">/ Kg</span>
                <p className="ItemMAR-productDescription">Onion</p>
                <button className="ItemMAR-addButton">+ Add</button>
              </div>
            </div>
            <div className="ItemMAR-productCard">
              <img src="https://i.ibb.co/jT88W4k/vegetables.png" alt="Red Dhal Whole KG - Local" className="ItemMAR-productImage" />
              <div className="ItemMAR-productDetails">
                <span className="ItemMAR-productPrice">Rs 202.00</span>
                <span className="ItemMAR-productUnit">/ Kg</span>
                <p className="ItemMAR-productDescription">Red Dhal Whole KG - Local</p>
                <button className="ItemMAR-addButton">+ Add</button>
              </div>
            </div>
            <div className="ItemMAR-productCard">
              <img src="https://i.ibb.co/zXn0w7b/individual.png" alt="Fresh Farm Eggs Large 10S" className="ItemMAR-productImage" />
              <div className="ItemMAR-productDetails">
                <span className="ItemMAR-productPrice">Rs 799.00</span>
                <span className="ItemMAR-productUnit">/ Unit</span>
                <p className="ItemMAR-productDescription">Fresh Farm Eggs Large 10S</p>
                <button className="ItemMAR-addButton">+ Add</button>
              </div>
            </div>
          </div>
          <div className="ItemMAR-carouselNav ItemMAR-right">›</div>
        </section>
      </main>
    </div>
  );
};

export default ItemMarkert;