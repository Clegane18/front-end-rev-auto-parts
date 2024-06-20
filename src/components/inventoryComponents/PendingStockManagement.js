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

  const fetchPendingStocks = async () => {
    try {
      const response = await getAllPendingStocks();
      setPendingStocks(response.data.pendingStocks || []); // Accessing the array correctly
    } catch (error) {
      console.error("Failed to fetch pending stocks", error);
      setPendingStocks([]); // Set pendingStocks to an empty array in case of error
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
    try {
      await cancelPendingStock(id);
      fetchPendingStocks();
    } catch (error) {
      console.error("Failed to cancel stock", error);
    }
  };

  return (
    <div>
      <h2>Pending Stock Management</h2>
      <div>
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
      <div>
        <h3>Pending Stock List</h3>
        <ul>
          {pendingStocks.map((stock) => (
            <li key={stock.id}>
              {stock.productId} - {stock.quantity} - {stock.arrivalDate}
              <button onClick={() => handleConfirmStock(stock.id)}>
                Confirm
              </button>
              <button onClick={() => handleCancelStock(stock.id)}>
                Cancel
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PendingStockManagement;
