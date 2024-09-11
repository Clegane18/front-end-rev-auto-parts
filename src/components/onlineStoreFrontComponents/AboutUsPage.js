import React from "react";
import "../../styles/onlineStoreFrontComponents/AboutUsPage.css";
import OnlineStoreFrontHeader from "./OnlineStoreFrontHeader";
import OnlineStoreFrontFooter from "./OnlineStoreFrontFooter";

const AboutUsPage = () => {
  return (
    <div id="root-about-us-page">
      <OnlineStoreFrontHeader />

      <div className="about-us-container">
        <div className="about-us-content">
          <h1 className="about-us-heading">Our Story</h1>
          <p className="about-us-description">
            G&F Auto Supply, established in 2016, formerly known as “GNF Auto
            Parts Center,” is more than just an automobile supply company; it's
            a testament to the enduring bonds of the partners’ pursuit towards a
            shared dream.
          </p>
          <p className="about-us-description">
            Founded by a group of long-time friends, G&F Auto Supply stands as a
            tribute to one individual’s vision and legacy, brought to life by
            the collective efforts of those who shared his lifelong dream.
          </p>
        </div>
        <div className="about-us-logo-container">
          <img
            src={require("../../assets/g&f-logo.png")}
            alt="G&F Auto Supply Logo"
            className="about-us-logo"
          />
        </div>
      </div>

      <div className="company-info-container">
        <h2 className="company-overview-heading">Company Overview</h2>
        <p className="company-info-description">
          From the smallest components to essential maintenance supplies, G&F
          Auto Supply prides itself on providing an extensive selection of
          products to meet the diverse needs of our customers. Our commitment to
          excellence extends beyond our products, as we strive to deliver
          exceptional service and support at every step of the journey.
        </p>

        <div className="mission-vision-container">
          <h3 className="mission-heading">Mission</h3>
          <div className="mission-vision-text-container">
            <p className="mission-vision-text">
              Guided by our mission to uphold the legacy of our friend and
              excellence, we are committed to exceeding expectations and
              building lasting relationships.
            </p>
          </div>
          <h3 className="vision-heading">Vision</h3>
          <div className="mission-vision-text-container">
            <p className="mission-vision-text">
              At G&F Auto Supply, our vision is to become the leading provider
              of high-quality auto parts and accessories, delivering
              unparalleled value and service to our customers.
            </p>
          </div>
        </div>

        <h3 className="product-range-heading">Product Range</h3>
        <ul className="product-range-list">
          <li className="small-letter">
            Specializing in truck-type vehicle parts and accessories.
          </li>
          <li className="small-letter">
            Comprehensive inventory, ranging from the smallest components to
            essential maintenance supplies.
          </li>
          <li className="small-letter">
            Proudly offering parts for renowned brands such as Suzuki, Honda,
            Hyundai, Toyota, Mitsubishi, Foton, Howo, JAC, Isuzu, Nissan, Hino,
            and more.
          </li>
        </ul>
      </div>
      <OnlineStoreFrontFooter />
    </div>
  );
};

export default AboutUsPage;
