import React, { useState, useEffect, useRef } from "react";
import "../../styles/onlineStoreFrontComponents/ProductShowcaseCarousel.css";
import { getShowcaseImages } from "../../services/online-store-front-api";

const ProductShowcaseCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const slideRef = useRef();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const fetchedImages = await getShowcaseImages();
        console.log("Fetched Images:", fetchedImages);

        if (
          fetchedImages &&
          fetchedImages.data &&
          Array.isArray(fetchedImages.data.imageUrls)
        ) {
          setImages(fetchedImages.data.imageUrls);
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

    slideRef.current.style.transition = "transform 0.5s ease-in-out";
    slideRef.current.style.transform = `translateX(-${currentIndex * 100}vw)`;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, images.length, loading, error, images]);

  const IMAGE_BASE_URL = "http://localhost:3002";

  if (loading) {
    return <div className="carousel-loading">Loading...</div>;
  }

  if (error) {
    return <div className="carousel-error">{error}</div>;
  }

  return (
    <div id="root-product-showcase-carousel">
      <div className="carousel-container" ref={slideRef}>
        {images.map((imageUrl, index) => (
          <img
            key={index}
            src={`${IMAGE_BASE_URL}${imageUrl}`}
            alt={`Product Showcase ${index + 1}`}
            className="carousel-image"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductShowcaseCarousel;
