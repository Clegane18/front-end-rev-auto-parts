import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import DashboardPage from "./DashboardPage";
import "../../styles/dashboardComponents/Reports.css";

const Reports = () => {
  const dashboardRef = useRef();
  const [printOptions, setPrintOptions] = useState({
    includeSales: true,
    includeTransactions: true,
    includeBestsellers: true,
    includeStock: true,
    includeIncome: true,
  });

  const handlePrint = useReactToPrint({
    content: () => dashboardRef.current,
  });

  return (
    <div className="reports-container">
      <h2>Reports</h2>
      <div className="print-options">
        <label>
          <input
            type="checkbox"
            checked={printOptions.includeSales}
            onChange={(e) =>
              setPrintOptions({
                ...printOptions,
                includeSales: e.target.checked,
              })
            }
          />
          Include Sales
        </label>
        <label>
          <input
            type="checkbox"
            checked={printOptions.includeTransactions}
            onChange={(e) =>
              setPrintOptions({
                ...printOptions,
                includeTransactions: e.target.checked,
              })
            }
          />
          Include Transactions
        </label>
        <label>
          <input
            type="checkbox"
            checked={printOptions.includeBestsellers}
            onChange={(e) =>
              setPrintOptions({
                ...printOptions,
                includeBestsellers: e.target.checked,
              })
            }
          />
          Include Bestsellers
        </label>
        <label>
          <input
            type="checkbox"
            checked={printOptions.includeStock}
            onChange={(e) =>
              setPrintOptions({
                ...printOptions,
                includeStock: e.target.checked,
              })
            }
          />
          Include Stock
        </label>
        <label>
          <input
            type="checkbox"
            checked={printOptions.includeIncome}
            onChange={(e) =>
              setPrintOptions({
                ...printOptions,
                includeIncome: e.target.checked,
              })
            }
          />
          Include Income
        </label>
      </div>
      <button onClick={handlePrint}>Print Report</button>
      <div ref={dashboardRef}>
        <DashboardPage printOptions={printOptions} />
      </div>
    </div>
  );
};

export default Reports;
