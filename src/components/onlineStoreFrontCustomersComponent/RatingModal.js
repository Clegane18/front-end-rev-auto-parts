// RatingModal.jsx
import React, { useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { createComment as createCommentAPI } from "../../services/comments-api";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/onlineStoreFrontCustomersComponent/RatingModal.css";

const RatingModal = ({ isOpen, onClose, product, onSubmit }) => {
  const { currentUser, token } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  if (!isOpen) return null;

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentTextChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleImagesChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    if (!currentUser || !currentUser.id) {
      setSubmissionError("You must be logged in to submit a review.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("commentText", commentText);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await createCommentAPI(
        formData,
        token,
        Number(product.productId)
      );

      onSubmit(response.data);

      setRating(0);
      setHoverRating(0);
      setCommentText("");
      setImages([]);
      onClose();
    } catch (err) {
      console.error("Error submitting comment:", err);

      if (err.response && err.response.data && err.response.data.message) {
        setSubmissionError(err.response.data.message);
      } else if (err.message) {
        setSubmissionError(err.message);
      } else {
        setSubmissionError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="root-rating-modal">
      <div className="rating-modal-overlay" onClick={onClose}>
        <div
          className="rating-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="rating-modal-close-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
          <h2 className="modal-title">Rate {product.productName}</h2>
          {submissionError && (
            <p className="error-message">{submissionError}</p>
          )}
          <form onSubmit={handleSubmit} className="rating-form">
            <div className="form-group">
              <label className="form-label">Rating:</label>
              <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <button
                      type="button"
                      key={index}
                      className={`star-button ${
                        ratingValue <= (hoverRating || rating)
                          ? "star-selected"
                          : ""
                      }`}
                      onClick={() => handleRatingChange(ratingValue)}
                      onMouseEnter={() => setHoverRating(ratingValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${ratingValue} star${
                        ratingValue > 1 ? "s" : ""
                      }`}
                    >
                      <FaStar />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Comment:</label>
              <textarea
                value={commentText}
                onChange={handleCommentTextChange}
                className="form-textarea"
                rows="4"
                placeholder="Write your review here..."
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Upload Images (optional):</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="form-input"
              />
            </div>
            {images.length > 0 && (
              <div className="image-previews">
                {images.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              className="submit-comment-button"
              disabled={isSubmitting || !rating}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
