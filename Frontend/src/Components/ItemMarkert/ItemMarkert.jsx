import React from 'react';
import './ItemMarkert.css';

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
        <section className="ItemMAR-heroSection">
        </section>

        <section className="ItemMAR-categorySection">
          <h2 className="ItemMAR-categoryTitle">Category</h2>
          <div className="ItemMAR-categoriesGrid">
            <div className="ItemMAR-categoryCard">
              <img src="https://i.ibb.co/QpHp4Q4/desserts.png" alt="Desserts" className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Desserts</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src="https://i.ibb.co/3zdJg8Q/snacks.png" alt="Snacks" className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Snacks</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src="https://i.ibb.co/jR09J9s/biscuits.png" alt="Biscuits" className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Biscuits</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src="https://i.ibb.co/pL3kQ6K/coffee.png" alt="Coffee" className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Coffee</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src="https://i.ibb.co/N7B9zF1/eggs.png" alt="Eggs" className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Eggs</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src="https://i.ibb.co/k3kG3rL/bakery.png" alt="Bakery" className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Bakery</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src="https://i.ibb.co/9hF3g78/family.png" alt="Family Consumption Beverages" className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Family Consumption Beverages</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src="https://i.ibb.co/zXn0w7b/individual.png" alt="Individual Consumption Beverages" className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Individual Consumption Beverages</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src="https://i.ibb.co/xS2kM9r/water.png" alt="Water" className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Water</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src="https://i.ibb.co/Gdk8cQW/hotandcold.png" alt="Hot & Cold Drinks" className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Hot & Cho. Drinks</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src="https://i.ibb.co/dK5z5T0/freshmilk.png" alt="Fresh Milk" className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Fresh Milk & Liq.-Milk</span>
            </div>
            <div className="ItemMAR-categoryCard">
              <img src="https://i.ibb.co/Wc6395N/tea.png" alt="Tea" className="ItemMAR-categoryImage" />
              <span className="ItemMAR-categoryName">Tea</span>
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
             <div className="ItemMAR-productCard">
              <img src="https://i.ibb.co/r71X71S/coconut.png" alt="Coconut" className="ItemMAR-productImage" />
              <div className="ItemMAR-productDetails">
                <span className="ItemMAR-productPrice">Rs 155.00</span>
                <span className="ItemMAR-productUnit">/ Unit</span>
                <p className="ItemMAR-productDescription">Coconut</p>
                <button className="ItemMAR-addButton">+ Add</button>
              </div>
            </div>
          </div>
          <div className="ItemMAR-carouselNav ItemMAR-right">›</div>
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
            <div className="ItemMAR-productCard">
              <img src="https://i.ibb.co/r71X71S/coconut.png" alt="Coconut" className="ItemMAR-productImage" />
              <div className="ItemMAR-productDetails">
                <span className="ItemMAR-productPrice">Rs 155.00</span>
                <span className="ItemMAR-productUnit">/ Unit</span>
                <p className="ItemMAR-productDescription">Coconut</p>
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