import React from "react";
import "../../styles/dashboardComponents/ConfirmStatusChangeModal.css";
import { Button } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const ConfirmStatusChangeModal = ({ order, newStatus, onClose, onConfirm }) => {
  return (
    <div id="root-confirm-status-change-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="close-button" onClick={onClose}>
            <CloseIcon />
          </div>
          <h2>Confirm Status Change</h2>
          <p>
            Are you sure you want to change the status of order{" "}
            <strong>#{order.orderNumber}</strong> to{" "}
            <strong>{newStatus}</strong>?
          </p>
          <div className="button-group">
            <Button
              variant="contained"
              color="primary"
              onClick={() => onConfirm(order.id, newStatus)}
            >
              Confirm
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmStatusChangeModal;
