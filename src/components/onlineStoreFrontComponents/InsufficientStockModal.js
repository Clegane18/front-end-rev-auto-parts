import React from "react";
import PropTypes from "prop-types";
import "../../styles/onlineStoreFrontComponents/InsufficientStockModal.css";

const InsufficientStockModal = ({ isOpen, productName, stock, onClose }) => {
  if (!isOpen) return null;

  return (
    <div id="root-insufficient-stock-modal" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h2>Insufficient Stock</h2>
        <p className="small-letter">
          The quantity for "{productName}" exceeds the available stock of{" "}
          <strong>{stock}</strong>.
        </p>
        <button className="insuff-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

InsufficientStockModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  productName: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InsufficientStockModal;
