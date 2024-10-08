import React, { useState, useEffect, useRef } from "react";
import "../../styles/onlineStoreFrontComponents/ProductShowcaseCarousel.css";
import { getShowcaseImages } from "../../services/online-store-front-api";

const ProductShowcaseCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const slideRef = useRef();

  const buildImageUrl = (imagePath) => {
    if (imagePath.startsWith("/")) {
      return `https://rev-auto-parts.onrender.com${imagePath}`;
    } else {
      return `https://rev-auto-parts.onrender.com/${imagePath}`;
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const fetchedImages = await getShowcaseImages();

        if (
          fetchedImages &&
          fetchedImages.data &&
          Array.isArray(fetchedImages.data.images)
        ) {
          setImages(fetchedImages.data.images);
        } else {
          throw new Error("Invalid images data format.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError(err.message || "An error occurred while fetching images.");
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (loading || error || images.length === 0) return;

    if (slideRef.current) {
      slideRef.current.style.transition = "transform 0.5s ease-in-out";
      slideRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, images.length, loading, error, images]);

  if (loading) {
    return <div className="carousel-loading">Loading...</div>;
  }

  if (error) {
    return <div className="carousel-error">{error}</div>;
  }

  return (
    <div id="root-product-showcase-carousel" className="carousel-wrapper">
      <div className="carousel-container" ref={slideRef}>
        {images.map((image) => (
          <div className="carousel-image-wrapper" key={image.id}>
            <img
              src={buildImageUrl(image.imageUrl)}
              alt={`Product Showcase ${image.id}`}
              className="carousel-image"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
              }}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator-button ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ProductShowcaseCarousel;
