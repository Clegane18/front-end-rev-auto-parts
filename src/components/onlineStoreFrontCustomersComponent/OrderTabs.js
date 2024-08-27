import React, { useState } from "react";
import "../../styles/onlineStoreFrontCustomersComponent/OrderTabs.css";

const OrderTabs = () => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    "All",
    "To Pay",
    "To Ship",
    "To Receive",
    "Completed",
    "Cancelled",
  ];

  return (
    <div id="root-order-tabs">
      <div className="order-tabs-container">
        <ul className="order-tabs">
          {tabs.map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
        <div className="tab-content">
          {activeTab === "All" && <div>No orders yet</div>}
          {activeTab === "To Pay" && <div>To Pay orders content here</div>}
          {activeTab === "To Ship" && <div>To Ship orders content here</div>}
          {activeTab === "To Receive" && (
            <div>To Receive orders content here</div>
          )}
          {activeTab === "Completed" && (
            <div>Completed orders content here</div>
          )}
          {activeTab === "Cancelled" && (
            <div>Cancelled orders content here</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTabs;
