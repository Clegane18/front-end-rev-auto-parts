import React from "react";
import "../../styles/onlineStoreFrontCustomersComponent/AddressCard.css";
import { FaPlus, FaTrash, FaEdit, FaCheck } from "react-icons/fa";

const AddressCard = () => {
  // Example addresses, replace with actual data or props
  const addresses = [
    {
      id: 1,
      addressLine1: "123 Main St",
      addressLine2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      isDefault: true,
    },
    {
      id: 2,
      addressLine1: "456 Elm St",
      addressLine2: "",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "USA",
      isDefault: false,
    },
  ];

  const handleAddNewAddress = () => {
    // Logic for adding a new address
    console.log("Add New Address button clicked");
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

      {addresses.map((address) => (
        <div key={address.id} className="address-card">
          <div className="address-details">
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p>{address.country}</p>
          </div>

          <div className="address-actions">
            {!address.isDefault && (
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
      ))}
    </div>
  );
};

export default AddressCard;
