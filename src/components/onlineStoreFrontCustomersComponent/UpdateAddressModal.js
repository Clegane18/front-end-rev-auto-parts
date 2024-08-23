import React, { useState, useEffect } from "react";
import {
  getRegions,
  getProvinces,
  getCitiesAndMunicipalities,
  getBarangays,
} from "../../services/location-api";
import "../../styles/onlineStoreFrontCustomersComponent/UpdateAddressModal.css"; // Using the same CSS file as AddAddressModal
import { FaChevronDown, FaChevronRight, FaTimes } from "react-icons/fa";

const UpdateAddressModal = ({ isOpen, onClose, onSave, address }) => {
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
      if (address) {
        setFormData({
          fullName: address.fullName || "",
          phoneNumber: address.phoneNumber || "",
          region: address.region || "",
          province: address.province || "",
          city: address.city || "",
          barangay: address.barangay || "",
          label: address.label || "",
          isDefault: address.isDefault || false,
          postalCode: address.postalCode || "",
        });

        setSelectedNames({
          regionName: address.regionName || "",
          provinceName: address.provinceName || "",
          cityName: address.cityName || "",
          barangayName: address.barangayName || "",
        });
      }
    }
  }, [isOpen, address]);

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
          <h2 className="modal-title">Update Address</h2>
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

              {activeTab === "Region" && (
                <select
                  value={formData.region}
                  onChange={handleRegionChange}
                  className="modal-select"
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
                  value={formData.province}
                  onChange={handleProvinceChange}
                  className="modal-select"
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
                  value={formData.city}
                  onChange={handleCityChange}
                  className="modal-select"
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
                  value={formData.barangay}
                  onChange={handleBarangayChange}
                  className="modal-select"
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
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              className="modal-input"
            />
            <div className="label-checkbox-group">
              <input
                type="text"
                name="label"
                placeholder="Address Label"
                value={formData.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                className="modal-input"
              />
              <label className="modal-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={handleCheckboxChange}
                  className="modal-checkbox"
                />
                Default Address
              </label>
            </div>
            <div className="modal-buttons">
              <button
                type="button"
                className="modal-cancel-button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="modal-save-button">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateAddressModal;
