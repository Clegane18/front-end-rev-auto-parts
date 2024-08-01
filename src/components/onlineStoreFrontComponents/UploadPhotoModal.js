import React, { useState } from "react";
import "../../styles/onlineStoreFrontComponents/UploadPhotoModal.css";

const UploadPhotoModal = ({ product, onClose, onSave }) => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }
    onSave(product, file);
  };

  return (
    <div id="root-upload-photo-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Upload Photo for {product?.name}</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={handleSave}>
            <label>Choose File</label>
            <input type="file" onChange={handleFileChange} />
            <div className="button-group">
              <button type="submit">Upload</button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
