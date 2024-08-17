import React, { useState, useEffect } from "react";
import "../../styles/onlineStoreFrontCustomersComponent/AddressCard.css";
import { FaPlus, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import AddAddressModal from "./AddAddressModal";
import { addAddress, getAddresses } from "../../services/address-api";
import { useAuth } from "../../contexts/AuthContext";

const AddressCard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
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
    console.log("User ID:", userId);
    console.log("Token:", token);
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
    }
  };

  const handleSetAsDefault = (id) => {
    // Logic for setting the address as default
    console.log(`Set Address ${id} as Default`);
  };

  const handleEditAddress = (id) => {
    // Logic for editing an address
    console.log(`Edit Address ${id}`);
  };

  const handleDeleteAddress = (id) => {
    // Logic for deleting an address
    console.log(`Delete Address ${id}`);
  };

  return (
    <div className="address-card-container">
      <div className="address-card-header">
        <h2>My Addresses</h2>
        <button className="add-address-button" onClick={handleAddNewAddress}>
          <FaPlus className="add-address-icon" />
          Add New Address
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}{" "}
      {Array.isArray(addresses) && addresses.length > 0
        ? addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div className="address-details">
                <p>
                  {address.fullName} {address.phoneNumber}
                </p>
                {address.addressLine && <p>{address.addressLine}</p>}
                <p>
                  {address.barangay}, {address.city}, {address.province},{" "}
                  {address.region}, {address.postalCode}
                </p>
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
                <button
                  className="edit-button"
                  onClick={() => handleEditAddress(address.id)}
                >
                  <FaEdit className="action-icon" /> Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <FaTrash className="action-icon" /> Delete
                </button>
              </div>
            </div>
          ))
        : !error && <p>No addresses available.</p>}
      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveAddress}
      />
    </div>
  );
};

export default AddressCard;
