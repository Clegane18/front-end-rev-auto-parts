import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAdminAuth } from "./contexts/AdminAuthContext";
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

const App = () => {
  const { authToken, login } = useAdminAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          authToken ? <OnlineStoreFrontPage /> : <Navigate to="/login" />
        }
      />
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
          authToken ? <PendingStockManagementPage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/customer-list"
        element={authToken ? <CustomerList /> : <Navigate to="/login" />}
      />
      <Route
        path="/account-suspended"
        element={authToken ? <AccountSuspended /> : <Navigate to="/login" />}
      />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route
        path="/upload-products"
        element={authToken ? <UploadProducts /> : <Navigate to="/login" />}
      />
      <Route
        path="/product/:productId"
        element={<OnlineProductDetailsPage />}
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
        element={authToken ? <OnlineCartPage /> : <Navigate to="/login" />}
      />
      <Route path="/customer-login" element={<CustomerLoginPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/reset-password" element={<RequestResetPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
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
        path="/archived-products"
        element={
          authToken ? <ArchivedProductsPage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/online-checkout"
        element={authToken ? <OnlineCheckout /> : <Navigate to="/login" />}
      />
      <Route
        path="/orders"
        element={authToken ? <OrderList /> : <Navigate to="/login" />}
      />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
