import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SalesChart from "./SalesChart";
import {
  calculateTotalIncomeInPhysicalStore,
  calculateIncomeByMonthInPhysicalStore,
} from "../services/pos-api";
import { getTopBestSellerItems } from "../services/inventory-api";
import "../styles/DashboardPage.css";

const DashboardPage = () => {
  const [totalIncome, setTotalIncome] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const totalIncomeData = await calculateTotalIncomeInPhysicalStore();
        setTotalIncome(totalIncomeData.data);

        const monthlyIncomeData = await calculateIncomeByMonthInPhysicalStore();
        setMonthlyIncome(
          Object.entries(monthlyIncomeData.data).map(([key, value]) => ({
            month: key,
            grossIncome: parseFloat(value.totalGrossIncome.replace(/,/g, "")),
            netIncome: parseFloat(value.totalNetIncome.replace(/,/g, "")),
          }))
        );
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    const fetchBestSellers = async () => {
      try {
        const bestSellersData = await getTopBestSellerItems();
        setBestSellers(bestSellersData.data); // Ensure this sets the state correctly
      } catch (error) {
        console.error("Error fetching best seller items:", error);
      }
    };

    fetchIncomeData();
    fetchBestSellers();
  }, []);

  const formattedData = monthlyIncome.map((entry) => ({
    name: entry.month,
    grossIncome: entry.grossIncome,
    netIncome: entry.netIncome,
  }));

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>GNF Auto Supply</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/inventory-pending">Pending Stocks</Link>
            </li>
            <li>
              <Link to="/pos">POS System</Link>
            </li>
            <li>
              <Link to="/online-store">Online Store Front</Link>
            </li>
            <li>
              <Link to="/customers">Customers</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            <li>
              <Link to="/inventory">Inventory</Link>
            </li>
            <li>
              <Link to="/billing">Billing</Link>
            </li>
            <li>
              <Link to="/reports">Reports</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <input
            type="text"
            placeholder="Search product..."
            className="search-input"
          />
          <div className="account-info">
            <span>Admin Account</span>
          </div>
        </header>
        <section className="total-income-section">
          <h3>Total Income</h3>
          {totalIncome && (
            <div>
              <p>Gross Income: ₱{totalIncome.totalGrossIncome}</p>
              <p>Net Income: ₱{totalIncome.totalNetIncome}</p>
            </div>
          )}
        </section>
        <section className="sales-section">
          <h3>Sales</h3>
          <div className="sales-chart">
            <SalesChart data={formattedData} />
          </div>
        </section>
        <section className="transactions-section">
          <h3>Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Example data */}
              <tr>
                <td>Payment from Bonnie Green</td>
                <td>Apr 23, 2021</td>
                <td>₱2300</td>
                <td>Completed</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </section>
        <section className="bestsellers-section">
          <h3>Bestsellers</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Sold</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {bestSellers.length > 0 ? (
                bestSellers.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>₱{item.price}</td>
                    <td>{item.totalSold}</td>
                    <td>₱{item.totalProfit}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No best sellers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        <section className="stock-reminder-section">
          <h3>Stock Reminder</h3>
          <ul>
            <li>In Stock: 9,520</li>
            <li>Low Stock: Motor Oil (105), Fanbelt (77)</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
