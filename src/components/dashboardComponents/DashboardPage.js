import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SalesChart from "./SalesChart";
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
  calculateTotalIncomeByMonth,
  calculateTotalIncome,
} from "../../services/transaction-api";
import "../../styles/dashboardComponents/DashboardPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListAlt,
  faCashRegister,
  faStoreAlt,
  faUsers,
  faClipboardList,
  faBox,
  faCheckCircle,
  faArchive,
  faExclamationTriangle,
  faSignOutAlt,
  faPrint,
  faTimes,
  faFileAlt,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import LogOutConfirmationModal from "./LogOutConfirmationModal";
import { formatCurrency } from "../../utils/formatCurrency";
import useAuthentication from "../LoginComponents/useAuthentication";

const DashboardPage = () => {
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [bestSellers, setBestSellers] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [posTransactions, setPosTransactions] = useState(0);
  const [onlineTransactions, setOnlineTransactions] = useState(0);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [todaysTransactions, setTodaysTransactions] = useState([]);
  const [isReportMode, setIsReportMode] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const stockReminderRef = useRef();
  const { logout } = useAuthentication();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const monthlyIncomeData = await calculateTotalIncomeByMonth();
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
    const fetchTotalIncome = async () => {
      try {
        const { data } = await calculateTotalIncome();
        setTotalIncome({
          grossIncome: data.totalGrossIncome,
          netIncome: data.totalNetIncome,
        });
      } catch (error) {
        console.error("Error calculating total income:", error);
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
    fetchTotalIncome();
    fetchBestSellers();
    fetchStockData();
    fetchTransactionData();
  }, []);

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeLogoutModal();
    navigate("/login");
  };

  const toggleReportMode = () => {
    setIsReportMode(!isReportMode);
    setSelectedReports([]);
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedReports([]);
    } else {
      setSelectedReports([
        "sales-section",
        "todays-transactions-section",
        "bestsellers-section",
        "stock-reminder-low-stock-reminder",
        "transaction-overview",
        "monthly-income",
      ]);
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleReportSelection = (report) => {
    setSelectedReports((prev) => {
      const isSelected = prev.includes(report);
      if (isSelected) {
        setIsAllSelected(false);
      }
      return isSelected ? prev.filter((r) => r !== report) : [...prev, report];
    });
  };

  const printReports = () => {
    if (selectedReports.length === 0) {
      alert("Please select at least one report to print.");
      return;
    }

    const printableContent = selectedReports
      .map((report) => document.getElementById(report).outerHTML)
      .join("");

    const storeName = "G&F Auto Supply";
    const issuanceDate = new Date().toLocaleString();
    const newWindow = window.open();
    newWindow.document.write(`
        <html>
          <head>
            <title>Reports</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 20px;
                color: #333;
              }
              header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 2px solid #DF2028;
                padding-bottom: 10px;
              }
              h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
                color: #DF2028;
              }
              p {
                margin: 5px 0;
                font-size: 16px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                border: 1px solid #ccc;
                padding: 10px;
                text-align: left;
                font-size: 14px;
              }
              th {
                background-color: #f2f2f2;
                font-weight: bold;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              @media print {
                @page {
                  margin: 0;
                }
                body {
                  margin: 1cm;
                }
                .no-print {
                  display: none;
                }
                input[type=checkbox] {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <header>
              <h1>${storeName}</h1>
              <p>Reports</p>
              <p>Issuance Date: ${issuanceDate}</p>
            </header>
            ${printableContent}
          </body>
        </html>
      `);
    newWindow.document.close();
    newWindow.print();
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
              <Link to="/upload-products">
                <FontAwesomeIcon icon={faList} /> Products for Upload
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
              <button onClick={openLogoutModal} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <button onClick={toggleReportMode} className="report-button">
            {isReportMode ? (
              <>
                <FontAwesomeIcon icon={faTimes} /> Cancel Report Selection
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPrint} /> Print Reports
              </>
            )}
          </button>
          {isReportMode && (
            <>
              <button onClick={toggleSelectAll} className="report-button">
                {isAllSelected ? "Deselect All" : "Select All"}
              </button>
              <button onClick={printReports} className="report-button">
                <FontAwesomeIcon icon={faFileAlt} /> Generate Report
              </button>
            </>
          )}
        </header>
        <section
          id="sales-section"
          className={`sales-section ${isReportMode ? "wiggle hoverable" : ""} ${
            selectedReports.includes("sales-section") ? "selected" : ""
          }`}
          onClick={() => isReportMode && handleReportSelection("sales-section")}
        >
          <div className="section-container">
            <h3>Sales</h3>
            {isReportMode && (
              <input
                type="checkbox"
                className="report-checkbox"
                checked={selectedReports.includes("sales-section")}
                readOnly
              />
            )}
            <div className="sales-chart">
              <SalesChart data={monthlyIncome} />
            </div>
          </div>
        </section>
        <section
          id="todays-transactions-section"
          className={`todays-transactions-section ${
            isReportMode ? "wiggle hoverable" : ""
          } ${
            selectedReports.includes("todays-transactions-section")
              ? "selected"
              : ""
          }`}
          onClick={() =>
            isReportMode && handleReportSelection("todays-transactions-section")
          }
        >
          <div className="section-container">
            <h3>Today's Transactions</h3>
            {isReportMode && (
              <input
                type="checkbox"
                className="report-checkbox"
                checked={selectedReports.includes(
                  "todays-transactions-section"
                )}
                readOnly
              />
            )}
            <div className="table-container">
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
                          {new Date(
                            transaction.transactionDate
                          ).toLocaleString()}
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
          </div>
        </section>

        <section
          id="bestsellers-section"
          className={`bestsellers-section ${
            isReportMode ? "wiggle hoverable" : ""
          } ${
            selectedReports.includes("bestsellers-section") ? "selected" : ""
          }`}
          onClick={() =>
            isReportMode && handleReportSelection("bestsellers-section")
          }
        >
          <div className="section-container">
            <h3>Top Sellers This Month</h3>
            {isReportMode && (
              <input
                type="checkbox"
                className="report-checkbox"
                checked={selectedReports.includes("bestsellers-section")}
                readOnly
              />
            )}
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
          <div
            id="stock-reminder-low-stock-reminder"
            className={`stock-reminder-low-stock-reminder ${
              isReportMode ? "wiggle hoverable" : ""
            } ${
              selectedReports.includes("stock-reminder-low-stock-reminder")
                ? "selected"
                : ""
            }`}
            onClick={() =>
              isReportMode &&
              handleReportSelection("stock-reminder-low-stock-reminder")
            }
            ref={stockReminderRef}
          >
            <h3>Stock Reminder</h3>
            {isReportMode && (
              <input
                type="checkbox"
                className="report-checkbox"
                checked={selectedReports.includes(
                  "stock-reminder-low-stock-reminder"
                )}
                readOnly
              />
            )}
            <div className="low-stock-list">
              <div className="low-stock-list-item in-stock">
                <span className="no-print">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </span>
                In Stock: {totalStock}
              </div>
              <div className="low-stock-list-item total-items">
                <span className="no-print">
                  <FontAwesomeIcon icon={faArchive} />
                </span>
                Total Items: {totalItems}
              </div>
              <div className="low-stock-list-item low-stock">
                <span className="no-print">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </span>
                Low Stock:{" "}
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.map((product, index) => (
                    <span className="product-name" key={index}>
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

          <div
            id="transaction-overview"
            className={`transaction-overview ${
              isReportMode ? "wiggle hoverable" : ""
            } ${
              selectedReports.includes("transaction-overview") ? "selected" : ""
            }`}
            onClick={() =>
              isReportMode && handleReportSelection("transaction-overview")
            }
          >
            <h3>Today's Transactions Overview</h3>
            {isReportMode && (
              <input
                type="checkbox"
                className="report-checkbox"
                checked={selectedReports.includes("transaction-overview")}
                readOnly
              />
            )}
            <div className="transactions-details">
              <div className="transaction-details-total">
                <p>
                  Total: {totalTransactions !== null ? totalTransactions : "0"}
                </p>
              </div>
              <div className="transaction-details-pos">
                <p>
                  Point of Sale:{" "}
                  {posTransactions !== null ? posTransactions : "0"}
                </p>
              </div>
              <div className="transaction-details-online">
                <p>
                  Online Store Front:{" "}
                  {onlineTransactions !== null ? onlineTransactions : "0"}
                </p>
              </div>
            </div>
          </div>
          <div
            id="total-income"
            className={`total-income ${
              isReportMode ? "wiggle hoverable" : ""
            } ${selectedReports.includes("total-income") ? "selected" : ""}`}
            onClick={() =>
              isReportMode && handleReportSelection("total-income")
            }
          >
            <h3>Total Income</h3>
            {isReportMode && (
              <input
                type="checkbox"
                className="report-checkbox"
                checked={selectedReports.includes("total-income")}
                readOnly
              />
            )}
            {totalIncome ? (
              <div className="income-details">
                <div className="income-item">
                  <div className="income-details-item">
                    <p>
                      Gross Income: ₱{totalIncome.grossIncome.toLocaleString()}
                    </p>
                  </div>
                  <div className="income-details-item">
                    <p>Net Income: ₱{totalIncome.netIncome.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>No income data available</p>
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
