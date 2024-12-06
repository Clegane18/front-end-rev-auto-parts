import React, { useState, useEffect } from "react";
import "../../styles/onlineStoreFrontComponents/ViewPicturesModal.css";
import { AiOutlineClose, AiFillDelete } from "react-icons/ai";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import {
  deleteProductImageById,
  changePrimaryProductImageById,
} from "../../services/online-store-front-api";
import ViewPicturesConfirmationModal from "./ViewPicturesConfirmationModal";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

const ViewPicturesModal = ({ images = [], loading, baseUrl, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localImages, setLocalImages] = useState(images);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const { authToken } = useAdminAuth();

  useEffect(() => {
    setLocalImages(images);
    setCurrentIndex(0);
  }, [images]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? localImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === localImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) =>
          prev === localImages.length - 1 ? 0 : prev + 1
        );
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) =>
          prev === 0 ? localImages.length - 1 : prev - 1
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [localImages.length, onClose]);

  const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/150";

  const handleDelete = () => {
    const imageToDelete = localImages[currentIndex];
    setConfirmationTitle("Confirm Deletion");
    setConfirmationMessage(
      `Are you sure you want to delete the image with ID ${imageToDelete.id}? This action cannot be undone.`
    );
    setConfirmationAction(() => () => confirmDelete(imageToDelete.id));
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async (productImageId) => {
    setIsDeleting(true);
    setError("");
    setIsConfirmationOpen(false);

    try {
      const message = await deleteProductImageById({
        productImageId,
        authToken,
      });
      console.log(message);

      const updatedImages = localImages.filter(
        (img) => img.id !== productImageId
      );
      setLocalImages(updatedImages);

      if (currentIndex >= updatedImages.length && updatedImages.length > 0) {
        setCurrentIndex(updatedImages.length - 1);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete the image.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetPrimary = () => {
    const imageToSetPrimary = localImages[currentIndex];
    if (imageToSetPrimary.isPrimary) {
      setError("This image is already the primary image.");
      return;
    }

    setConfirmationTitle("Set as Primary Image");
    setConfirmationMessage(
      `Are you sure you want to set the image with ID ${imageToSetPrimary.id} as the primary image?`
    );
    setConfirmationAction(() => () => confirmSetPrimary(imageToSetPrimary.id));
    setIsConfirmationOpen(true);
  };

  const confirmSetPrimary = async (productImageId) => {
    setIsSettingPrimary(true);
    setError("");
    setIsConfirmationOpen(false);

    try {
      const message = await changePrimaryProductImageById({
        productImageId,
        authToken,
      });
      console.log(message);

      const updatedImages = localImages.map((img) => ({
        ...img,
        isPrimary: img.id === productImageId,
      }));
      setLocalImages(updatedImages);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to set primary image.");
    } finally {
      setIsSettingPrimary(false);
    }
  };

  return (
    <>
      <div id="root-view-pictures-modal">
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
            <h2 id="modal-title">Product Images</h2>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner" aria-hidden="true"></div>
                <p>Loading images...</p>
              </div>
            ) : (
              <div className="carousel-container">
                {localImages.length > 0 ? (
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
                        src={`${baseUrl}${localImages[currentIndex].imageUrl}`}
                        alt={`Product ${localImages[currentIndex].id}`}
                        className="main-image"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMAGE_URL;
                        }}
                        loading="lazy"
                      />
                      {localImages[currentIndex].isPrimary && (
                        <span className="primary-badge">Primary</span>
                      )}
                      <button
                        className="delete-button"
                        onClick={handleDelete}
                        aria-label="Delete Image"
                        title="Delete Image"
                        disabled={isDeleting}
                      >
                        <AiFillDelete />
                      </button>
                      {!localImages[currentIndex].isPrimary && (
                        <button
                          className="set-primary-button"
                          onClick={handleSetPrimary}
                          aria-label="Set as Primary Image"
                          title="Set as Primary Image"
                          disabled={isSettingPrimary}
                        >
                          {isSettingPrimary ? "Setting..." : "Set as Primary"}
                        </button>
                      )}
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
                      {localImages.map((img, index) => (
                        <img
                          key={img.id}
                          src={`${baseUrl}${img.imageUrl}`}
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
                    {error && <p className="error-message">{error}</p>}
                  </>
                ) : (
                  <p>No images available for this product.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ViewPicturesConfirmationModal
        isOpen={isConfirmationOpen}
        title={confirmationTitle}
        message={confirmationMessage}
        onConfirm={confirmationAction}
        onClose={() => setIsConfirmationOpen(false)}
        confirmButtonText="Yes"
        cancelButtonText="No"
      />
    </>
  );
};

export default ViewPicturesModal;
