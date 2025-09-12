import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  Star,
  Filter,
  Grid,
  List,
  ArrowRight,
  Truck,
  Shield,
  Award,
} from "lucide-react";
import "./ItemMarkert.css"; 

const ItemMarkert = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Products", count: 248 },
    { id: "sheets", name: "Aluminum Sheets", count: 67 },
    { id: "profiles", name: "Profiles & Extrusions", count: 89 },
    { id: "tubes", name: "Tubes & Pipes", count: 45 },
    { id: "bars", name: "Bars & Rods", count: 47 },
  ];

  const products = [
    {
      id: 1,
      name: "6061-T6 Aluminum Sheet",
      price: "$89.99",
      rating: 4.8,
      reviews: 124,
      image:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&h=200&fit=crop",
      category: "sheets",
      specifications: `0.125" x 12" x 24"`,
      inStock: true,
    },
    {
      id: 2,
      name: "Aluminum T-Slot Extrusion",
      price: "$24.50",
      rating: 4.9,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop",
      category: "profiles",
      specifications: "20mm x 20mm x 1000mm",
      inStock: true,
    },
    {
      id: 3,
      name: "Seamless Aluminum Tube",
      price: "$156.75",
      rating: 4.7,
      reviews: 56,
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop",
      category: "tubes",
      specifications: `2" OD x 0.125" Wall`,
      inStock: false,
    },
    {
      id: 4,
      name: "7075-T6 Aluminum Bar",
      price: "$78.99",
      rating: 4.6,
      reviews: 34,
      image:
        "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&h=200&fit=crop",
      category: "bars",
      specifications: `1" x 1" x 12"`,
      inStock: true,
    },
    {
      id: 5,
      name: "Perforated Aluminum Panel",
      price: "$134.99",
      rating: 4.5,
      reviews: 78,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      category: "sheets",
      specifications: `24" x 36" x 0.063"`,
      inStock: true,
    },
    {
      id: 6,
      name: "Aluminum Angle Extrusion",
      price: "$45.50",
      rating: 4.8,
      reviews: 92,
      image:
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=200&fit=crop",
      category: "profiles",
      specifications: `2" x 2" x 1/8" x 8ft`,
      inStock: true,
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="am-market">
      <header className="am-header">
        <div className="am-container">
          <div className="am-header-inner">
            <div className="am-logo-wrap">
              <div className="am-logo">
                <span className="am-logo-text">Al</span>
              </div>
              <div>
                <h1 className="am-title">AlumTech Market</h1>
                <p className="am-subtitle">Premium Aluminum Solutions</p>
              </div>
            </div>

            <div className="am-search-cart">
              <div className="am-search">
                <input
                  type="text"
                  placeholder="Search aluminum products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="am-search-input"
                />
              </div>
              <button className="am-cart-btn">
                <ShoppingCart className="am-cart-icon" />
                <span className="am-cart-badge">3</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      
      <div className="am-container am-layout">
        <aside className="am-sidebar">
          <div className="am-sidebar-header">
            <h3>Categories</h3>
            <Filter />
          </div>
          <div className="am-categories">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`am-category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
              >
                <span>{category.name}</span>
                <span className="am-category-count">{category.count}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="am-main">
          <div className="am-toolbar">
            <div>
              <h2>
                {selectedCategory === "all"
                  ? "All Products"
                  : categories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <p>{filteredProducts.length} products found</p>
            </div>
            <div className="am-toolbar-actions">
              <div className="am-view-toggle">
                <button
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "active" : ""}
                >
                  <Grid />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "active" : ""}
                >
                  <List />
                </button>
              </div>
              <select>
                <option>Sort by: Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          <div
            className={`am-products ${viewMode === "list" ? "list" : "grid"}`}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`am-product-card ${
                  viewMode === "list" ? "list" : ""
                }`}
              >
                <div className="am-product-img">
                  <img src={product.image} alt={product.name} />
                  {product.discount && (
                    <div className="am-discount">-{product.discount}%</div>
                  )}
                  {!product.inStock && (
                    <div className="am-outstock">Out of Stock</div>
                  )}
                </div>
                <div className="am-product-details">
                  <h3>{product.name}</h3>
                  <p className="am-specs">{product.specifications}</p>
                  <div className="am-rating">
                    <Star className="star" />
                    <span>{product.rating}</span>
                    <span className="reviews">({product.reviews} reviews)</span>
                  </div>
                  <div className="am-price-cart">
                    <div className="am-price">
                      <span className="current">{product.price}</span>
                      {product.originalPrice && (
                        <span className="old">{product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      disabled={!product.inStock}
                      className={`am-cart-add ${
                        product.inStock ? "" : "disabled"
                      }`}
                    >
                      <ShoppingCart />
                      <span>Add to Cart</span>
                      <ArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="am-loadmore">
            <button>Load More Products</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ItemMarkert;
