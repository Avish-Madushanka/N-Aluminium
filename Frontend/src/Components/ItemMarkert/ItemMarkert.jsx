import React, { useState, useEffect } from "react";
import { Filter, Bookmark, BookmarkCheck, X, Plus } from "lucide-react";
import "./ItemMarkert.css";

const slides = [
  {
    id: 1,
    title: "Build Better with Quality Glass",
    description:
      "Upgrade your projects with premium construction glass designed for strength, safety, and clarity.",
    image:
      "https://aberturasleon.com.ar/wp-content/uploads/2024/04/modelos-de-vidrio.jpg",
    button: "Order Now!",
    link: "/GlassOrder"
  },
  {
    id: 2,
    title: "Master Modern Recycling Practices",
    description:
      "Discover innovative techniques and eco-friendly methods that make a real impact.",
    image:
      "https://www.unleashedsoftware.com/media/scraper/011_COPY-JOPA-CID037.jpg",
    button1: "Explore Courses",
    link: "/"
  },
];

const ItemMarkert = () => {
  const products = [
    {
      id: 1,
      name: "Ambawela Full Cream Fresh Milk Tetra 1L",
      category: "Unit",
      price: 500.00,
      image: "https://media.istockphoto.com/id/488827891/photo/sheet-metal.jpg?s=612x612&w=0&k=20&c=3HONo5ffmfJS26pjkfHGuxJX1zm5CyjLGBg1KRM2_M4=", 
      unitType: "Unit",
      originalPrice: null, 
      discount: null, 
    },
    {
      id: 2,
      name: "Big Onions",
      category: "KG",
      price: 200.00,
      image: "https://www.alcirclebiz.com//Uploads/ProductImage/16257/aluminiumboxbar.jpg", 
      unitType: "KG",
      originalPrice: null,
      discount: null,
    },
    {
      id: 3,
      name: "Sprite Can 250ml",
      category: "Unit",
      price: 300.00,
      image: "https://eberbachlabtools.com/cdn/shop/files/e6040_1200x.png?v=1686583211", 
      unitType: "Unit",
      originalPrice: null,
      discount: null,
    },
    {
      id: 4,
      name: "Potatoes",
      category: "KG",
      price: 290.00,
      image: "https://embilipitiyastores.com/style/images/products/1612266782_Aluminium%20Box%20Bar.jpg", 
      unitType: "KG",
      originalPrice: null,
      discount: null,
    },
    {
      id: 5,
      name: "Rice Red Kekulu Bulk Kg - Local",
      category: "KG",
      price: 195.00,
      image: "https://www.embilipitiyastores.com/style/images/products/1612266884_Aluminium%20L%20Angle.jpg", 
      unitType: "KG",
      originalPrice: null,
      discount: null,
    },
    {
      id: 6,
      name: "Banana - Kolikuttu",
      category: "KG",
      price: 390.00,
      image: "https://i.ebayimg.com/images/g/ufYAAOSwjXRXas1z/s-l400.jpg",
      unitType: "KG",
      originalPrice: null,
      discount: null,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarked, setBookmarked] = useState([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleBookmark = (id) => {
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchBookmark = showBookmarked
      ? bookmarked.includes(product.id)
      : true;
    return /* matchCategory && */ matchSearch && matchBookmark;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="ITNav-wrapper">
        <nav className="ITNav-bottom-nav">
          <button
            className="ITNav-shop-by-cat-btn"
            onClick={() => setShowCategories(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span>SHOP BY CATEGORIES</span>
          </button>

          <ul className="ITNav-nav-links">
            <li>
              <a href="#">
                Categories <span className="ITNav-badge ITNav-badge-sale">SALE</span>
              </a>
            </li>
            <li>
              <a href="#">
                Products <span className="ITNav-badge ITNav-badge-hot">HOT</span>
              </a>
            </li>
            <li><a href="#">Top Deals</a></li>
            <li><a href="#">Elements</a></li>
          </ul>

          <div className="ITNav-todays-deals">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2"></path>
              <path d="M21 14v1a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 15v-1"></path>
              <line x1="21" y1="10" x2="3" y2="10"></line>
              <line x1="12" y1="22" x2="12" y2="10"></line>
              <line x1="12" y1="2.27" x2="12" y2="4"></line>
              <polyline points="18.5 7.5 12 11 5.5 7.5"></polyline>
            </svg>
            <span>Today's Deals</span>
          </div>
        </nav>
      </div>

      <div className="am-container">
        <div className="am-slider">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`am-slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="am-overlay"></div>
              <div className="am-slide-content">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <button onClick={() => window.location.href = slide.link}>Order Now</button>
              </div>
            </div>
          ))}
        </div>

        <div className="am-toolbar">
          <button
            className={`am-bookmark-toggle ${
              showBookmarked ? "active" : ""
            }`}
            onClick={() => setShowBookmarked(!showBookmarked)}
          >
            <BookmarkCheck />
            {showBookmarked ? "Show All" : "Show Liked"}
          </button>
        </div>

        <div
          className={`am-sidebar-overlay ${
            showCategories ? "visible" : ""
          }`}
        >
          <div className="am-sidebar">
            <div className="am-sidebar-header">
              <h3>Categories</h3>
              <button
                className="am-close-sidebar"
                onClick={() => setShowCategories(false)}
              >
                <X />
              </button>
            </div>

            <ul>
              <li
                className={selectedCategory === "all" ? "active" : ""}
                onClick={() => {
                  setSelectedCategory("all");
                  setShowCategories(false);
                }}
              >
                All Items
              </li>

              <li
                className={
                  selectedCategory === "Raw Aluminum" ? "active" : ""
                }
                onClick={() => {
                  setSelectedCategory("Raw Aluminum");
                  setShowCategories(false);
                }}
              >
                Raw Aluminum
              </li>
              <li
                className={
                  selectedCategory === "Processed Aluminum" ? "active" : ""
                }
                onClick={() => {
                  setSelectedCategory("Processed Aluminum");
                  setShowCategories(false);
                }}
              >
                Processed Aluminum
              </li>
              <li
                className={
                  selectedCategory === "Refined Products" ? "active" : ""
                }
                onClick={() => {
                  setSelectedCategory("Refined Products");
                  setShowCategories(false);
                }}
              >
                Refined Products
              </li>
            </ul>
          </div>
        </div>

        <div className="am-products-grid"> {/* Changed from am-products to am-products-grid */}
          {filteredProducts.map((product) => (
            <div key={product.id} className="am-product-card-new"> {/* Changed class name */}
              <div className="am-product-card-image-wrapper">
                <img src={product.image} alt={product.name} className="am-product-card-image" />
                <button className="am-product-card-add-button">
                  <Plus size={20} /> Add
                </button>
              </div>
              <div className="am-product-card-info">
                <div className="am-product-card-price-row">
                  <span className="am-product-card-current-price">
                    Rs {product.price.toFixed(2)}
                  </span>
                  <span className="am-product-card-unit"> / {product.unitType}</span>
                </div>
                <p className="am-product-card-name">{product.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ItemMarkert;