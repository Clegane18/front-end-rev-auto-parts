import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getCustomerProfile } from "../../services/online-store-front-customer-api";

const CustomerProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
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
  );
};

export default CustomerProfilePage;
