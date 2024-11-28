import React, { useState, useEffect } from "react";
import "../../styles/dashboardComponents/ETAModal.css";

const ETAModal = ({ order, onClose, onUpdateETA }) => {
  const [etaDate, setEtaDate] = useState("");

  useEffect(() => {
    if (order && order.eta) {
      const etaDate = new Date(order.eta);

      const formattedDate = etaDate.toISOString().split("T")[0];
      setEtaDate(formattedDate);
    }
  }, [order]);

  const formatDateToMMDDYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSave = () => {
    if (!etaDate) {
      alert("Please provide an ETA date.");
      return;
    }

    const formattedEta = formatDateToMMDDYYYY(etaDate);
    onUpdateETA(formattedEta);
    onClose();
  };

  const handleDateChange = (e) => {
    const inputValue = e.target.value;
    setEtaDate(inputValue);
  };

  return (
    <div id="root-eta-modal">
      <div className="modal-overlay">
        <div className="eta-modal">
          <h3>Set Estimated Time of Arrival (ETA)</h3>
          <div className="modal-body">
            <label>
              ETA Date:{" "}
              <input type="date" value={etaDate} onChange={handleDateChange} />
            </label>
          </div>
          <div className="modal-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETAModal;
