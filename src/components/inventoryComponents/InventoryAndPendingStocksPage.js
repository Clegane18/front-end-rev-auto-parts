import React from "react";
import ProductManagement from "./ProductManagement";
import PendingStockManagement from "./PendingStockManagement";

const InventoryAndPendingStocksPage = () => {
  return (
    <div>
      <h2>Inventory and Pending Stock Management</h2>
      <div>
        <h3>Inventory Management</h3>
        <ProductManagement />
      </div>
      <div>
        <h3>Pending Stock Management</h3>
        <PendingStockManagement />
      </div>
    </div>
  );
};

export default InventoryAndPendingStocksPage;
