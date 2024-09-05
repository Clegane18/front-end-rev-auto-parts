import React from "react";
import OnlineStoreFrontHeader from "../onlineStoreFrontComponents/OnlineStoreFrontHeader";
import OnlineStoreFrontFooter from "../onlineStoreFrontComponents/OnlineStoreFrontFooter";

const OnlineStoreFrontCustomerLandingPage = () => {
  return (
    <div id="root-online-store-front-customer-landing-page">
      <div className="landing-page">
        <OnlineStoreFrontHeader />
        <main className="main-content">
          <h1>Welcome to G&F Auto Supply</h1>
          <p>Your one-stop shop for all automobile parts and accessories.</p>
        </main>
        <OnlineStoreFrontFooter />
      </div>
    </div>
  );
};

export default OnlineStoreFrontCustomerLandingPage;
