import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getCustomerProfile } from "../../services/online-store-front-customer-api";
import OnlineStoreFrontHeader from "../onlineStoreFrontComponents/OnlineStoreFrontHeader"; // Import the header component

const CustomerProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSelectProduct = (product) => {
    // Define behavior when a product is selected
  };

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
        handleSelectProduct={handleSelectProduct}
      />
      <div className="customer-profile-content">
        <h1>Customer Profile</h1>
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
      </div>
    </div>
  );
};

export default CustomerProfilePage;
