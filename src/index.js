import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { CartProvider } from "./components/posComponents/CartContext";
import { OnlineCartProvider } from "./components/onlineStoreFrontComponents/OnlineCartContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { CommentProvider } from "./contexts/CommentContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import ErrorBoundary from "./ErrorBoundary";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <LoadingProvider>
          <AuthProvider>
            <AdminAuthProvider>
              <CartProvider>
                <OnlineCartProvider>
                  <WebSocketProvider>
                    <CommentProvider>
                      <App />
                    </CommentProvider>
                  </WebSocketProvider>
                </OnlineCartProvider>
              </CartProvider>
            </AdminAuthProvider>
          </AuthProvider>
        </LoadingProvider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);
