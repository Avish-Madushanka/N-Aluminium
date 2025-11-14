import React, { useState, useEffect } from "react";
import { Filter, Bookmark, BookmarkCheck, X } from "lucide-react";
import "./ItemMarkert.css";

const slides = [
  {
    id: 1,
    title: "Sharpen Your Skills, with Us",
    description:
      "Enhance your expertise through hands-on aluminum recycling and sustainability programs.",
    image:
      "https://aberturasleon.com.ar/wp-content/uploads/2024/04/modelos-de-vidrio.jpg",
    button: "Join Our Club!",
  },
  {
    id: 2,
    title: "Master Modern Recycling Practices",
    description:
      "Discover innovative techniques and eco-friendly methods that make a real impact.",
    image:
      "https://www.unleashedsoftware.com/media/scraper/011_COPY-JOPA-CID037.jpg",
    button: "Explore Courses",
  },
];

const ItemMarkert = () => {
  const products = [
    {
      id: 1,
      name: "Aluminum Scrap Bundle",
      category: "Raw Aluminum",
      price: 25,
      rating: 4.5,
      inStock: true,
      image: "https://images.unsplash.com/photo-1602526432604-b6a8b0c3c6c3",
    },
    {
      id: 2,
      name: "Recycled Aluminum Sheets",
      category: "Processed Aluminum",
      price: 40,
      rating: 4.8,
      inStock: true,
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    },
    {
      id: 3,
      name: "Aluminum Ingots",
      category: "Refined Products",
      price: 55,
      rating: 4.2,
      inStock: false,
      image: "https://images.unsplash.com/photo-1616628182509-6c7e2b49c146",
    },
    {
      id: 4,
      name: "Aluminum Can Collection",
      category: "Raw Aluminum",
      price: 15,
      rating: 4.0,
      inStock: true,
      image: "https://images.unsplash.com/photo-1590794064817-748e0a195a7d",
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
    const matchCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchBookmark = showBookmarked
      ? bookmarked.includes(product.id)
      : true;
    return matchCategory && matchSearch && matchBookmark;
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
            <li><a href="#">Home</a></li>
            <li><a href="#">Shop</a></li>
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
                <button>{slide.button}</button>
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

        <div className="am-products">
          {filteredProducts.map((product) => (
            <div key={product.id} className="am-product-card">
              <div className="am-product-img">
                <img src={product.image} alt={product.name} />
                <button
                  className={`am-bookmark-btn ${
                    bookmarked.includes(product.id)
                      ? "active"
                      : ""
                  }`}
                  onClick={() => toggleBookmark(product.id)}
                >
                  {bookmarked.includes(product.id) ? (
                    <BookmarkCheck />
                  ) : (
                    <Bookmark />
                  )}
                </button>

                {!product.inStock && (
                  <div className="am-outstock">Out of Stock</div>
                )}
              </div>

              <div className="am-product-info">
                <h4>{product.name}</h4>
                <p className="am-category">{product.category}</p>
                <p className="am-price">${product.price}</p>
                <p className="am-rating">⭐ {product.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ItemMarkert;
