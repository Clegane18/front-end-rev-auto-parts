import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import {
  getCustomerProfile,
  updateCustomer,
} from "../../services/online-store-front-customer-api";
import OnlineStoreFrontHeader from "../onlineStoreFrontComponents/OnlineStoreFrontHeader";
import OnlineStoreFrontFooter from "../onlineStoreFrontComponents/OnlineStoreFrontFooter";
import Sidebar from "./Sidebar";
import OrderTabs from "./OrderTabs";
import "../../styles/onlineStoreFrontCustomersComponent/CustomerProfilePage.css";
import { months, days, years } from "../../utils/dates";
import SuccessModal from "../SuccessModal";
import AddressCard from "./AddressCard";
import { useLoading } from "../../contexts/LoadingContext";

const CustomerProfilePage = () => {
  const { currentUser, token } = useAuth();
  const location = useLocation();
  const { setIsLoading } = useLoading();

  const [profile, setProfile] = useState({
    username: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: {
      day: "",
      month: "",
      year: "",
    },
  });
  const [error, setError] = useState(null);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const initialMenu = location.state?.selectedMenu || "Profile";
  const initialTab = location.state?.activeTab || "All";

  const [selectedMenu, setSelectedMenu] = useState(initialMenu);
  const [activeTab] = useState(initialTab);

  useEffect(() => {
    if (currentUser && token) {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const result = await getCustomerProfile(currentUser.id, token);
          if (result && result.data) {
            const { username, phoneNumber, gender, dateOfBirth } = result.data;
            setProfile({
              username: username || "",
              phoneNumber: phoneNumber || "",
              gender: gender || "",
              dateOfBirth: {
                day: dateOfBirth
                  ? dateOfBirth.split("-")[2].padStart(2, "0")
                  : "",
                month: dateOfBirth
                  ? dateOfBirth.split("-")[1].padStart(2, "0")
                  : "",
                year: dateOfBirth ? dateOfBirth.split("-")[0] : "",
              },
            });
          } else {
            throw new Error("Profile data is missing");
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }
  }, [currentUser, token, setIsLoading]);

  const handleSave = async () => {
    if (!/^\+?\d+$/.test(profile.phoneNumber)) {
      setError("Phone number must be a valid number.");
      return;
    }

    if (profile.phoneNumber.length > 14) {
      setError(
        "Phone number must not exceed 12 characters including the country code (+63)."
      );
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        customerId: currentUser.id,
        username: profile.username,
        phoneNumber: profile.phoneNumber,
        gender: profile.gender,
        token: token,
        dateOfBirth:
          profile.dateOfBirth.year &&
          profile.dateOfBirth.month &&
          profile.dateOfBirth.day
            ? `${profile.dateOfBirth.year}-${profile.dateOfBirth.month}-${profile.dateOfBirth.day}`
            : undefined,
      };

      await updateCustomer(payload);
      setShowSuccessModal(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="root-customer-profile-page">
      <OnlineStoreFrontHeader
        products={products}
        searchTerm={searchTerm}
        handleSearch={setProducts}
        handleSearchTermChange={setSearchTerm}
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
              {error && <div className="error-message">{error}</div>}
              <div className="profile-form">
                <div>
                  <label>Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    disabled
                  />
                  <p>Username can only be changed once.</p>
                </div>
                <div>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={profile.phoneNumber ? profile.phoneNumber : "+63"}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length > 14) {
                        setPhoneNumberError(
                          "Phone number must not exceed 12 characters including the country code (+63)."
                        );
                      } else {
                        setPhoneNumberError("");
                      }
                      setProfile({ ...profile, phoneNumber: value });
                    }}
                    placeholder="+63"
                  />
                  {phoneNumberError && (
                    <div className="error-message">{phoneNumberError}</div>
                  )}
                </div>
                <div>
                  <label>Gender</label>
                  <div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={profile.gender === "Male"}
                        onChange={() =>
                          setProfile({
                            ...profile,
                            gender: profile.gender === "Male" ? "" : "Male",
                          })
                        }
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="toggle-label">Male</span>

                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={profile.gender === "Female"}
                        onChange={() =>
                          setProfile({
                            ...profile,
                            gender: profile.gender === "Female" ? "" : "Female",
                          })
                        }
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="toggle-label">Female</span>

                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={profile.gender === "Other"}
                        onChange={() =>
                          setProfile({
                            ...profile,
                            gender: profile.gender === "Other" ? "" : "Other",
                          })
                        }
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="toggle-label">Other</span>
                  </div>
                </div>

                <div>
                  <label>Date of Birth</label>
                  <div className="dob">
                    <Select
                      placeholder="Day"
                      options={days}
                      value={days.find(
                        (day) => day.value === profile.dateOfBirth.day
                      )}
                      onChange={(selectedOption) =>
                        setProfile({
                          ...profile,
                          dateOfBirth: {
                            ...profile.dateOfBirth,
                            day: selectedOption.value,
                          },
                        })
                      }
                      menuPlacement="top"
                    />
                    <Select
                      placeholder="Month"
                      options={months}
                      value={months.find(
                        (month) => month.value === profile.dateOfBirth.month
                      )}
                      onChange={(selectedOption) =>
                        setProfile({
                          ...profile,
                          dateOfBirth: {
                            ...profile.dateOfBirth,
                            month: selectedOption.value,
                          },
                        })
                      }
                      menuPlacement="top"
                    />
                    <Select
                      placeholder="Year"
                      options={years}
                      value={years.find(
                        (year) => year.value === profile.dateOfBirth.year
                      )}
                      onChange={(selectedOption) =>
                        setProfile({
                          ...profile,
                          dateOfBirth: {
                            ...profile.dateOfBirth,
                            year: selectedOption.value,
                          },
                        })
                      }
                      menuPlacement="top"
                    />
                  </div>
                </div>
                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
              </div>
            </>
          )}
          {selectedMenu === "Addresses" && <AddressCard />}
          {selectedMenu === "MyPurchase" && (
            <>
              <h1>My Purchases</h1>
              <OrderTabs initialTab={activeTab} />
            </>
          )}
        </div>
      </div>

      {showSuccessModal && (
        <SuccessModal
          message="Profile updated successfully!"
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      <OnlineStoreFrontFooter />
    </div>
  );
};

export default CustomerProfilePage;
