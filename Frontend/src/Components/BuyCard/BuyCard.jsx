import React from 'react';
import './BuyCard.css';
import API_ENDPOINTS from '../../apiConfig';

const BuyCard = ({ onClose, product }) => { 
  console.log("BuyCard rendered with product:", product);

  // Default product data in case none is provided
  const defaultProduct = {
    imagePath: "https://via.placeholder.com/300x200?text=No+Image",
    name: "Product Name",
    description: "Product description not available.",
    address: "Address not available",
    district: "District",
    province: "Province",
    price: 0,
    contact: "Contact not available",
    type: "Type not specified"
  };

  // If no product is provided, use defaults
  if (!product) {
    console.warn("BuyCard: No product data provided, using defaults");
  }

  // Get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image";
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) return imagePath;
    
    // Otherwise, construct the URL using the backend root
    const backendRoot = API_ENDPOINTS.BACKEND_ROOT_URL;
    return `${backendRoot}${imagePath}`;
  };

  // Format address with district and province
  const formatAddress = (address, district, province) => {
    let formattedAddress = address || 'Address not available';
    
    if (district) {
      formattedAddress += `\n${district}`;
    }
    
    if (province) {
      formattedAddress += district ? `, ${province}` : `\n${province}`;
    }
    
    return formattedAddress;
  };

  // Format price with commas and currency
  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'Price not available';
    return `Rs. ${Number(price).toLocaleString()}`;
  };

  // Use the provided product or fall back to defaults
  const productData = product || defaultProduct;
  
  const imageUrl = getImageUrl(productData.imagePath);
  const title = productData.name || defaultProduct.name;
  const description = productData.description || defaultProduct.description;
  const formattedAddress = formatAddress(
    productData.address, 
    productData.district, 
    productData.province
  );
  const formattedPrice = formatPrice(productData.price);
  const contactInfo = productData.contact || defaultProduct.contact;
  const productType = productData.type || defaultProduct.type;

  return (
    <div className="popup1-overlay" onClick={onClose}>
      <div className="popup1-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close1-button"
          onClick={(e) => {
            e.stopPropagation(); 
            console.log("Close button clicked");
            if (onClose) onClose(); 
          }}
        >
          x 
        </button>

        <div className="product1-image-container">
          <img
            src={imageUrl}
            alt={title}
            className="product1-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available";
            }}
          />
        </div>

        <div className="product1-info">
          <h2 className="product1-title">{title}</h2>
          
          <div className="product1-type">
            <span className="product1-type-label">Type:</span> {productType}
          </div>

          <p className="product1-description">
            {description}
          </p>

          <p className="product1-address">
            {formattedAddress.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>

          <p className="product1-price">{formattedPrice}</p>

          <div className="contact1-info">
            <p>📞 {contactInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCard;
