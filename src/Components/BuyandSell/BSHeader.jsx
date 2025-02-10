import { useState } from "react";
import "./BSHeader.css";

const BSHeader = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="slider-container">
      <div className="slider">
        <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
      </div>
      <div className="buttons">
        <button onClick={prevSlide} className="btn">Prev</button>
        <button onClick={nextSlide} className="btn">Next</button>
      </div>
    </div>
  );
};

export default function App() {
  const images = [
    "https://via.placeholder.com/300x200?text=1",
    "https://via.placeholder.com/300x200?text=2",
    "https://via.placeholder.com/300x200?text=3",
  ];

  return <BSHeader images={images} />;
}
