import React, { useState, useEffect } from "react";
import {
  setDefaultAddress,
  getAddresses,
  addAddress,
} from "../../services/address-api";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/onlineStoreFrontComponents/AddressesModal.css";
import AddAddressModal from "../onlineStoreFrontCustomersComponent/AddAddressModal";

const AddressesModal = ({ isOpen, onClose, onAddressChange }) => {
  const { currentUser, token, updateUserContext } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState("");
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getAddresses(token);
        setAddresses(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching addresses:", err);
      }
    };

    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen, token]);

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress({ addressId, customerId: currentUser.id, token });
      updateUserContext({ defaultAddressId: addressId });
      onAddressChange();
      onClose();
    } catch (err) {
      setError("Failed to set default address. Please try again later.");
      console.error("Error setting default address:", err);
    }
  };

  const openAddAddressModal = () => {
    setError("");
    setIsAddAddressModalOpen(true);
  };
  const closeAddAddressModal = () => setIsAddAddressModalOpen(false);

  const handleSaveAddress = async (formData) => {
    try {
      if (!currentUser || !token) {
        throw new Error("User is not authenticated");
      }
      const response = await addAddress({
        id: currentUser.id,
        token,
        ...formData,
      });
      if (response.address && response.address.isSetDefaultAddress) {
        updateUserContext({ defaultAddressId: response.address.id });
      }
      setError("");
      closeAddAddressModal();
      const data = await getAddresses(token);
      setAddresses(data);
    } catch (error) {
      console.error("Failed to add address:", error.message);
      setError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="root-addresses-modal">
      <div className="address-modal">
        <div className="address-modal-content">
          <h3>My Addresses</h3>
          <button onClick={openAddAddressModal} className="add-address-button">
            Add New Address
          </button>
          <ul className="address-list">
            {Array.isArray(addresses) && addresses.length > 0 ? (
              addresses.map((address) => (
                <li key={address.id} className="address-item">
                  <p className="address-details-text">
                    <strong>
                      {address.fullName} {address.phoneNumber}
                    </strong>
                    <br />
                    {address.addressLine}, {address.barangay}, {address.city},{" "}
                    {address.province}, {address.region} {address.postalCode}
                    <br />
                  </p>
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className={`default-btn ${
                      address.isSetDefaultAddress ? "active" : ""
                    }`}
                    disabled={address.isSetDefaultAddress}
                  >
                    {address.isSetDefaultAddress ? "Default" : "Set as Default"}
                  </button>
                </li>
              ))
            ) : (
              <p>No addresses found. Please add an address.</p>
            )}
          </ul>
          <button onClick={onClose} className="modal-close-btn">
            Close
          </button>
        </div>
      </div>
      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={closeAddAddressModal}
        onSave={handleSaveAddress}
        isFirstAddress={addresses.length === 0}
        errorMessage={error}
      />
    </div>
  );
};

export default AddressesModal;
