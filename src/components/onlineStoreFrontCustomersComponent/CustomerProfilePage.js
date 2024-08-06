import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path as needed
import { getCustomerProfile } from "../../services/online-store-front-customer-api"; // Adjust path as needed
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CustomerProfilePage = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, currentUser, token } = useAuth(); // Ensure user is authenticated
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const fetchCustomerProfile = async () => {
        try {
          const response = await getCustomerProfile(currentUser.id, token); // Fetch profile data
          setCustomer(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCustomerProfile();
    } else {
      // Redirect to login or show an appropriate message
      navigate("/customer-login");
    }
  }, [isAuthenticated, navigate, currentUser, token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!customer) {
    return <p>No customer data available.</p>;
  }

  return (
    <div className="customer-profile-page">
      <h1>Customer Profile</h1>
      <div className="profile-details">
        <p>
          <strong>Username:</strong> {customer.username}
        </p>
        <p>
          <strong>Email:</strong> {customer.email}
        </p>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
