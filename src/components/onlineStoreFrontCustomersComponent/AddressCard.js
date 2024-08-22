import React, { useState, useEffect } from "react";
import "../../styles/onlineStoreFrontCustomersComponent/AddressCard.css";
import { FaPlus, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import AddAddressModal from "./AddAddressModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  addAddress,
  getAddresses,
  deleteAddress,
  setDefaultAddress,
} from "../../services/address-api";
import { useAuth } from "../../contexts/AuthContext";

const AddressCard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser, token } = useAuth();
  const userId = currentUser ? currentUser.id : null;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (token) {
          const response = await getAddresses(token);
          setAddresses(response.data);
          setError(null);
        }
      } catch (error) {
        setError(error.message);
        setAddresses([]);
        console.error("Failed to fetch addresses:", error.message);
      }
    };

    fetchAddresses();
  }, [token]);

  const handleAddNewAddress = () => {
    setModalOpen(true);
  };

  const handleSaveAddress = async (formData) => {
    try {
      if (!userId || !token) {
        throw new Error("User ID or token is not available");
      }
      const newAddress = await addAddress({
        id: userId,
        token,
        ...formData,
      });
      setAddresses([...addresses, newAddress.address]);
      setModalOpen(false);
      setError(null);
    } catch (error) {
      console.error("Failed to add address:", error.message);
      setError(error.message);
    }
  };

  const handleSetAsDefault = async (id) => {
    try {
      // Use currentUser and token instead of the undefined user variable
      await setDefaultAddress({ addressId: id, customerId: userId, token });

      // Update the state only after a successful API call
      const updatedAddresses = addresses.map((address) => ({
        ...address,
        isSetDefaultAddress: address.id === id,
      }));
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Failed to set default address:", error.message);
      // Optionally, handle the error (e.g., show a notification to the user)
    }
  };

  const handleEditAddress = (id) => {
    console.log(`Edit Address ${id}`);
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

      setAddresses(
        addresses.filter((address) => address.id !== selectedAddressId)
      );
      setDeleteModalOpen(false);
      setSelectedAddressId(null);
      setError(null);
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
              console.log("Address information:", address);

              return (
                <div
                  key={address.id}
                  className={`address-card ${
                    address.isSetDefaultAddress ? "default-address" : ""
                  }`}
                >
                  <div className="address-details">
                    <p>
                      <strong className="full-name">{address.fullName}</strong>{" "}
                      |{address.phoneNumber}
                    </p>
                    {address.addressLine && <p>{address.addressLine}</p>}
                    <p>
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
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

export default AddressCard;
