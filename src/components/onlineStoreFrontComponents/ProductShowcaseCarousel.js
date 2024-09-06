import React, { useState, useEffect } from "react";
import "../../styles/onlineStoreFrontComponents/ProductShowcaseCarousel.css";
import productImage1 from "../../assets/product-image1.png";

const ProductShowcaseCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [productImage1];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div id="root-product-showcase-carousel">
      <div className="carousel-container">
        <img
          src={images[currentIndex]}
          alt="Product Showcase"
          className="carousel-image"
        />
      </div>
    </div>
  );
};

export default ProductShowcaseCarousel;
