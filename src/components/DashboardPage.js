import React from "react";
import { Link } from "react-router-dom";
import "../styles/DashboardPage.css";

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <nav>
        <ul className="dashboard-nav">
          <li>
            <Link to="/pos" className="dashboard-link">
              POS System
            </Link>
          </li>
          <li>
            <Link to="/inventory" className="dashboard-link">
              Inventory Management
            </Link>
          </li>
          <li>
            <Link to="/inventory-pending" className="dashboard-link">
              Pending Stock Management
            </Link>
          </li>
          <li>
            <Link to="/online-store" className="dashboard-link">
              Online Store Front
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DashboardPage;
