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
} from "../../services/transaction-api";
import { getCancellationCounts } from "../../services/order-api";
import "../../styles/dashboardComponents/DashboardPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListAlt,
  faCashRegister,
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
  faUserEdit,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import LogOutConfirmationModal from "./LogOutConfirmationModal";
import { formatCurrency } from "../../utils/formatCurrency";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { useLoading } from "../../contexts/LoadingContext";

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
  const [isReportMode, setIsReportMode] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [cancellationCounts, setCancellationCounts] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const toggleDatePicker = () => setIsDatePickerVisible(!isDatePickerVisible);

  const [error] = useState(null);
  const stockReminderRef = useRef();
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      console.error("Invalid date format");
      return null;
    }
    return parsedDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    const formattedDate = selectedDate ? formatDate(selectedDate) : null;
    const dateParam = formattedDate || null;

    const fetchDailyData = async (dateParam) => {
      try {
        const [
          totalTransactionsResult,
          posTransactionsResult,
          onlineTransactionsResult,
          todaysTransactionsResult,
        ] = await Promise.all([
          getTotalNumberTransactions(dateParam),
          getTotalCountOfTransactionsFromPOS(dateParam),
          getTotalCountOfTransactionsFromOnline(dateParam),
          getTodaysTransactions(dateParam),
        ]);

        processApiResponse(
          totalTransactionsResult,
          setTotalTransactions,
          "totalTransactions",
          0,
          true
        );
        processApiResponse(
          posTransactionsResult,
          setPosTransactions,
          "TotalCountOfTransactions",
          0,
          true
        );
        processApiResponse(
          onlineTransactionsResult,
          setOnlineTransactions,
          "TotalCountOfTransactions",
          0,
          true
        );
        processApiResponse(
          todaysTransactionsResult,
          setTodaysTransactions,
          "TodaysTransactions",
          [],
          true
        );
      } catch (error) {
        console.error("Error fetching daily data:", error);
      }
    };

    const fetchMonthlyAndOverallData = async (dateParam) => {
      try {
        const [
          incomeDataResult,
          bestSellersResult,
          stockDataResults,
          cancellationDataResult,
        ] = await Promise.all([
          calculateTotalIncomeByMonth(dateParam),
          getTopBestSellerItems(dateParam),
          Promise.all([
            getTotalStock(dateParam),
            getTotalItems(dateParam),
            getLowStockProducts(dateParam),
          ]),
          getCancellationCounts(dateParam),
        ]);

        if (incomeDataResult?.status === 200 && incomeDataResult.data) {
          const income = Object.entries(incomeDataResult.data).map(
            ([key, value]) => ({
              month: key,
              grossIncome: parseFloat(value.totalGrossIncome.replace(/,/g, "")),
              netIncome: parseFloat(value.totalNetIncome.replace(/,/g, "")),
            })
          );
          setMonthlyIncome(income);
        }

        processApiResponse(
          bestSellersResult,
          setBestSellers,
          "data",
          null,
          false
        );

        const [totalStockResult, totalItemsResult, lowStockResult] =
          stockDataResults;
        processApiResponse(
          totalStockResult,
          setTotalStock,
          "totalStocks",
          null,
          false
        );
        processApiResponse(
          totalItemsResult,
          setTotalItems,
          "totalItems",
          null,
          false
        );
        processApiResponse(
          lowStockResult,
          setLowStockProducts,
          "data",
          null,
          false
        );

        processApiResponse(
          cancellationDataResult,
          setCancellationCounts,
          "data",
          null,
          false
        );
      } catch (error) {
        console.error("Error fetching monthly/overall data:", error);
      }
    };

    setIsLoading(true);
    fetchDailyData(dateParam).then(() => {
      fetchMonthlyAndOverallData(dateParam).finally(() => {
        setIsLoading(false);
      });
    });

    const interval = setInterval(() => {
      fetchDailyData(dateParam);
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  const clearDatePicker = () => {
    setSelectedDate(null);
    setIsDatePickerVisible(false);
  };

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
    setIsReportMode((prev) => {
      if (prev) {
        setIsDatePickerVisible(false);
        clearDatePicker();
      }
      return !prev;
    });
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
        "cancellation-counts-section",
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
    const reportDate = selectedDate
      ? new Date(selectedDate).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;
    const dateFilterText = reportDate
      ? `<p>Report Date: ${reportDate}</p>`
      : "";

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const completeContent = `
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
                margin: 20mm;
              }
              body {
                margin: 0;
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
            ${dateFilterText}
          </header>
          ${printableContent}
        </body>
      </html>
    `;

    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(completeContent);
    iframe.contentWindow.document.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
      clearDatePicker();
    };
  };

  return (
    <div id="root-dashboard-page">
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
                  <FontAwesomeIcon icon={faList} /> Upload Products
                </Link>
              </li>
              <li>
                <Link to="/customer-list">
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
                <Link to="/audit-logs">
                  <FontAwesomeIcon icon={faClipboardList} /> Audit Logs
                </Link>
              </li>

              <li>
                <Link to="/archived-products">
                  <FontAwesomeIcon icon={faArchive} /> Product Archives
                </Link>
              </li>
              <li>
                <Link to="/change-credentials">
                  <FontAwesomeIcon icon={faUserEdit} /> Edit Credentials
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
                <button onClick={toggleDatePicker} className="report-button">
                  <FontAwesomeIcon icon={faCalendarAlt} /> Select Date
                </button>
                <button onClick={printReports} className="report-button">
                  <FontAwesomeIcon icon={faFileAlt} /> Generate Report
                </button>
              </>
            )}

            {isDatePickerVisible && (
              <div className="date-picker-container">
                <input
                  type="date"
                  className="date-picker"
                  value={selectedDate || ""}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const processedDate = new Date(selectedDate)
                      .toISOString()
                      .split("T")[0];
                    setSelectedDate(processedDate);
                  }}
                />
              </div>
            )}
          </header>

          <section
            id="sales-section"
            className={`sales-section ${
              isReportMode ? "wiggle hoverable" : ""
            } ${selectedReports.includes("sales-section") ? "selected" : ""}`}
            onClick={() =>
              isReportMode && handleReportSelection("sales-section")
            }
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
                  In Stock: {totalStock.toLocaleString()}
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
                selectedReports.includes("transaction-overview")
                  ? "selected"
                  : ""
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
                    Total:{" "}
                    {totalTransactions !== null ? totalTransactions : "0"}
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
            <div id="cancellation-counts-section">
              <div
                id="cancel-order-counts"
                className={`cancel-order-counts ${
                  isReportMode ? "wiggle hoverable" : ""
                } ${
                  selectedReports.includes("cancel-order-counts")
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  isReportMode && handleReportSelection("cancel-order-counts")
                }
              >
                <h3>Cancellation Reasons</h3>
                {isReportMode && (
                  <input
                    type="checkbox"
                    className="report-checkbox"
                    checked={selectedReports.includes(
                      "cancellation-counts-section"
                    )}
                    readOnly
                  />
                )}
                {cancellationCounts ? (
                  <div className="cancellation-counts-details">
                    {cancellationCounts.map((reasonCount, index) => (
                      <div key={index} className="cancellation-count-item">
                        <p>
                          {reasonCount.cancellationReason}:{" "}
                          <strong>{reasonCount.count}</strong>{" "}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <p>Error: {error}</p>
                ) : (
                  <p>Loading cancellation counts...</p>
                )}
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
              isReportMode &&
              handleReportSelection("todays-transactions-section")
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
        </main>
        {isLogoutModalOpen && (
          <LogOutConfirmationModal
            isOpen={isLogoutModalOpen}
            onClose={closeLogoutModal}
            onConfirm={handleLogout}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
