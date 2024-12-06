import React, { useState, useEffect } from "react";
import "../../styles/onlineStoreFrontComponents/ShowcaseImagesModal.css";
import { AiOutlineClose, AiFillDelete } from "react-icons/ai";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import {
  deleteShowcaseImage,
  getShowcaseImages,
} from "../../services/online-store-front-api";
import ViewPicturesConfirmationModal from "./ViewPicturesConfirmationModal";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

const encodeURL = (url) => (url ? url.replace(/\\/g, "/") : "");

const buildImageUrl = (imagePath) => {
  if (imagePath.startsWith("/")) {
    return `https://rev-auto-parts.onrender.com${imagePath}`;
  } else {
    return `https://rev-auto-parts.onrender.com/${imagePath}`;
  }
};

const ShowcaseImagesModal = ({ onClose }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { authToken } = useAdminAuth();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getShowcaseImages();
        setImages(response.data.images);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch showcase images");
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, onClose]);

  const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/150";

  const handleDeleteClick = (image) => {
    setImageToDelete(image);
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;

    setDeleting(true);
    setError("");
    setIsConfirmationOpen(false);

    try {
      await deleteShowcaseImage(imageToDelete.id, authToken);
      setImages((prevImages) =>
        prevImages.filter((img) => img.id !== imageToDelete.id)
      );

      if (currentIndex >= images.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }

      setSuccessMessage("Showcase image deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete the showcase image.");
    } finally {
      setDeleting(false);
      setImageToDelete(null);
    }
  };

  return (
    <>
      <div id="root-showcase-images-modal">
        <div
          className="modal-overlay"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={onClose}
              aria-label="Close Modal"
              title="Close"
            >
              <AiOutlineClose />
            </button>
            <h2 id="modal-title">Showcase Images</h2>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner" aria-hidden="true"></div>
                <p>Loading images...</p>
              </div>
            ) : (
              <div className="carousel-container">
                {images.length > 0 ? (
                  <>
                    <button
                      className="nav-button prev-button"
                      onClick={handlePrev}
                      aria-label="Previous Image"
                      title="Previous"
                    >
                      <MdArrowBack />
                    </button>
                    <div className="image-wrapper">
                      <img
                        src={buildImageUrl(
                          encodeURL(images[currentIndex].imageUrl)
                        )}
                        alt={`Showcase ${currentIndex}`}
                        className="main-image"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMAGE_URL;
                        }}
                        loading="lazy"
                      />
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteClick(images[currentIndex])}
                        aria-label="Delete Showcase Image"
                        title="Delete Showcase Image"
                        disabled={deleting}
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                    <button
                      className="nav-button next-button"
                      onClick={handleNext}
                      aria-label="Next Image"
                      title="Next"
                    >
                      <MdArrowForward />
                    </button>
                    <div className="thumbnails">
                      {images.map((img, index) => (
                        <img
                          key={img.id}
                          src={buildImageUrl(encodeURL(img.imageUrl))}
                          alt={`Thumbnail ${img.id}`}
                          className={`thumbnail ${
                            index === currentIndex ? "active" : ""
                          }`}
                          onClick={() => setCurrentIndex(index)}
                          onError={(e) => {
                            e.target.src = PLACEHOLDER_IMAGE_URL;
                          }}
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <p>No images available for this showcase.</p>
                )}
              </div>
            )}
            {error && <p className="error-message">{error}</p>}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
          </div>
        </div>
      </div>

      {isConfirmationOpen && (
        <ViewPicturesConfirmationModal
          isOpen={isConfirmationOpen}
          title="Confirm Deletion"
          message={`Are you sure you want to delete this showcase image? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onClose={() => setIsConfirmationOpen(false)}
          confirmButtonText="Yes, Delete"
          cancelButtonText="Cancel"
        />
      )}
    </>
  );
};

export default ShowcaseImagesModal;
