import React from "react";
import "../../styles/onlineStoreFrontComponents/OnlineStoreFrontFooter.css";

const OnlineStoreFrontFooter = () => {
  return (
    <div id="root-online-store-front-footer">
      <footer className="footer">
        <div className="newsletter">
          <h2>G&F Auto Parts</h2>
          <p>Shop Now</p>
          <input type="email" placeholder="Enter your email" />
          <button>➤</button>
        </div>
        <div className="footer-content">
          {/* Sections for support, account, quick links, and social media */}
        </div>
        <p className="copyright">Copyright © GNF 2024. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OnlineStoreFrontFooter;
