import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/onlineStoreFrontCustomersComponent/TermsAndConditions.css";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div id="root-terms-and-conditions">
      <div className="terms-container">
        <h2 className="terms-header">Terms and Conditions</h2>
        <p className="last-revised">
          <strong>Last Revised:</strong> April 16, 2024
        </p>
        <p className="intro">
          Welcome to G&F Auto Supply. These terms and conditions govern the
          process of purchasing car parts online through our website and picking
          them up in-store.
        </p>

        <h3>1. IN-STORE PICKUP</h3>
        <p>
          <strong>1.1.</strong> Certain car parts, such as car wheels, are not
          available for delivery and must be picked up from our physical store.
        </p>
        <p>
          <strong>1.2.</strong> Customers purchasing these specific car parts
          online acknowledge and agree that they will pick up the purchased
          items from our designated store location.
        </p>

        <h3>2. PURCHASING PROCESS</h3>
        <p>
          <strong>2.1.</strong> Customers must complete the purchase of the car
          parts online through our website.
        </p>
        <p>
          <strong>2.2.</strong> Upon successful completion of the online
          purchase, customers will receive confirmation of their order along
          with instructions for in-store pickup.
        </p>
        <p>
          <strong>2.3.</strong> Customers must present a valid order
          confirmation and government-issued identification matching the name on
          the order at the time of pickup.
        </p>

        <h3>3. PICKUP PROCEDURE</h3>
        <p>
          <strong>3.1.</strong> Car parts will be available for pickup at our
          designated store location during regular business hours.
        </p>
        <p>
          <strong>3.2.</strong> Customers must pick up the purchased car parts
          within [specify timeframe, e.g., 7 days] from the date of purchase.
          Failure to do so may result in cancellation of the order and
          forfeiture of payment.
        </p>
        <p>
          <strong>3.3.</strong> In the event that a customer is unable to pick
          up the purchased car parts personally, they may designate a
          representative to do so on their behalf. The representative must
          present a signed authorization letter from the customer along with
          their own government-issued identification.
        </p>

        <h3>4. LIABILITY AND RESPONSIBILITY</h3>
        <p>
          <strong>4.1.</strong> Customers are solely responsible for inspecting
          the purchased car parts at the time of pickup and ensuring that they
          meet their expectations and requirements.
        </p>
        <p>
          <strong>4.2.</strong> Any damages, defects, or discrepancies must be
          reported to our staff immediately upon pickup for resolution.
        </p>

        <h3>5. CANCELLATION AND REFUNDS</h3>
        <p>
          <strong>5.1.</strong> Orders for car parts eligible for in-store
          pickup cannot be canceled or refunded once the pickup process has been
          initiated.
        </p>

        <h3>6. PROTECTION AGAINST SCAMS</h3>
        <p>
          <strong>6.1.</strong> In-store pickup of car parts is implemented to
          protect our store from fraudulent activities and scams.
        </p>
        <p>
          <strong>6.2.</strong> By requiring in-store pickup, we can verify the
          authenticity of the purchase and ensure that the customer receives the
          correct product.
        </p>

        <h3>7. AMENDMENT OF TERMS</h3>
        <p>
          <strong>7.1.</strong> We reserve the right to amend these terms and
          conditions at any time without prior notice. Any changes will be
          effective immediately upon posting on our website.
        </p>

        <h3>8. CONTACT INFORMATION</h3>
        <p>
          <strong>8.1.</strong> For any inquiries or assistance regarding
          in-store pickup of car parts, please contact us at{" "}
          <a href="mailto:support@gnfauto.com">support@gnfauto.com</a> or call
          us at 09123456789.
        </p>

        <button
          className="back-button"
          onClick={() => navigate("/create-account")}
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
