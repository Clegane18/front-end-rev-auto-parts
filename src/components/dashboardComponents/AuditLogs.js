import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllAuditLogs,
  getAuditLogsByDateRange,
} from "../../services/audit-log-api";
import "../../styles/dashboardComponents/AuditLogs.css";
import logo from "../../assets/g&f-logo.png";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { useLoading } from "../../contexts/LoadingContext";

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const fetchAllAuditLogs = async () => {
    setLoading(true);
    setError("");
    try {
      setIsLoading(true);
      const data = await getAllAuditLogs();
      setAuditLogs(data);
    } catch (err) {
      setError(err.message || "Failed to fetch audit logs.");
    }
    setIsLoading(false);
    setLoading(false);
  };

  const fetchAuditLogsByDateRange = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setIsLoading(true);
      const data = await getAuditLogsByDateRange(startDate, endDate);
      if (Array.isArray(data)) {
        setAuditLogs(data);
      } else if (data.message) {
        setAuditLogs([]);
        setError(data.message);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch audit logs.");
      setAuditLogs([]);
    }
    setIsLoading(false);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllAuditLogs();
  }, []);

  return (
    <div id="root-audit-logs">
      <div className="audit-logs-container">
        <div className="header">
          <div className="header-left">
            <img
              src={logo}
              alt="Back"
              className="logo-back-button"
              onClick={() => navigate("/dashboard")}
            />
            <h1>Audit Logs</h1>
          </div>
          <form onSubmit={fetchAuditLogsByDateRange} className="filter-form">
            <label htmlFor="startDate" className="filter-label">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="filter-input"
            />

            <label htmlFor="endDate" className="filter-label">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="filter-input"
            />

            <button type="submit" className="filter-button">
              <SearchIcon /> Filter
            </button>
            <button
              type="button"
              onClick={fetchAllAuditLogs}
              className="filter-button reset-button"
            >
              <RefreshIcon /> Reset
            </button>
          </form>
        </div>

        {/* The filter form is now displayed on a single line */}

        {loading && <div className="loading">Loading...</div>}

        {error && <div className="error-message">Error: {error}</div>}

        {!loading && !error && auditLogs.length > 0 && (
          <div className="table-container">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Admin Email</th>
                  <th>Action</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.admin.email}</td>
                    <td>{log.action}</td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && auditLogs.length === 0 && (
          <div className="no-data">No Audit logs available.</div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
