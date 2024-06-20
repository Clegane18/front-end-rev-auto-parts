import React, { useState, useEffect } from "react";
import {
  getAllPendingStocks,
  addPendingStock,
  confirmStock,
  cancelPendingStock,
} from "../../services/inventory-api";
import "../../styles/inventoryComponents/PendingStockManagement.css";

const PendingStockManagement = () => {
  const [pendingStocks, setPendingStocks] = useState([]);
  const [newPendingStock, setNewPendingStock] = useState({
    productId: "",
    quantity: 0,
    arrivalDate: "",
  });

  useEffect(() => {
    fetchPendingStocks();
  }, []);

  // Fetch all pending stocks
  const fetchPendingStocks = async () => {
    try {
      const response = await getAllPendingStocks();
      setPendingStocks(response.data.pendingStocks || []);
    } catch (error) {
      console.error("Failed to fetch pending stocks", error);
      setPendingStocks([]);
    }
  };

  // Add a new pending stock
  const handleAddPendingStock = async () => {
    try {
      await addPendingStock(newPendingStock);
      fetchPendingStocks();
      setNewPendingStock({ productId: "", quantity: 0, arrivalDate: "" });
    } catch (error) {
      console.error("Failed to add pending stock", error);
    }
  };

  // Confirm a pending stock
  const handleConfirmStock = async (id) => {
    try {
      await confirmStock(id);
      fetchPendingStocks();
    } catch (error) {
      console.error("Failed to confirm stock", error);
    }
  };

  // Cancel a pending stock
  const handleCancelStock = async (id) => {
    try {
      await cancelPendingStock(id);
      fetchPendingStocks();
    } catch (error) {
      console.error("Failed to cancel stock", error);
    }
  };

  return (
    <div className="pending-stock-container">
      <h2>Pending Stock Management</h2>

      {/* Section: Add Pending Stock */}
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
          placeholder="Arrival Date"
          value={newPendingStock.arrivalDate}
          onChange={(e) =>
            setNewPendingStock({
              ...newPendingStock,
              arrivalDate: e.target.value,
            })
          }
        />
        <button onClick={handleAddPendingStock}>Add Pending Stock</button>
      </div>

      {/* Section: Pending Stock List */}
      <div className="pending-stock-list">
        <h3>Pending Stock List</h3>
        <ul>
          {pendingStocks.map((stock) => (
            <li key={stock.id}>
              {stock.productId} - {stock.quantity} - {stock.arrivalDate}
              <div>
                <button onClick={() => handleConfirmStock(stock.id)}>
                  Confirm
                </button>
                <button
                  className="cancel"
                  onClick={() => handleCancelStock(stock.id)}
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PendingStockManagement;
