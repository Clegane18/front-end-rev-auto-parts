import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllPendingStocks,
  addPendingStock,
  confirmStock,
  cancelPendingStock,
  updateArrivalDate,
} from "../../services/inventory-api";
import "../../styles/inventoryComponents/PendingStockManagement.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faEdit,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const PendingStockManagement = () => {
  const [pendingStocks, setPendingStocks] = useState([]);
  const [newPendingStock, setNewPendingStock] = useState({
    productId: "",
    quantity: 0,
    arrivalDate: "",
  });
  const [editingStockId, setEditingStockId] = useState(null);
  const [newDate, setNewDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingStocks();
  }, []);

  const fetchPendingStocks = async () => {
    try {
      const response = await getAllPendingStocks();
      setPendingStocks(response.data.pendingStocks || []);
    } catch (error) {
      console.error("Failed to fetch pending stocks", error);
    }
  };

  const handleAddPendingStock = async () => {
    try {
      await addPendingStock(newPendingStock);
      fetchPendingStocks();
      setNewPendingStock({ productId: "", quantity: 0, arrivalDate: "" });
    } catch (error) {
      console.error("Failed to add pending stock", error);
    }
  };

  const handleConfirmStock = async (id) => {
    try {
      await confirmStock(id);
      fetchPendingStocks();
    } catch (error) {
      console.error("Failed to confirm stock", error);
    }
  };

  const handleCancelStock = async (id) => {
    if (window.confirm("Are you sure you want to cancel this stock?")) {
      try {
        await cancelPendingStock(id);
        fetchPendingStocks();
      } catch (error) {
        console.error("Failed to cancel stock", error);
      }
    }
  };

  const handleUpdateArrivalDate = async (pendingStockId) => {
    try {
      await updateArrivalDate(pendingStockId, newDate);
      fetchPendingStocks();
      setEditingStockId(null);
      setNewDate("");
    } catch (error) {
      console.error(
        "Failed to update arrival date",
        error.response?.data || error.message || error
      );
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="pending-stock-container">
      <div className="store-name" onClick={handleBack}>
        G&F Auto Supply
      </div>
      <h2>Pending Stock Management</h2>
      <div className="pending-stock-form">
        <h3>Add Pending Stock</h3>
        <input
          type="text"
          placeholder="Product ID"
          value={newPendingStock.productId}
          onChange={(e) =>
            setNewPendingStock({
              ...newPendingStock,
              productId: e.target.value,
            })
          }
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newPendingStock.quantity}
          onChange={(e) =>
            setNewPendingStock({
              ...newPendingStock,
              quantity: parseInt(e.target.value),
            })
          }
        />
        <input
          type="date"
          value={newPendingStock.arrivalDate}
          onChange={(e) =>
            setNewPendingStock({
              ...newPendingStock,
              arrivalDate: e.target.value,
            })
          }
        />
        <button onClick={handleAddPendingStock}>
          <FontAwesomeIcon icon={faSave} /> Add Pending Stock
        </button>
      </div>
      <div className="pending-stock-list">
        <h3>Pending Stock List</h3>
        <div className="pending-stock-header">
          <div>ProdID</div>
          <div>Qty</div>
          <div>ETA</div>
          <div>Actions</div>
        </div>
        {pendingStocks.map((stock) => (
          <div key={stock.id} className="pending-stock-item">
            <div>{stock.productId}</div>
            <div>{stock.quantity}</div>
            <div>
              {editingStockId === stock.id ? (
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              ) : (
                new Date(stock.arrivalDate).toLocaleDateString()
              )}
            </div>
            <div className="actions">
              {editingStockId === stock.id ? (
                <button
                  className="save"
                  onClick={() => handleUpdateArrivalDate(stock.id)}
                >
                  <FontAwesomeIcon icon={faSave} /> Save
                </button>
              ) : (
                <button
                  className="edit"
                  onClick={() => {
                    setEditingStockId(stock.id);
                    setNewDate(
                      new Date(stock.arrivalDate).toISOString().split("T")[0]
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )}
              <button
                className="confirm"
                onClick={() => handleConfirmStock(stock.id)}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                className="cancel"
                onClick={() => handleCancelStock(stock.id)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingStockManagement;
