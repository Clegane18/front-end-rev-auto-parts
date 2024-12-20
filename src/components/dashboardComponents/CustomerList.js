import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllCustomers,
  toggleCustomerStatus,
  deleteCustomerById,
} from "../../services/online-store-front-customer-api";
import "../../styles/dashboardComponents/CustomerList.css";
import logo from "../../assets/g&f-logo.png";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  Visibility as EyeIcon,
  Delete as DeleteIcon,
  Block as SuspendIcon,
  CheckCircle as ActivateIcon,
} from "@mui/icons-material";
import PurchaseHistoryModal from "./PurchaseHistoryModal";
import ConfirmDeleteCustomerModal from "./ConfirmDeleteCustomerModal";
import ConfirmToggleStatusModal from "./ConfirmToggleStatusModal";
import { useLoading } from "../../contexts/LoadingContext";
import SuccessModal from "../SuccessModal";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [customerToToggle, setCustomerToToggle] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const { authToken } = useAdminAuth();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const response = await getAllCustomers(authToken);
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [authToken, setIsLoading]);

  const handleToggleStatus = async (customerId, currentStatus) => {
    try {
      setIsLoading(true);

      const response = await toggleCustomerStatus(
        customerId,
        currentStatus,
        authToken
      );

      const updatedCustomer = response.data;

      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === customerId ? updatedCustomer : customer
        )
      );

      handleCloseToggleModal();

      setSuccessMessage(
        `Customer status has been successfully ${
          updatedCustomer.accountStatus === "Active" ? "activated" : "suspended"
        }.`
      );
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating status:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (customerId) => {
    setSelectedCustomerId(customerId);
  };

  const handleCloseModal = () => {
    setSelectedCustomerId(null);
  };

  const handleOpenDeleteModal = (customer) => {
    setCustomerToDelete(customer);
  };

  const handleCloseDeleteModal = () => {
    setCustomerToDelete(null);
  };

  const handleOpenToggleModal = (customer) => {
    setCustomerToToggle(customer);
  };

  const handleCloseToggleModal = () => {
    setCustomerToToggle(null);
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      setIsLoading(true);
      await deleteCustomerById(customerId, authToken);
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== customerId)
      );
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting customer:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div id="root-customer-list">
      <div className="customer-list-container">
        <div className="header">
          <div className="header-left">
            <img
              src={logo}
              alt="Back"
              className="logo-back-button"
              onClick={() => navigate("/dashboard")}
            />
            <h1>Customer List</h1>
          </div>
        </div>
        <div className="table-container">
          <table className="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Account Status</th>
                <th>Date Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.username}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phoneNumber || "No phone number"}</td>
                  <td>{customer.accountStatus}</td>
                  <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td className="action-column">
                    <Tooltip title="View Purchase History">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(customer.id)}
                      >
                        <EyeIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        customer.accountStatus === "Active"
                          ? "Suspend"
                          : "Activate"
                      }
                    >
                      <IconButton
                        color="secondary"
                        onClick={() => handleOpenToggleModal(customer)}
                      >
                        {customer.accountStatus === "Active" ? (
                          <SuspendIcon />
                        ) : (
                          <ActivateIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteModal(customer)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSuccessModal && (
        <SuccessModal
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {selectedCustomerId && (
        <PurchaseHistoryModal
          customerId={selectedCustomerId}
          onClose={handleCloseModal}
        />
      )}

      {customerToDelete && (
        <ConfirmDeleteCustomerModal
          customer={customerToDelete}
          onClose={handleCloseDeleteModal}
          onConfirm={() => handleDeleteCustomer(customerToDelete.id)}
        />
      )}

      {customerToToggle && (
        <ConfirmToggleStatusModal
          customer={customerToToggle}
          onClose={handleCloseToggleModal}
          onConfirm={() =>
            handleToggleStatus(
              customerToToggle.id,
              customerToToggle.accountStatus
            )
          }
        />
      )}
    </div>
  );
};

export default CustomerList;
