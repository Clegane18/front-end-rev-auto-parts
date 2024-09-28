import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllPendingStocks,
  addPendingStock,
  confirmStock,
  cancelPendingStock,
  updateArrivalDate,
  getAllProducts,
} from "../../services/inventory-api";
import "../../styles/inventoryComponents/PendingStockManagement.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faEdit,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/g&f-logo.png";

const PendingStockManagement = () => {
  const [pendingStocks, setPendingStocks] = useState([]);
  const [newPendingStock, setNewPendingStock] = useState({
    productName: "",
    quantity: 0,
    arrivalDate: "",
  });
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingStockId, setEditingStockId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await getAllProducts();
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        console.error("API response data is not an array:", response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    }
  }, []);

  const fetchPendingStocks = useCallback(async () => {
    try {
      const response = await getAllPendingStocks();
      setPendingStocks(response.data.pendingStocks || []);
    } catch (error) {
      console.error("Failed to fetch pending stocks", error);
    }
  }, []);

  useEffect(() => {
    fetchPendingStocks();
    fetchProducts();
  }, [fetchPendingStocks, fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm) {
      const filteredSuggestions = products.filter((product) =>
        product.name.toLowerCase().includes(debouncedTerm.toLowerCase())
      );
      setProductSuggestions(filteredSuggestions);
    } else {
      setProductSuggestions([]);
    }
  }, [debouncedTerm, products]);

  const handleAddPendingStock = async () => {
    const { productName, quantity, arrivalDate } = newPendingStock;

    if (!productName || !quantity || !arrivalDate) {
      alert("Please fill in all fields.");
      return;
    }

    const updatedPendingStock = {
      productName,
      quantity,
      arrivalDate,
    };

    try {
      await addPendingStock(updatedPendingStock);
      fetchPendingStocks();
      setNewPendingStock({ productName: "", quantity: 0, arrivalDate: "" });
    } catch (error) {
      console.error(
        "Failed to add pending stock",
        error.response?.data || error.message || error
      );
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
    if (!newDate) {
      alert("Please select a valid date.");
      return;
    }

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

  const handleProductNameChange = (e) => {
    const name = e.target.value;
    setNewPendingStock({ ...newPendingStock, productName: name });
    setSearchTerm(name);
  };

  const handleSuggestionClick = (suggestion) => {
    setNewPendingStock({ ...newPendingStock, productName: suggestion.name });
    setProductSuggestions([]);
    setSearchTerm("");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div id="pending-stock-root">
      <div className="pending-stock-container">
        <div className="control-panel">
          <div className="shop-info" onClick={handleBack}>
            <img src={logo} alt="G&F Auto Supply" className="shop-logo" />
          </div>
          <h1>Pending Stock Management</h1>
        </div>
        <div className="pending-stock-form">
          <h2>Add Pending Stock</h2>
          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                placeholder="Product Name"
                value={newPendingStock.productName}
                onChange={handleProductNameChange}
              />
              {productSuggestions.length > 0 && (
                <div className="suggestions">
                  {productSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="number"
              placeholder="Quantity"
              value={newPendingStock.quantity}
              className="quantity-textbox"
              onChange={(e) =>
                setNewPendingStock({
                  ...newPendingStock,
                  quantity: parseInt(e.target.value) || 0,
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
          </div>
          <button className="primary-button" onClick={handleAddPendingStock}>
            <FontAwesomeIcon icon={faSave} /> Add Pending Stock
          </button>
        </div>
        <div className="pending-stock-list">
          <h2>Pending Stock List</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>ETA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingStocks.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No pending stocks available.
                    </td>
                  </tr>
                ) : (
                  pendingStocks.map((stock) => (
                    <tr key={stock.id}>
                      <td>{stock.productName}</td>
                      <td>{stock.quantity}</td>
                      <td>
                        {editingStockId === stock.id ? (
                          <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                          />
                        ) : (
                          new Date(stock.arrivalDate).toLocaleDateString()
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {editingStockId === stock.id ? (
                            <button
                              className="primary-button small"
                              onClick={() => handleUpdateArrivalDate(stock.id)}
                            >
                              <FontAwesomeIcon icon={faSave} /> Save
                            </button>
                          ) : (
                            <button
                              className="secondary-button small"
                              onClick={() => {
                                setEditingStockId(stock.id);
                                setNewDate(
                                  new Date(stock.arrivalDate)
                                    .toISOString()
                                    .split("T")[0]
                                );
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} /> Edit
                            </button>
                          )}
                          <button
                            className="success-button small"
                            onClick={() => handleConfirmStock(stock.id)}
                          >
                            <FontAwesomeIcon icon={faCheck} /> Confirm
                          </button>
                          <button
                            className="danger-button small"
                            onClick={() => handleCancelStock(stock.id)}
                          >
                            <FontAwesomeIcon icon={faTimes} /> Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingStockManagement;
