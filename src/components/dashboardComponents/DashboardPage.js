import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SalesChart from "./SalesChart";
import { calculateIncomeByMonthInPhysicalStore } from "../../services/pos-api";
import {
  getTotalStock,
  getTotalItems,
  getLowStockProducts,
  getTopBestSellerItems,
} from "../../services/inventory-api";
import {
  getTotalNumberTransactions,
  getTotalCountOfTransactionsFromPOS,
  getTotalCountOfTransactionsFromOnline,
  getTodaysTransactions,
} from "../../services/transaction-api";
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
  faChartLine,
  faCheckCircle,
  faArchive,
  faExclamationTriangle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import LogOutConfirmationModal from "./LogOutConfirmationModal";
import { formatCurrency } from "../../utils/formatCurrency";

const DashboardPage = () => {
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [posTransactions, setPosTransactions] = useState(0);
  const [onlineTransactions, setOnlineTransactions] = useState(0);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [todaysTransactions, setTodaysTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
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

    const fetchTransactionData = async () => {
      try {
        const totalTransactionsData = await getTotalNumberTransactions();
        setTotalTransactions(totalTransactionsData.TotalTransactions || 0);

        const posTransactionsData = await getTotalCountOfTransactionsFromPOS();
        setPosTransactions(posTransactionsData.TotalCountOfTransactions || 0);

        const onlineTransactionsData =
          await getTotalCountOfTransactionsFromOnline();
        setOnlineTransactions(
          onlineTransactionsData.TotalCountOfTransactions || 0
        );

        const todaysTransactionsData = await getTodaysTransactions();
        setTodaysTransactions(todaysTransactionsData.TodaysTransactions);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchIncomeData();
    fetchBestSellers();
    fetchStockData();
    fetchTransactionData();
  }, []);

  const currentMonthIncome = monthlyIncome.find((entry) => {
    const currentDate = new Date();
    const currentMonthYear = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }`;
    return entry.month === currentMonthYear;
  });

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
          <h2>G&F Auto Supply</h2>
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
              <Link to="/reports">
                <FontAwesomeIcon icon={faChartLine} /> Reports
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
              <SalesChart data={monthlyIncome} />
            </div>
          </div>
        </section>
        <section className="todays-transactions-section">
          <div className="section-container">
            <h3>Today's Transactions</h3>
            <table>
              <thead>
                <tr>
                  <th>Transaction No</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Total Items</th>
                  <th>Sales Location</th>
                </tr>
              </thead>
              <tbody>
                {todaysTransactions.length > 0 ? (
                  todaysTransactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{transaction.transactionNo}</td>
                      <td>{transaction.transactionType}</td>
                      <td>{transaction.transactionStatus}</td>
                      <td>
                        {new Date(transaction.transactionDate).toLocaleString()}
                      </td>
                      <td>{formatCurrency(transaction.totalAmount)}</td>
                      <td>{transaction.totalItemsBought}</td>
                      <td>{transaction.salesLocation}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No transactions today</td>
                  </tr>
                )}
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
                      <td>{formatCurrency(item.price)}</td>
                      <td>{item.totalSold}</td>
                      <td>{formatCurrency(item.totalProfit)}</td>
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
            <div className="low-stock-list">
              <div className="low-stock-list-item in-stock">
                <FontAwesomeIcon icon={faCheckCircle} /> In Stock: {totalStock}
              </div>
              <div className="low-stock-list-item total-items">
                <FontAwesomeIcon icon={faArchive} /> Total Items: {totalItems}
              </div>
              <div className="low-stock-list-item low-stock">
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
              </div>
            </div>
          </div>
          <div className="transaction-overview">
            <h3>Today's transactions Overview</h3>
            <div className="transactions-details">
              <div className="transactions-item">
                <div className="transaction-details-total">
                  <p>
                    Total Transactions:{" "}
                    {totalTransactions !== null ? totalTransactions : "0"}
                  </p>
                </div>
                <div className="transaction-details-pos">
                  <p>
                    Total POS Transactions:{" "}
                    {posTransactions !== null ? posTransactions : "0"}
                  </p>
                </div>
                <div className="transaction-details-online">
                  <p>
                    Total Online Transactions:{" "}
                    {onlineTransactions !== null ? onlineTransactions : "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="monthly-income">
            <h3>Monthly Income</h3>
            {currentMonthIncome ? (
              <div className="monthly-income-details">
                <div className="monthly-income-item">
                  <div className="monthly-income-details-item">
                    <p>Month: {currentMonthIncome.month}</p>
                  </div>
                  <div className="monthly-income-details-item">
                    <p>
                      Net Income: ₱
                      {currentMonthIncome.netIncome.toLocaleString()}
                    </p>
                  </div>
                  <div className="monthly-income-details-item">
                    <p>
                      Gross Income: ₱
                      {currentMonthIncome.grossIncome.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p>No income data available for the current month</p>
            )}
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
