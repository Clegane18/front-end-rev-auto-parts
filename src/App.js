import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/dashboardComponents/DashboardPage";
import LoginPage from "./components/LoginComponents/LoginPage";
import POSPage from "./components/posComponents/POSPage";
import InventoryManagementPage from "./components/inventoryComponents/InventoryManagementPage";
import PendingStockManagementPage from "./components/inventoryComponents/PendingStockManagementPage";
import OnlineStoreFrontPage from "./components/onlineStoreFrontComponents/OnlineStoreFrontPage";
import useAuthentication from "./components/LoginComponents/useAuthentication";
import Checkout from "./components/posComponents/Checkout";
import Receipt from "./components/posComponents/Receipt";
import Reports from "./components/dashboardComponents/Reports";

const App = () => {
  const { authToken, login } = useAuthentication();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setAuthToken={login} />} />
        <Route
          path="/dashboard"
          element={authToken ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/pos"
          element={authToken ? <POSPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/inventory"
          element={
            authToken ? <InventoryManagementPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/inventory-pending"
          element={
            authToken ? (
              <PendingStockManagementPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/online-store"
          element={
            authToken ? <OnlineStoreFrontPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/checkout"
          element={authToken ? <Checkout /> : <Navigate to="/login" />}
        />
        <Route
          path="/receipt"
          element={authToken ? <Receipt /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={authToken ? "/dashboard" : "/login"} />}
        />
        <Route
          path="/reports"
          element={authToken ? <Reports /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
