import React from "react";
import "../../styles/onlineStoreFrontComponents/ContactUsPage.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import OnlineStoreFrontHeader from "./OnlineStoreFrontHeader";
import OnlineStoreFrontFooter from "./OnlineStoreFrontFooter";

const ContactUsPage = () => {
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
                Phone: +639175590729/ +639329605591
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
                Emails: gf.autosupply1724@gmail.com
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
                href="https://www.google.com/maps"
                class="get-directions-button"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <form className="contact-form">
            <div className="form-row">
              <input type="text" placeholder="Your Name " required />
              <input type="email" placeholder="Your Email " required />
              <input type="tel" placeholder="Your Phone " required />
            </div>
            <textarea placeholder="Your Message" required />
            <button type="submit" className="send-message-button">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <OnlineStoreFrontFooter />
    </div>
  );
};

export default ContactUsPage;
