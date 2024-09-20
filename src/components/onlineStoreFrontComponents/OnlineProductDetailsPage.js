import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InsufficientStockModal from "./InsufficientStockModal";
import "../../styles/onlineStoreFrontComponents/OnlineProductDetailsPage.css";
import { formatCurrency } from "../../utils/formatCurrency";
import useRequireAuth from "../../utils/useRequireAuth";
import { addProductToCart } from "../../services/cart-api";
import { useAuth } from "../../contexts/AuthContext";
import { getProductById } from "../../services/inventory-api";
import OnlineStoreFrontHeader from "./OnlineStoreFrontHeader";
import OnlineStoreFrontFooter from "./OnlineStoreFrontFooter";
import { FaStar } from "react-icons/fa";

const encodeURL = (url) =>
  encodeURIComponent(url).replace(/%2F/g, "/").replace(/%3A/g, ":");

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder data for ratings and comments
  const [ratings, setRatings] = useState({
    average: 4.5,
    count: 120,
  });

  const [comments, setComments] = useState([
    {
      id: 1,
      username: "Jan Codrey",
      rating: 5,
      comment: "Damn sheessh.",
      date: "2023-09-15",
    },
    {
      id: 2,
      username: "Cogie",
      rating: 4,
      comment: "Ako si Ekuj nasao.",
      date: "2023-09-10",
    },
    {
      id: 3,
      username: "Andrei",
      rating: 4,
      comment: "Angas pre!.",
      date: "2023-09-10",
    },
  ]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) {
          throw new Error("Product ID is missing.");
        }

        const response = await getProductById(productId);

        if (response.status !== 200) {
          throw new Error(
            response.data.message || "Failed to fetch product details."
          );
        }

        const data = response.data;
        setProduct(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product by ID:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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
    if (quantity > product.stock) {
      setModalInfo({
        isOpen: true,
        productName: product.name,
        stock: product.stock,
      });
      return;
    }

    try {
      await addProductToCart({
        customerId: currentUser.id,
        productId: product.id,
        token,
        quantity,
      });

      navigate(-1);
    } catch (error) {
      console.error(error.message);
      setError("Failed to add product to cart. Please try again.");
    }
  }, [checkAuth, quantity, product, currentUser.id, token, navigate]);

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

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading">Loading product details...</p>
      </div>
    );
  }

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

  const mainImageUrl = product.images?.[0]?.imageUrl
    ? `http://localhost:3002/${encodeURL(product.images[0].imageUrl)}`
    : `http://localhost:3002/default-image.jpg`;

  return (
    <div id="root-product-details-page">
      <OnlineStoreFrontHeader />
      <div className="product-details-container">
        {/* Image Gallery Section */}
        <div className="product-image-section">
          <div className="image-gallery">
            <img
              src={mainImageUrl}
              alt={product.name}
              className="product-main-image"
            />
            <div className="additional-images">
              {product.images?.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:3002/${encodeURL(image.imageUrl)}`}
                  alt={`${product.name} alternate ${index + 1}`}
                  className="product-additional-image"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="product-info-section">
          <h2 className="product-name">{product.name}</h2>
          <div className="rating-section">
            <span className="average-rating">
              {ratings.average.toFixed(1)} <FaStar color="#FFD700" />
            </span>
            <span className="rating-count">({ratings.count} reviews)</span>
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
            <div className="buy-now-section">
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

      {/* Ratings and Comments Section */}
      <div className="ratings-comments-container">
        <div className="ratings-summary">
          <h3>Customer Reviews</h3>
          <div className="ratings-details">
            <span className="average-rating">
              {ratings.average.toFixed(1)} <FaStar color="#FFD700" />
            </span>
            <span className="rating-count">
              based on {ratings.count} reviews
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
                </div>
                <div className="comment-rating">
                  {[...Array(5)].map((star, index) => (
                    <FaStar
                      key={index}
                      color={index < comment.rating ? "#FFD700" : "#ccc"}
                      size={14}
                    />
                  ))}
                </div>
                <p className="comment-text">{comment.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review this product!</p>
          )}
        </div>

        <div className="add-comment-section">
          <h3>Write a Review</h3>
          <p>Feature coming soon!</p>
        </div>
      </div>

      <InsufficientStockModal
        isOpen={modalInfo.isOpen}
        productName={modalInfo.productName}
        stock={modalInfo.stock}
        onClose={closeModal}
      />
      <OnlineStoreFrontFooter />
    </div>
  );
};

export default OnlineProductDetailsPage;
