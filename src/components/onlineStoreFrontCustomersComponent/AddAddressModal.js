import React, { useState, useEffect } from "react";
import {
  getRegions,
  getProvinces,
  getCitiesAndMunicipalities,
  getBarangays,
} from "../../services/location-api";
import "../../styles/onlineStoreFrontCustomersComponent/AddAddressModal.css";
import { FaChevronDown, FaChevronRight, FaTimes } from "react-icons/fa";

const AddAddressModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    label: "",
    isDefault: false,
    postalCode: "",
    streetName: "",
  });

  const [selectedNames, setSelectedNames] = useState({
    regionName: "",
    provinceName: "",
    cityName: "",
    barangayName: "",
  });

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [activeTab, setActiveTab] = useState("Region");
  const [isTabVisible, setIsTabVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getRegions().then(setRegions).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.region) {
      getProvinces(formData.region).then(setProvinces).catch(console.error);
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.province) {
      getCitiesAndMunicipalities(formData.province)
        .then(setCities)
        .catch(console.error);
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.city) {
      getBarangays(formData.city).then(setBarangays).catch(console.error);
    }
  }, [formData.city]);

  const handleRegionChange = (e) => {
    const selectedRegionCode = e.target.value;
    const selectedRegionName =
      regions.find((region) => region.code === selectedRegionCode)?.name || "";

    setFormData({
      ...formData,
      region: selectedRegionCode,
      province: "",
      city: "",
      barangay: "",
    });

    setSelectedNames({
      regionName: selectedRegionName,
      provinceName: "",
      cityName: "",
      barangayName: "",
    });

    setProvinces([]);
    setCities([]);
    setBarangays([]);

    setActiveTab("Province");
  };

  const handleProvinceChange = (e) => {
    const selectedProvinceCode = e.target.value;
    const selectedProvinceName =
      provinces.find((province) => province.code === selectedProvinceCode)
        ?.name || "";

    setFormData({
      ...formData,
      province: selectedProvinceCode,
      city: "",
      barangay: "",
    });

    setSelectedNames((prevState) => ({
      ...prevState,
      provinceName: selectedProvinceName,
      cityName: "",
      barangayName: "",
    }));

    setCities([]);
    setBarangays([]);

    setActiveTab("City");
  };

  const handleCityChange = (e) => {
    const selectedCityCode = e.target.value;
    const selectedCityName =
      cities.find((city) => city.code === selectedCityCode)?.name || "";

    setFormData({
      ...formData,
      city: selectedCityCode,
      barangay: "",
    });

    setSelectedNames((prevState) => ({
      ...prevState,
      cityName: selectedCityName,
      barangayName: "",
    }));

    setBarangays([]);

    setActiveTab("Barangay");
  };

  const handleBarangayChange = (e) => {
    const selectedBarangayCode = e.target.value;
    const selectedBarangayName =
      barangays.find((barangay) => barangay.code === selectedBarangayCode)
        ?.name || "";

    setFormData({ ...formData, barangay: selectedBarangayCode });

    setSelectedNames((prevState) => ({
      ...prevState,
      barangayName: selectedBarangayName,
    }));

    setIsTabVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLabelChange = (label) => {
    setFormData((prevData) => ({ ...prevData, label }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prevData) => ({ ...prevData, isDefault: e.target.checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataWithNames = {
      ...formData,
      region: selectedNames.regionName,
      province: selectedNames.provinceName,
      city: selectedNames.cityName,
      barangay: selectedNames.barangayName,
    };

    onSave(formDataWithNames);
  };

  const toggleTabVisibility = () => {
    setIsTabVisible(!isTabVisible);
  };
  const clearLocation = () => {
    setFormData({
      ...formData,
      region: "",
      province: "",
      city: "",
      barangay: "",
    });

    setSelectedNames({
      regionName: "",
      provinceName: "",
      cityName: "",
      barangayName: "",
    });

    setRegions([]);
    setProvinces([]);
    setCities([]);
    setBarangays([]);
    setActiveTab("Region");

    getRegions().then(setRegions).catch(console.error);
  };

  if (!isOpen) return null;

  return (
    <div id="root-add-address-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">New Address</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="modal-input"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="modal-input"
                required
              />
            </div>
            <div className="address-selector">
              <div
                className="address-display-wrapper"
                onClick={toggleTabVisibility}
              >
                <FaTimes
                  className="clear-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearLocation();
                  }}
                />
                <input
                  type="text"
                  placeholder="Region, Province, City, Barangay"
                  readOnly
                  value={
                    selectedNames.regionName ||
                    selectedNames.provinceName ||
                    selectedNames.cityName ||
                    selectedNames.barangayName
                      ? `${selectedNames.regionName}, ${selectedNames.provinceName}, ${selectedNames.cityName}, ${selectedNames.barangayName}`
                      : ""
                  }
                  className="modal-input-address-display"
                />
                {isTabVisible ? (
                  <FaChevronDown className="arrow-icon open" />
                ) : (
                  <FaChevronRight className="arrow-icon" />
                )}
              </div>

              {isTabVisible && (
                <div className="tab-container">
                  <button
                    type="button"
                    className={`tab-button ${
                      activeTab === "Region" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Region")}
                  >
                    Region
                  </button>
                  <button
                    type="button"
                    className={`tab-button ${
                      activeTab === "Province" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Province")}
                    disabled={!formData.region}
                  >
                    Province
                  </button>
                  <button
                    type="button"
                    className={`tab-button ${
                      activeTab === "City" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("City")}
                    disabled={!formData.province}
                  >
                    City
                  </button>
                  <button
                    type="button"
                    className={`tab-button ${
                      activeTab === "Barangay" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Barangay")}
                    disabled={!formData.city}
                  >
                    Barangay
                  </button>
                </div>
              )}

              {isTabVisible && (
                <div className="tab-content">
                  {activeTab === "Region" && (
                    <select
                      name="region"
                      value={formData.region || ""}
                      onChange={handleRegionChange}
                      className="modal-select"
                      required
                      size="5"
                    >
                      <option value="">Select Region</option>
                      {regions.map((region) => (
                        <option key={region.code} value={region.code}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {activeTab === "Province" && (
                    <select
                      name="province"
                      value={formData.province || ""}
                      onChange={handleProvinceChange}
                      className="modal-select"
                      required
                      size="5"
                    >
                      <option value="">Select Province</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {activeTab === "City" && (
                    <select
                      name="city"
                      value={formData.city || ""}
                      onChange={handleCityChange}
                      className="modal-select"
                      required
                      size="5"
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.code} value={city.code}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {activeTab === "Barangay" && (
                    <select
                      name="barangay"
                      value={formData.barangay || ""}
                      onChange={handleBarangayChange}
                      className="modal-select"
                      required
                      size="5"
                    >
                      <option value="">Select Barangay</option>
                      {barangays.map((barangay) => (
                        <option key={barangay.code} value={barangay.code}>
                          {barangay.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
            <div className="other-information">
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                className="postal-code"
                value={formData.postalCode || ""}
                onChange={handleChange}
              />

              <input
                type="text"
                name="streetName"
                placeholder="Street Name, Building, House No."
                className="streetname-building-house-no"
                value={formData.streetName || ""}
                onChange={handleChange}
              />
              <div className="label-buttons">
                <p>Label As:</p>
                <div className="home-work-buttons">
                  <button
                    type="button"
                    className={`label-button ${
                      formData.label === "Home" ? "active" : ""
                    }`}
                    onClick={() => handleLabelChange("Home")}
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    className={`label-button ${
                      formData.label === "Work" ? "active" : ""
                    }`}
                    onClick={() => handleLabelChange("Work")}
                  >
                    Work
                  </button>
                </div>
                <div className="default-checkbox">
                  <input
                    type="checkbox"
                    id="default"
                    checked={formData.isDefault}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="default">Set as Default Address</label>
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button type="button" onClick={onClose} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="save-button">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
