import React, { useState } from "react";
import "../../styles/onlineStoreFrontComponents/UploadPhotoModal.css";
import { FaUpload, FaTimes } from "react-icons/fa";

const UploadPhotoModal = ({ product, onClose, onSave }) => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
    setIsDragging(false);
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
            <label
              htmlFor="file-upload"
              className={`file-upload-label ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FaUpload className="upload-icon" />{" "}
              {file ? file.name : "Choose File or Drag and Drop Here"}
            </label>
            <input id="file-upload" type="file" onChange={handleFileChange} />
            <div className="button-group">
              <button type="submit">Upload</button>
              <button type="button" onClick={onClose}>
                <FaTimes className="cancel-icon" /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
