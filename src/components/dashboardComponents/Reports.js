import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import "../../styles/dashboardComponents/Reports.css";

const ReportsSection = ({ data }) => {
  const [selectedData, setSelectedData] = useState({
    sales: true,
    todaysTransactions: true,
    bestSellers: true,
    stockReminder: true,
    transactionOverview: true,
    monthlyIncome: true,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedData((prevSelectedData) => ({
      ...prevSelectedData,
      [name]: checked,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="reports-section">
      <div className="section-container">
        <h3>Reports</h3>
        <div className="print-options">
          <label>
            <input
              type="checkbox"
              name="sales"
              checked={selectedData.sales}
              onChange={handleCheckboxChange}
            />
            Sales
          </label>
          <label>
            <input
              type="checkbox"
              name="todaysTransactions"
              checked={selectedData.todaysTransactions}
              onChange={handleCheckboxChange}
            />
            Today's Transactions
          </label>
          <label>
            <input
              type="checkbox"
              name="bestSellers"
              checked={selectedData.bestSellers}
              onChange={handleCheckboxChange}
            />
            Best Sellers
          </label>
          <label>
            <input
              type="checkbox"
              name="stockReminder"
              checked={selectedData.stockReminder}
              onChange={handleCheckboxChange}
            />
            Stock Reminder
          </label>
          <label>
            <input
              type="checkbox"
              name="transactionOverview"
              checked={selectedData.transactionOverview}
              onChange={handleCheckboxChange}
            />
            Transaction Overview
          </label>
          <label>
            <input
              type="checkbox"
              name="monthlyIncome"
              checked={selectedData.monthlyIncome}
              onChange={handleCheckboxChange}
            />
            Monthly Income
          </label>
        </div>
        <button className="print-button" onClick={handlePrint}>
          <FontAwesomeIcon icon={faPrint} /> Print
        </button>
      </div>
      <div className="printable-content">
        {selectedData.sales && (
          <section className="sales-section">
            <h3>Sales</h3>
            {/* Sales content */}
          </section>
        )}
        {selectedData.todaysTransactions && (
          <section className="todays-transactions-section">
            <h3>Today's Transactions</h3>
            {/* Today's transactions content */}
          </section>
        )}
        {selectedData.bestSellers && (
          <section className="bestsellers-section">
            <h3>Top Sellers This Month</h3>
            {/* Best sellers content */}
          </section>
        )}
        {selectedData.stockReminder && (
          <section className="stock-reminder-section">
            <h3>Stock Reminder</h3>
            {/* Stock reminder content */}
          </section>
        )}
        {selectedData.transactionOverview && (
          <section className="transaction-overview-section">
            <h3>Transaction Overview</h3>
            {/* Transaction overview content */}
          </section>
        )}
        {selectedData.monthlyIncome && (
          <section className="monthly-income-section">
            <h3>Monthly Income</h3>
            {/* Monthly income content */}
          </section>
        )}
      </div>
    </section>
  );
};

export default ReportsSection;
