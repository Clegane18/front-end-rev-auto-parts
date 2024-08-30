import React, { useState, useEffect } from "react";
import {
  getRegions,
  getProvincesOrCities,
  getCitiesAndMunicipalities,
  getBarangays,
} from "../../services/location-api";
import "../../styles/onlineStoreFrontCustomersComponent/UpdateAddressModal.css";
import {
  FaChevronDown,
  FaChevronRight,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

const UpdateAddressModal = ({ isOpen, onClose, onSave, address }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    addressLine: "",
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getRegions()
        .then(setRegions)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.region) {
      setIsLoading(true);
      getProvincesOrCities(formData.region)
        .then(setProvinces)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.province) {
      setIsLoading(true);
      getCitiesAndMunicipalities(formData.province)
        .then(setCities)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.city) {
      setIsLoading(true);
      getBarangays(formData.city)
        .then(setBarangays)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [formData.city]);

  useEffect(() => {
    if (isOpen && address) {
      setFormData({
        fullName: address.fullName || "",
        phoneNumber: address.phoneNumber || "",
        region: "",
        province: "",
        city: "",
        barangay: "",
        addressLine: address.addressLine || "",
        label: address.label || "",
        isDefault: address.isSetDefaultAddress || false,
        postalCode: address.postalCode || "",
      });

      setSelectedNames({
        regionName: address.region || "",
        provinceName: address.province || "",
        cityName: address.city || "",
        barangayName: address.barangay || "",
      });
    }
  }, [isOpen, address]);

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
      isSetDefaultAddress: formData.isDefault,
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
    <div id="root-update-address-modal">
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

              {isTabVisible && (
                <div className="tab-content">
                  {activeTab === "Region" && (
                    <div className="select-wrapper">
                      {isLoading ? (
                        <div className="loading-wrapper">
                          Loading regions...{" "}
                          <FaSpinner className="loading-icon" />
                        </div>
                      ) : (
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
                    </div>
                  )}
                  {activeTab === "Province" && (
                    <div className="select-wrapper">
                      {isLoading ? (
                        <div className="loading-wrapper">
                          Loading provinces...{" "}
                          <FaSpinner className="loading-icon" />
                        </div>
                      ) : (
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
                    </div>
                  )}
                  {activeTab === "City" && (
                    <div className="select-wrapper">
                      {isLoading ? (
                        <div className="loading-wrapper">
                          Loading cities...{" "}
                          <FaSpinner className="loading-icon" />
                        </div>
                      ) : (
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
                    </div>
                  )}
                  {activeTab === "Barangay" && (
                    <div className="select-wrapper">
                      {isLoading ? (
                        <div className="loading-wrapper">
                          Loading barangays...{" "}
                          <FaSpinner className="loading-icon" />
                        </div>
                      ) : (
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
                name="addressLine"
                placeholder="Street Name, Building, House No."
                className="streetname-building-house-no"
                value={formData.addressLine || ""}
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
                    disabled
                    title="The default address cannot be un-selected. You can set another address as default address instead"
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

export default UpdateAddressModal;
