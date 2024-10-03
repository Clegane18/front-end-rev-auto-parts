import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAdminAuth } from "./contexts/AdminAuthContext";
import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./components/dashboardComponents/DashboardPage";
import LoginPage from "./components/LoginComponents/LoginPage";
import POSPage from "./components/posComponents/POSPage";
import InventoryManagementPage from "./components/inventoryComponents/InventoryManagementPage";
import PendingStockManagementPage from "./components/inventoryComponents/PendingStockManagementPage";
import OnlineStoreFrontPage from "./components/onlineStoreFrontComponents/OnlineStoreFrontPage";
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
import ArchivedProductsPage from "./components/inventoryComponents/ArchivedProductsPage";
import OnlineCheckout from "./components/onlineStoreFrontComponents/OnlineCheckout";
import OrderList from "./components/dashboardComponents/OrderList";
import NotFoundPage from "./components/NotFoundPage";
import AboutUsPage from "./components/onlineStoreFrontComponents/AboutUsPage";
import ContactUsPage from "./components/onlineStoreFrontComponents/ContactUsPage";
import CustomerList from "./components/dashboardComponents/CustomerList";
import AccountSuspended from "./components/dashboardComponents/AccountSuspended";
import TermsAndConditions from "./components/onlineStoreFrontCustomersComponent/TermsAndConditions";
import OnlineProductDetailsPage from "./components/onlineStoreFrontComponents/OnlineProductDetailsPage";
import ChangeCredentialsPage from "./components/LoginComponents/ChangeCredentialsPage";

const App = () => {
  const { authToken: adminAuthToken, login } = useAdminAuth();
  const { token: customerAuthToken } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<OnlineStoreFrontPage />} />
      <Route path="/login" element={<LoginPage setAuthToken={login} />} />
      <Route
        path="/dashboard"
        element={adminAuthToken ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/pos"
        element={adminAuthToken ? <POSPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/inventory"
        element={
          adminAuthToken ? (
            <InventoryManagementPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/inventory-pending"
        element={
          adminAuthToken ? (
            <PendingStockManagementPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/customer-list"
        element={adminAuthToken ? <CustomerList /> : <Navigate to="/login" />}
      />
      <Route path="/account-suspended" element={<AccountSuspended />} />
      <Route
        path="/upload-products"
        element={adminAuthToken ? <UploadProducts /> : <Navigate to="/login" />}
      />
      <Route
        path="/checkout"
        element={adminAuthToken ? <Checkout /> : <Navigate to="/login" />}
      />
      <Route
        path="/receipt"
        element={adminAuthToken ? <Receipt /> : <Navigate to="/login" />}
      />
      <Route
        path="/cart"
        element={adminAuthToken ? <CartPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/archived-products"
        element={
          adminAuthToken ? <ArchivedProductsPage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/orders"
        element={adminAuthToken ? <OrderList /> : <Navigate to="/login" />}
      />
      <Route path="/change-credentials" element={<ChangeCredentialsPage />} />
      <Route
        path="/product/:productId"
        element={<OnlineProductDetailsPage />}
      />
      <Route path="/online-cart" element={<OnlineCartPage />} />
      <Route path="/customer-login" element={<CustomerLoginPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/reset-password" element={<RequestResetPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route
        path="/customer-profile"
        element={
          customerAuthToken ? (
            <CustomerProfilePage />
          ) : (
            <Navigate to="/customer-login" />
          )
        }
      />
      <Route path="/online-checkout" element={<OnlineCheckout />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
