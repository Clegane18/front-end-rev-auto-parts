import React, { useState, useEffect, useRef } from "react";
import "../../styles/onlineStoreFrontComponents/ProductShowcaseCarousel.css";
import productImage1 from "../../assets/product-image1.png";
import productImage2 from "../../assets/product-image2.png";
import productImage3 from "../../assets/product-image3.png";
import productImage4 from "../../assets/product-image4.png";

const ProductShowcaseCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [productImage1, productImage2, productImage3, productImage4];
  const slideRef = useRef();

  useEffect(() => {
    slideRef.current.style.transition = "transform 0.5s ease-in-out";
    slideRef.current.style.transform = `translateX(-${currentIndex * 100}vw)`;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  return (
    <div id="root-product-showcase-carousel">
      <div className="carousel-container" ref={slideRef}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Product Showcase ${index + 1}`}
            className="carousel-image"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductShowcaseCarousel;
