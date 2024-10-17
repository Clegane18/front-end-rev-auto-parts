import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InsufficientStockModal from "./InsufficientStockModal";
import "../../styles/onlineStoreFrontComponents/OnlineProductDetailsPage.css";
import { formatCurrency } from "../../utils/formatCurrency";
import useRequireAuth from "../../utils/useRequireAuth";
import { addProductToCart } from "../../services/cart-api";
import { useAuth } from "../../contexts/AuthContext";
import { getProductById } from "../../services/inventory-api";
import {
  getAllComments,
  verifyCustomerProductPurchase,
} from "../../services/comments-api";
import OnlineStoreFrontHeader from "./OnlineStoreFrontHeader";
import OnlineStoreFrontFooter from "./OnlineStoreFrontFooter";
import { FaStar, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLoading } from "../../contexts/LoadingContext";

const encodeURL = (url) => url.replace(/\\/g, "/");

const buildImageUrl = (imagePath) => {
  if (imagePath.startsWith("/")) {
    return `https://rev-auto-parts.onrender.com${imagePath}`;
  } else {
    return `https://rev-auto-parts.onrender.com/${imagePath}`;
  }
};

const OnlineProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const checkAuth = useRequireAuth();
  const { currentUser, token } = useAuth();
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    productName: "",
    stock: 0,
  });
  const [product, setProduct] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({
    average: 0,
    count: 0,
  });
  const [comments, setComments] = useState([]);
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchProductAndComments = async () => {
      try {
        setIsLoading(true);
        if (!productId) {
          throw new Error("Product ID is missing.");
        }
        const productResponse = await getProductById(productId);
        if (productResponse.status !== 200) {
          throw new Error(
            productResponse.message || "Failed to fetch product details."
          );
        }
        const productData = productResponse.data;
        if (!productData.data || !productData.data.id) {
          throw new Error("Product data is incomplete.");
        }
        setProduct(productData.data);
        const primaryImage = productData.data.images.find(
          (img) => img.isPrimary
        );
        setMainImageUrl(
          primaryImage
            ? buildImageUrl(encodeURL(primaryImage.imageUrl))
            : "https://rev-auto-parts.onrender.com/default-image.jpg"
        );
        const commentsResponse = await getAllComments({ productId });
        if (commentsResponse.status !== 200) {
          throw new Error(
            commentsResponse.message || "Failed to fetch comments."
          );
        }
        const fetchedComments = commentsResponse.data;
        setComments(
          fetchedComments.map((comment) => ({
            id: comment.commentId,
            username: comment.customer.username,
            rating: comment.rating,
            comment: comment.commentText,
            date: new Date(comment.createdAt).toISOString().split("T")[0],
            images: comment.images
              ? comment.images.map((image) => encodeURL(image))
              : [],
            customerId: comment.customerId,
          }))
        );
        const totalRatings = fetchedComments.reduce(
          (acc, curr) => acc + curr.rating,
          0
        );
        const count = fetchedComments.length;
        const average = count > 0 ? totalRatings / count : 0;
        setRatings({
          average: average,
          count: count,
        });
        if (currentUser) {
          await verifyCustomerProductPurchase(
            { customerId: currentUser.id, productId },
            token
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndComments();
  }, [productId, currentUser, token, setIsLoading]);

  const handleBuyNowClick = () => {
    if (checkAuth("/online-store")) {
      setShowBuyNow(true);
    }
  };

  const handleConfirmPurchaseClick = useCallback(() => {
    if (!checkAuth("/online-store")) return;
    if (quantity > product.stock) {
      setModalInfo({
        isOpen: true,
        productName: product.name,
        stock: product.stock,
      });
      return;
    }
    const productWithQuantity = {
      Product: { ...product },
      quantity,
      unitPrice: product.price,
      subtotalAmount: quantity * product.price,
    };
    navigate("/online-checkout", { state: { items: [productWithQuantity] } });
  }, [checkAuth, quantity, product, navigate]);

  const handleAddToCartClick = useCallback(async () => {
    if (!checkAuth("/online-store")) return;
    if (!currentUser || !currentUser.id) {
      setError("User not authenticated. Please log in.");
      return;
    }
    if (quantity > product.stock) {
      setModalInfo({
        isOpen: true,
        productName: product.name,
        stock: product.stock,
      });
      return;
    }
    try {
      setIsLoading(true);
      await addProductToCart({
        customerId: currentUser.id,
        productId: product.id,
        token,
        quantity,
      });
      navigate(-1);
    } catch (error) {
      setError("Failed to add product to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [
    checkAuth,
    quantity,
    product,
    currentUser,
    token,
    navigate,
    setIsLoading,
  ]);

  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    if (newQuantity > product.stock) {
      setModalInfo({
        isOpen: true,
        productName: product.name,
        stock: product.stock,
      });
      setQuantity(product.stock);
    } else if (newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  const closeModal = () => {
    setModalInfo({ isOpen: false, productName: "", stock: 0 });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, images: [], currentIndex: 0 });
  };

  const handleImageClick = (imagesArray, index) => {
    setImageModal({
      isOpen: true,
      images: imagesArray,
      currentIndex: index,
    });
  };

  const handleNextImage = () => {
    if (
      imageModal.isOpen &&
      imageModal.images &&
      imageModal.images.length > 0
    ) {
      const nextIndex =
        (imageModal.currentIndex + 1) % imageModal.images.length;
      setImageModal({
        ...imageModal,
        currentIndex: nextIndex,
      });
    }
  };

  const handlePreviousImage = () => {
    if (
      imageModal.isOpen &&
      imageModal.images &&
      imageModal.images.length > 0
    ) {
      const prevIndex =
        (imageModal.currentIndex - 1 + imageModal.images.length) %
        imageModal.images.length;
      setImageModal({
        ...imageModal,
        currentIndex: prevIndex,
      });
    }
  };

  const handleThumbnailClick = (imageUrl) => {
    setMainImageUrl(buildImageUrl(encodeURL(imageUrl)));
  };

  if (error) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <p className="error">Product not found.</p>
      </div>
    );
  }

  return (
    <div id="root-product-details-page">
      <OnlineStoreFrontHeader />
      <div className="product-details-container">
        <div className="product-image-section">
          <div className="image-gallery">
            <img
              src={mainImageUrl}
              alt={product.name}
              className="product-main-image"
            />
            <div className="additional-images">
              {product.images?.map((image, index) => {
                let formattedImageUrl = encodeURL(image.imageUrl);
                if (!formattedImageUrl.startsWith("/")) {
                  formattedImageUrl = `/${formattedImageUrl}`;
                }
                const fullImageUrl = buildImageUrl(formattedImageUrl);
                return (
                  <img
                    key={index}
                    src={fullImageUrl}
                    alt={`${product.name} alternate ${index + 1}`}
                    className="product-additional-image"
                    onClick={() => handleThumbnailClick(image.imageUrl)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://rev-auto-parts.onrender.com/default-image.jpg";
                    }}
                    loading="lazy"
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="product-info-section">
          <h2 className="product-name">{product.name}</h2>
          <div className="rating-section">
            <span className="average-rating">
              {ratings.average.toFixed(1)} <FaStar color="#FFD700" />
            </span>
            <span className="rating-count">
              ({ratings.count} {ratings.count === 1 ? "review" : "reviews"})
            </span>
          </div>
          <p className="product-price">{formatCurrency(product.price)}</p>
          <p className="product-item-code">Item Code: {product.itemCode}</p>
          <p className="product-description">{product.description}</p>
          <div className="product-actions">
            <button onClick={handleBuyNowClick} className="buy-now-button">
              Buy Now
            </button>
            <button
              onClick={handleAddToCartClick}
              className="add-to-cart-button"
            >
              Add to Cart
            </button>
          </div>
          {showBuyNow && (
            <div className={`buy-now-section ${showBuyNow ? "active" : ""}`}>
              <p className="stock-info">Current Stock: {product.stock}</p>
              <label className="quantity-label">
                Quantity:
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={product.stock}
                  className="quantity-input"
                />
              </label>
              <button
                onClick={handleConfirmPurchaseClick}
                className="confirm-buy-now-button"
              >
                Confirm Purchase
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="ratings-comments-container">
        <div className="ratings-summary">
          <h3>Customer Reviews</h3>
          <div className="ratings-details">
            <span className="average-rating">
              {ratings.average.toFixed(1)} <FaStar color="#FFD700" />
            </span>
            <span className="rating-count">
              Based on {ratings.count}{" "}
              {ratings.count === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        <div className="comments-section">
          <h3>Reviews</h3>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-username">{comment.username}</span>
                  <span className="comment-date">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                  <div className="comment-rating">
                    {[...Array(5)].map((star, index) => (
                      <FaStar
                        key={index}
                        color={index < comment.rating ? "#FFD700" : "#ccc"}
                        size={14}
                      />
                    ))}
                  </div>
                </div>
                <p className="comment-text">{comment.comment}</p>
                {comment?.images?.length > 0 && (
                  <div className="comment-images">
                    {comment.images.map((image, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={`https://rev-auto-parts.onrender.com${image}`}
                        alt={`Attachment ${imgIdx + 1} for comment ${
                          comment.id
                        }`}
                        className="comment-image"
                        onClick={() => handleImageClick(comment.images, imgIdx)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://rev-auto-parts.onrender.com/default-comment-image.jpg";
                        }}
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>

      <InsufficientStockModal
        isOpen={modalInfo.isOpen}
        productName={modalInfo.productName}
        stock={modalInfo.stock}
        onClose={closeModal}
      />

      {imageModal.isOpen && (
        <div className="image-modal" onClick={closeImageModal}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <FaTimes
              className="image-modal-close-icon"
              onClick={closeImageModal}
            />
            <img
              src={`https://rev-auto-parts.onrender.com${
                imageModal.images[imageModal.currentIndex]
              }`}
              alt="Comment Attachment"
              className="image-modal-img"
            />
            {imageModal.images.length > 1 && (
              <div className="image-modal-nav">
                <FaChevronLeft
                  className="prev-icon"
                  onClick={handlePreviousImage}
                />
                <FaChevronRight
                  className="next-icon"
                  onClick={handleNextImage}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <OnlineStoreFrontFooter />
    </div>
  );
};

export default OnlineProductDetailsPage;
