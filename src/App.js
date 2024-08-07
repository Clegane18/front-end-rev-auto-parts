import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CartProvider } from "../src/components/posComponents/CartContext";
import { OnlineCartProvider } from "../src/components/onlineStoreFrontComponents/OnlineCartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./components/dashboardComponents/DashboardPage";
import LoginPage from "./components/LoginComponents/LoginPage";
import POSPage from "./components/posComponents/POSPage";
import InventoryManagementPage from "./components/inventoryComponents/InventoryManagementPage";
import PendingStockManagementPage from "./components/inventoryComponents/PendingStockManagementPage";
import OnlineStoreFrontPage from "./components/onlineStoreFrontComponents/OnlineStoreFrontPage";
import useAuthentication from "./components/LoginComponents/useAuthentication";
import Checkout from "./components/posComponents/Checkout";
import Receipt from "./components/posComponents/Receipt";
import CartPage from "./components/posComponents/CartPage";
import UploadProducts from "./components/onlineStoreFrontComponents/UploadProducts";
import OnlineCartPage from "./components/onlineStoreFrontComponents/OnlineCartPage";
import CustomerLoginPage from "./components/onlineStoreFrontCustomersComponent/CustomerLoginPage";
import CreateAccountPage from "./components/onlineStoreFrontCustomersComponent/CreateAccountPage";
import RequestResetPasswordPage from "./components/onlineStoreFrontCustomersComponent/RequestResetPasswordPage";
import ResetPasswordPage from "./components/onlineStoreFrontCustomersComponent/ResetPasswordPage";
import CustomerProfilePage from "./components/onlineStoreFrontCustomersComponent/CustomerProfilePage";

const App = () => {
  const { authToken, login } = useAuthentication();

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <OnlineCartProvider>
            <Routes>
              <Route
                path="/login"
                element={<LoginPage setAuthToken={login} />}
              />
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
                  authToken ? (
                    <InventoryManagementPage />
                  ) : (
                    <Navigate to="/login" />
                  )
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
                  authToken ? (
                    <OnlineStoreFrontPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/upload-products"
                element={
                  authToken ? <UploadProducts /> : <Navigate to="/login" />
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
                path="/cart"
                element={authToken ? <CartPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/online-cart"
                element={
                  authToken ? <OnlineCartPage /> : <Navigate to="/login" />
                }
              />
              <Route path="/customer-login" element={<CustomerLoginPage />} />
              <Route path="/create-account" element={<CreateAccountPage />} />
              <Route
                path="/reset-password"
                element={<RequestResetPasswordPage />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordPage />}
              />
              <Route
                path="/customer-profile"
                element={
                  authToken ? (
                    <CustomerProfilePage />
                  ) : (
                    <Navigate to="/customer-login" />
                  )
                }
              />
              <Route
                path="*"
                element={<Navigate to={authToken ? "/dashboard" : "/login"} />}
              />
            </Routes>
          </OnlineCartProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
