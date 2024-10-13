import React, { useState } from "react";
import "../../styles/onlineStoreFrontComponents/ContactUsPage.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import OnlineStoreFrontHeader from "./OnlineStoreFrontHeader";
import OnlineStoreFrontFooter from "./OnlineStoreFrontFooter";
import { sendContactUsEmail } from "../../services/online-store-front-api";
import SuccessModal from "../SuccessModal";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await sendContactUsEmail(formData);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setIsModalOpen(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div id="root-contact-us-page">
      <OnlineStoreFrontHeader />

      <div className="contact-us-content">
        <div className="contact-options">
          <div className="contact-option">
            <FaPhoneAlt className="icon" />
            <div className="contact-details">
              <h3>Call To Us</h3>
              <p className="contact-us-text">
                We are available 24/7, 7 days a week.
              </p>
              <p className="contact-us-text">
                Phone: +639175590729 / +639329605591
              </p>
            </div>
          </div>
          <div className="contact-option">
            <FaEnvelope className="icon" />
            <div className="contact-details">
              <h3>Write To Us</h3>
              <p className="contact-us-text">
                Fill out our form and we will contact you within 72 hours.
              </p>
              <p className="contact-us-text">
                Email: gf.autosupply1724@gmail.com
              </p>
            </div>
          </div>
          <div className="contact-option">
            <FaMapMarkerAlt className="icon" />
            <div className="contact-details">
              <h3>Location</h3>
              <p className="contact-us-text">
                1104 Gov Fortunato Halili Rd, Santa Maria, Bulacan
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=1104+Gov+Fortunato+Halili+Rd,+Santa+Maria,+Bulacan"
                className="get-directions-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleInputChange}
              required
            />
            <button
              type="submit"
              className="send-message-button"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>

      <OnlineStoreFrontFooter />

      {isModalOpen && (
        <SuccessModal
          message="Your message has been successfully sent!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ContactUsPage;
