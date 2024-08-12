import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getCustomerProfile } from "../../services/online-store-front-customer-api";
import OnlineStoreFrontHeader from "../onlineStoreFrontComponents/OnlineStoreFrontHeader";
import Sidebar from "./Sidebar";
import "../../styles/onlineStoreFrontCustomersComponent/CustomerProfilePage.css";

const CustomerProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  // Comment out the orders-related states
  // const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("Profile");
  // const [selectedOrderTab, setSelectedOrderTab] = useState("All");

  useEffect(() => {
    if (currentUser) {
      const fetchProfile = async () => {
        try {
          const result = await getCustomerProfile(
            currentUser.id,
            currentUser.token
          );
          if (result.data) {
            setProfile(result.data);
          } else {
            throw new Error("Profile data is missing");
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();

      // Comment out the logic related to fetching orders
      // const fetchOrders = async () => {
      //   try {
      //     const result = await getCustomerOrders(
      //       currentUser.id,
      //       currentUser.token
      //     );
      //     setOrders(result.data || []);
      //   } catch (err) {
      //     setError(err.message);
      //   }
      // };

      // fetchOrders();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleSearch = (products) => {
    setProducts(products);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  // Comment out the order filtering logic
  // const filteredOrders = orders.filter((order) => {
  //   if (selectedOrderTab === "All") return true;
  //   return order.status === selectedOrderTab;
  // });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div id="root-customer-profile-page">
      <OnlineStoreFrontHeader
        products={products}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleSearchTermChange={handleSearchTermChange}
      />
      <div className="customer-profile-container">
        <Sidebar
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
        <div className="customer-profile-content">
          {selectedMenu === "Profile" && (
            <>
              <h1>My Profile</h1>
              {profile ? (
                <div>
                  <p>
                    <strong>Username:</strong> {profile.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {profile.email}
                  </p>
                </div>
              ) : (
                <p>No profile data available.</p>
              )}
            </>
          )}
          {selectedMenu === "MyPurchase" && (
            <>
              <h2>My Purchases</h2>
              {/* Comment out the order tabs and list */}
              {/* <div className="purchase-tabs">
                {["All", "To Pay", "To Ship", "To Receive", "Completed"].map(
                  (tab) => (
                    <button
                      key={tab}
                      className={selectedOrderTab === tab ? "active" : ""}
                      onClick={() => setSelectedOrderTab(tab)}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
              <div className="order-list">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="order-item">
                      <p>
                        <strong>Order ID:</strong> {order.id}
                      </p>
                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>
                      <p>
                        <strong>Amount:</strong> ${order.amount}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No Orders yet</p>
                )}
              </div> */}
              <p>No Orders yet</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
