import React, { useEffect, useRef } from "react";
import "../styles/LogoutModal.css";

const LogoutModal = ({ isOpen, message, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (typeof onClose === "function") {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div id="root-automatic-log-out-modal">
      <div className="logout-modal-overlay">
        <div className="logout-modal-content" ref={modalRef}>
          <h2>Session Expired</h2>
          <p>{message}</p>
          <p>You will be logged out automatically.</p>
          <button className="logout-modal-ok-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
