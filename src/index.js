import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { CartProvider } from "./components/posComponents/CartContext";
import { OnlineStoreFrontCartProvider } from "./contexts/OnlineStoreCartContext";
import { OnlineCartProvider } from "./components/onlineStoreFrontComponents/OnlineCartContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import ErrorBoundary from "./ErrorBoundary";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <LoadingProvider>
          <AdminAuthProvider>
            <AuthProvider>
              <OnlineStoreFrontCartProvider>
                <CartProvider>
                  <OnlineCartProvider>
                    <WebSocketProvider>
                      <App />
                    </WebSocketProvider>
                  </OnlineCartProvider>
                </CartProvider>
              </OnlineStoreFrontCartProvider>
            </AuthProvider>
          </AdminAuthProvider>
        </LoadingProvider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);
