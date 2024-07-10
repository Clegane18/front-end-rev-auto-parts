import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SalesChart from "./SalesChart";
import {
  calculateTotalIncomeInPhysicalStore,
  calculateIncomeByMonthInPhysicalStore,
} from "../services/pos-api";
import {
  getTotalStock,
  getTotalItems,
  getLowStockProducts,
} from "../services/inventory-api";
import { getTopBestSellerItems } from "../services/inventory-api";
import "../styles/DashboardPage.css";

// Importing Font Awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faListAlt,
  faCashRegister,
  faStoreAlt,
  faUsers,
  faClipboardList,
  faBox,
  faFileInvoice,
  faChartLine,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

const DashboardPage = () => {
  const [totalIncome, setTotalIncome] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);

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
        setBestSellers(bestSellersData.data);
      } catch (error) {
        console.error("Error fetching best seller items:", error);
      }
    };

    const fetchStockData = async () => {
      try {
        const totalStockData = await getTotalStock();
        console.log("Total Stock Data:", totalStockData); // Log the fetched total stock data
        setTotalStock(totalStockData.totalStocks);

        const totalItemsData = await getTotalItems();
        console.log("Total Items Data:", totalItemsData); // Log the fetched total items data
        setTotalItems(totalItemsData.totalItems);

        const lowStockProductsData = await getLowStockProducts();
        console.log("Low Stock Products Data:", lowStockProductsData); // Log the fetched low stock products data
        setLowStockProducts(lowStockProductsData.data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchIncomeData();
    fetchBestSellers();
    fetchStockData();
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
              <Link to="/">
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
            </li>
            <li>
              <Link to="/inventory-pending">
                <FontAwesomeIcon icon={faListAlt} /> Pending Stocks
              </Link>
            </li>
            <li>
              <Link to="/pos">
                <FontAwesomeIcon icon={faCashRegister} /> POS System
              </Link>
            </li>
            <li>
              <Link to="/online-store">
                <FontAwesomeIcon icon={faStoreAlt} /> Online Store Front
              </Link>
            </li>
            <li>
              <Link to="/customers">
                <FontAwesomeIcon icon={faUsers} /> Customers
              </Link>
            </li>
            <li>
              <Link to="/orders">
                <FontAwesomeIcon icon={faClipboardList} /> Orders
              </Link>
            </li>
            <li>
              <Link to="/inventory">
                <FontAwesomeIcon icon={faBox} /> Inventory
              </Link>
            </li>
            <li>
              <Link to="/billing">
                <FontAwesomeIcon icon={faFileInvoice} /> Billing
              </Link>
            </li>
            <li>
              <Link to="/reports">
                <FontAwesomeIcon icon={faChartLine} /> Reports
              </Link>
            </li>
            <li>
              <Link to="/settings">
                <FontAwesomeIcon icon={faCog} /> Settings
              </Link>
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
                <th>Sales Location</th>
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
                    <td>{item.salesLocation}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No best sellers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        <section className="stock-reminder-section">
          <h3>Stock Reminder</h3>
          <ul>
            <li>In Stock: {totalStock}</li>
            <li>Total Items: {totalItems}</li>
            <li>
              Low Stock:{" "}
              {lowStockProducts.length > 0
                ? lowStockProducts.map((product, index) => (
                    <span key={index}>
                      {product.name} ({product.stock})
                      {index < lowStockProducts.length - 1 ? ", " : ""}
                    </span>
                  ))
                : "No low stock products"}
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
