import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useAuth } from "../../contexts/AuthContext";
import {
  getCustomerProfile,
  updateCustomer,
} from "../../services/online-store-front-customer-api";
import OnlineStoreFrontHeader from "../onlineStoreFrontComponents/OnlineStoreFrontHeader";
import Sidebar from "./Sidebar";
import "../../styles/onlineStoreFrontCustomersComponent/CustomerProfilePage.css";
import { months, days, years } from "../../utils/dates";

const CustomerProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("Profile");

  useEffect(() => {
    if (currentUser) {
      const fetchProfile = async () => {
        try {
          const result = await getCustomerProfile(
            currentUser.id,
            currentUser.token
          );

          if (result) {
            setProfile(result);
            setUsername(result.username || "");
            setPhoneNumber(result.phoneNumber || "");
            setGender(result.gender || "");

            if (result.dateOfBirth) {
              const [year, month, day] = result.dateOfBirth.split("-");
              setDateOfBirth({
                day: day.padStart(2, "0"),
                month: month.padStart(2, "0"),
                year: year,
              });
            } else {
              setDateOfBirth({ day: "", month: "", year: "" });
            }
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

  const handleSave = async () => {
    try {
      await updateCustomer({
        customerId: currentUser.id,
        username,
        phoneNumber,
        gender,
        dateOfBirth: `${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.day}`,
        token: currentUser.token,
      });
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
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
              {profile ? (
                <div className="profile-form">
                  <div>
                    <label>Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled
                    />
                    <p>Username can only be changed once.</p>
                  </div>
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      value={profile.name || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>Email</label>
                    <a href="/">Add</a>
                  </div>
                  <div>
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Gender</label>
                    <div>
                      <input
                        type="radio"
                        id="male"
                        value="Male"
                        checked={gender === "Male"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      <label htmlFor="male">Male</label>
                      <input
                        type="radio"
                        id="female"
                        value="Female"
                        checked={gender === "Female"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      <label htmlFor="female">Female</label>
                      <input
                        type="radio"
                        id="other"
                        value="Other"
                        checked={gender === "Other"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      <label htmlFor="other">Other</label>
                    </div>
                  </div>
                  <div>
                    <label>Date of Birth</label>
                    <div className="dob">
                      <Select
                        placeholder="Day"
                        options={days}
                        value={days.find(
                          (day) => day.value === dateOfBirth.day
                        )}
                        onChange={(selectedOption) =>
                          setDateOfBirth({
                            ...dateOfBirth,
                            day: selectedOption.value,
                          })
                        }
                      />
                      <Select
                        placeholder="Month"
                        options={months}
                        value={months.find(
                          (month) => month.value === dateOfBirth.month
                        )}
                        onChange={(selectedOption) =>
                          setDateOfBirth({
                            ...dateOfBirth,
                            month: selectedOption.value,
                          })
                        }
                      />
                      <Select
                        placeholder="Year"
                        options={years}
                        value={years.find(
                          (year) => year.value === dateOfBirth.year
                        )}
                        onChange={(selectedOption) =>
                          setDateOfBirth({
                            ...dateOfBirth,
                            year: selectedOption.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <button className="save-button" onClick={handleSave}>
                    Save
                  </button>
                </div>
              ) : (
                <p>No profile data available.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
