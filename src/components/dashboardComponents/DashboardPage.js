import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SalesChart from "./SalesChart";
import {
  calculateTotalIncomeInPhysicalStore,
  calculateIncomeByMonthInPhysicalStore,
} from "../../services/pos-api";
import {
  getTotalStock,
  getTotalItems,
  getLowStockProducts,
  getTopBestSellerItems,
} from "../../services/inventory-api";
import "../../styles/dashboardComponents/DashboardPage.css";
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
  faCheckCircle,
  faArchive,
  faExclamationTriangle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import LogOutConfirmationModal from "./LogOutConfirmationModal";

const DashboardPage = () => {
  const [totalIncome, setTotalIncome] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

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
        setTotalStock(totalStockData.totalStocks);

        const totalItemsData = await getTotalItems();
        setTotalItems(totalItemsData.totalItems);

        const lowStockProductsData = await getLowStockProducts();
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

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = () => {
    closeLogoutModal();
    navigate("/login");
  };

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
            <li>
              <button onClick={openLogoutModal} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header"></header>
        <section className="sales-section">
          <div className="section-container">
            <h3>Sales</h3>
            <div className="sales-chart">
              <SalesChart data={formattedData} />
            </div>
          </div>
        </section>
        <section className="transactions-section">
          <div className="section-container">
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
                <tr>
                  <td>Payment from Bonnie Green</td>
                  <td>Apr 23, 2021</td>
                  <td>₱2300</td>
                  <td>Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="bestsellers-section">
          <div className="section-container">
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
          </div>
        </section>
        <section className="bottom-section">
          <div className="stock-reminder low-stock-reminder">
            <h3>Stock Reminder</h3>
            <ul className="low-stock-list">
              <li className="low-stock-list-item in-stock">
                <FontAwesomeIcon icon={faCheckCircle} /> In Stock: {totalStock}
              </li>
              <li className="low-stock-list-item total-items">
                <FontAwesomeIcon icon={faArchive} /> Total Items: {totalItems}
              </li>
              <li className="low-stock-list-item low-stock">
                <FontAwesomeIcon icon={faExclamationTriangle} /> Low Stock:{" "}
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.map((product, index) => (
                    <span key={index}>
                      {product.name} ({product.stock})
                      {index < lowStockProducts.length - 1 ? ", " : ""}
                    </span>
                  ))
                ) : (
                  <span className="no-low-stock">No low stock products</span>
                )}
              </li>
            </ul>
          </div>
          <div className="total-income">
            <h3>Total Income</h3>
            <div className="total-income-details">
              {totalIncome && (
                <div className="total-income-details-item">
                  <p>Gross Income: ₱{totalIncome.totalGrossIncome}</p>
                </div>
              )}
              {totalIncome && (
                <div className="total-income-details-item">
                  <p>Net Income: ₱{totalIncome.totalNetIncome}</p>
                </div>
              )}
            </div>
          </div>
          <div className="monthly-income">
            <h3>Monthly Income</h3>
            <div className="monthly-income-details">
              {formattedData.map((entry) => (
                <div key={entry.name} className="monthly-income-item">
                  <div className="monthly-income-details-item">
                    <p>Month: {entry.name}</p>
                  </div>
                  <div className="monthly-income-details-item">
                    <p>Net Income: ₱{entry.netIncome.toLocaleString()}</p>
                  </div>
                  <div className="monthly-income-details-item">
                    <p>Gross Income: ₱{entry.grossIncome.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      {isLogoutModalOpen && (
        <LogOutConfirmationModal
          isOpen={isLogoutModalOpen}
          onClose={closeLogoutModal}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
};

export default DashboardPage;
