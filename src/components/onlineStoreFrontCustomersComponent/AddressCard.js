import React, { useState, useEffect, useCallback } from "react";
import "../../styles/onlineStoreFrontCustomersComponent/AddressCard.css";
import { FaPlus, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import AddAddressModal from "./AddAddressModal";
import UpdateAddressModal from "./UpdateAddressModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  addAddress,
  getAddresses,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "../../services/address-api";
import { useAuth } from "../../contexts/AuthContext";

const AddressCard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser, token } = useAuth();
  const userId = currentUser ? currentUser.id : null;

  const fetchAddresses = useCallback(async () => {
    try {
      if (token) {
        const addressesData = await getAddresses(token);
        setAddresses(addressesData);
        setError(null);
      }
    } catch (error) {
      setError(error.message);
      setAddresses([]);
      console.error("Failed to fetch addresses:", error.message);
    }
  }, [token]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddNewAddress = () => {
    setModalOpen(true);
  };

  const handleSaveAddress = async (formData) => {
    try {
      if (!userId || !token) {
        throw new Error("User ID or token is not available");
      }
      await addAddress({
        id: userId,
        token,
        ...formData,
      });
      setModalOpen(false);
      setError(null);
      fetchAddresses();
    } catch (error) {
      console.error("Failed to add address:", error.message);
      setError(error.message);
    }
  };

  const handleUpdateAddress = async (formData) => {
    try {
      if (!userId || !token || !selectedAddressId) {
        throw new Error("User ID, token, or address ID is not available");
      }
      await updateAddress({
        addressId: selectedAddressId,
        customerId: userId,
        token,
        ...formData,
      });
      setUpdateModalOpen(false);
      setSelectedAddressId(null);
      setSelectedAddress(null);
      setError(null);
      fetchAddresses();
    } catch (error) {
      console.error("Failed to update address:", error.message);
      setError(error.message);
    }
  };

  const handleSetAsDefault = async (id) => {
    try {
      await setDefaultAddress({ addressId: id, customerId: userId, token });
      fetchAddresses();
    } catch (error) {
      console.error("Failed to set default address:", error.message);
    }
  };

  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find((address) => address.id === id);
    setSelectedAddress(addressToEdit);
    setSelectedAddressId(id);
    setUpdateModalOpen(true);
  };

  const handleDeleteAddressClick = (id) => {
    setSelectedAddressId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!userId || !token || !selectedAddressId) {
        throw new Error("User ID, token, or address ID is not available");
      }

      await deleteAddress({
        addressId: selectedAddressId,
        customerId: userId,
        token,
      });

      setDeleteModalOpen(false);
      setSelectedAddressId(null);
      setError(null);
      fetchAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error.message);
      setError(error.message);
    }
  };

  return (
    <div id="root-address-card">
      <div className="address-card-container">
        <div className="address-card-header">
          <h2>My Addresses</h2>
          <button className="add-address-button" onClick={handleAddNewAddress}>
            <FaPlus className="add-address-icon" />
            Add New Address
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {Array.isArray(addresses) && addresses.length > 0
          ? addresses.map((address) => {
              return (
                <div
                  key={address.id}
                  className={`address-card ${
                    address.isSetDefaultAddress ? "default-address" : ""
                  }`}
                >
                  <div className="address-details">
                    <p className="address-details-text">
                      <strong>{address.fullName}</strong> |{" "}
                      {address.phoneNumber}
                    </p>
                    {address.addressLine && (
                      <p className="address-details-text">
                        {address.addressLine}
                      </p>
                    )}
                    <p className="address-details-text">
                      {address.barangay}, {address.city}, {address.province},{" "}
                      {address.region}, {address.postalCode}
                    </p>
                    {address.isSetDefaultAddress && (
                      <div className="default-label-container">
                        <p className="default-label">Default</p>
                      </div>
                    )}
                  </div>
                  <div className="address-actions">
                    {!address.isSetDefaultAddress && (
                      <button
                        className="set-default-button"
                        onClick={() => handleSetAsDefault(address.id)}
                      >
                        <FaCheck className="action-icon" /> Set as Default
                      </button>
                    )}
                    <div className="edit-delete-row">
                      <button
                        className="edit-button"
                        onClick={() => handleEditAddress(address.id)}
                      >
                        <FaEdit className="action-icon" /> Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteAddressClick(address.id)}
                      >
                        <FaTrash className="action-icon" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          : !error && <p>No addresses available.</p>}
        <AddAddressModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveAddress}
          isFirstAddress={addresses.length === 0}
        />
        <UpdateAddressModal
          isOpen={isUpdateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          onSave={handleUpdateAddress}
          address={selectedAddress}
          totalAddresses={addresses.length}
        />
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isFirstAddress={addresses.length === 1}
        />
      </div>
    </div>
  );
};

export default AddressCard;
