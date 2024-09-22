import React, { useState } from "react";
import "../../styles/onlineStoreFrontComponents/UploadPhotoModal.css";
import { FaUpload, FaTimes } from "react-icons/fa";

const UploadPhotoModal = ({ product, onClose, onSave }) => {
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
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
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
    setIsDragging(false);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (files.length === 0) {
      setErrorMessage("Please select at least one file to upload.");
      return;
    }
    onSave(product, files);
  };

  return (
    <div id="root-upload-photo-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Upload Photos for {product?.name}</h2>
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
              {files.length > 0
                ? `${files.length} file(s) selected`
                : "Choose Files or Drag and Drop Here"}
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <div className="selected-files">
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>
                      {file.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="remove-file-button"
                        title="Remove File"
                      >
                        <FaTimes />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="button-group">
              <button type="submit" className="upload-button">
                Upload
              </button>
              <button type="button" onClick={onClose} className="cancel-button">
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
