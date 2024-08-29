import React, { useState, useEffect } from "react";
import { setDefaultAddress, getAddresses } from "../../services/address-api";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/onlineStoreFrontComponents/AddressesModal.css";

const AddressesModal = ({ isOpen, onClose, onAddressChange }) => {
  const { currentUser, token, updateUserContext } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState("");

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

  if (!isOpen) return null;

  return (
    <div className="address-modal">
      <div className="address-modal-content">
        <h3>My Addresses</h3>
        {error && <p className="error-message">{error}</p>}
        <ul className="address-list">
          {Array.isArray(addresses) && addresses.length > 0 ? (
            addresses.map((address) => (
              <li key={address.id} className="address-item">
                <p>
                  <strong>{address.fullName}</strong> (+63){" "}
                  {address.phoneNumber}
                  <br />
                  {address.addressLine}, {address.barangay}, {address.city},{" "}
                  {address.province}, {address.region} {address.postalCode}
                  <br />
                  <span className="address-label">{address.label}</span>
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
  );
};

export default AddressesModal;
