import React from "react";
import ProductManagement from "./ProductManagement";
import "../../styles/inventoryComponents/InventoryManagementPage.css";

const InventoryManagementPage = () => {
  return (
    <div className="inventory-management-page">
      <ProductManagement />
    </div>
  );
};

export default InventoryManagementPage;
