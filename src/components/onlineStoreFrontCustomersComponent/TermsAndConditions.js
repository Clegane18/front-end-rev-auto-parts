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
          process of purchasing items online through our website and picking
          them up in-store.
        </p>

        <h3>1. IN-STORE PICKUP</h3>
        <p>
          <strong>1.1.</strong> Certain items, such as car wheels, are not
          available for delivery and must be picked up from our physical store.
        </p>
        <p>
          <strong>1.2.</strong> Customers purchasing these specific items online
          acknowledge and agree that they will pick up the purchased items from
          our designated store location.
        </p>

        <h3>2. PURCHASING PROCESS</h3>
        <p>
          <strong>2.1.</strong> Customers must complete the purchase of the
          items online through our website.
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

        <h3>3. DELIVERY POLICY</h3>
        <p>
          <strong>3.1.</strong> Items can be delivered to the default address
          provided during checkout.
        </p>
        <p>
          <strong>3.2.</strong> <strong>Free Shipping:</strong> Delivery
          addresses within Metro Manila are eligible for free shipping.
        </p>
        <p>
          <strong>3.3.</strong> For delivery addresses outside Metro Manila,
          shipping fees are calculated as follows:
        </p>
        <p>
          <strong>3.3.1.</strong> A base shipping fee of ₱50 applies.
        </p>
        <p>
          <strong>3.3.2.</strong> An additional charge of ₱5 per kilometer is
          added for every kilometer outside Metro Manila.
        </p>
        <p>
          Shipping fees are calculated during checkout based on the distance
          from Metro Manila.
        </p>
        <p>
          <strong>3.4.</strong> Customers must ensure that the delivery address
          provided is accurate. G&F Auto Supply will not be responsible for
          failed deliveries due to incorrect or incomplete addresses.
        </p>

        <h3>4. PICKUP PROCEDURE</h3>
        <p>
          <strong>4.1.</strong> Items will be available for pickup at our
          designated store location during regular business hours.
        </p>
        <p>
          <strong>4.2.</strong> Customers must pick up the purchased items
          within 7 days from the date of purchase. Failure to do so may result
          in cancellation of the order and forfeiture of payment.
        </p>
        <p>
          <strong>4.3.</strong> In the event that a customer is unable to pick
          up the purchased items personally, they may designate a representative
          to do so on their behalf. The representative must present a signed
          authorization letter from the customer along with their own
          government-issued identification.
        </p>

        <h3>5. LIABILITY AND RESPONSIBILITY</h3>
        <p>
          <strong>5.1.</strong> Customers are solely responsible for inspecting
          the purchased items at the time of pickup and ensuring that they meet
          their expectations and requirements.
        </p>
        <p>
          <strong>5.2.</strong> Any damages, defects, or discrepancies must be
          reported to our staff immediately upon pickup for resolution.
        </p>

        <h3>6. CANCELLATION AND REFUNDS</h3>
        <p>
          <strong>6.1.</strong> Orders for items eligible for in-store pickup
          cannot be canceled or refunded once the pickup process has been
          initiated.
        </p>
        <p>
          <strong>6.2.</strong> Orders for deliverable items cannot be canceled
          or refunded once the items have been shipped.
        </p>

        <h3>7. PROTECTION AGAINST SCAMS</h3>
        <p>
          <strong>7.1.</strong> In-store pickup of items is implemented to
          protect our store from fraudulent activities and scams.
        </p>
        <p>
          <strong>7.2.</strong> By requiring in-store pickup, we can verify the
          authenticity of the purchase and ensure that the customer receives the
          correct product.
        </p>

        <h3>8. AMENDMENT OF TERMS</h3>
        <p>
          <strong>8.1.</strong> We reserve the right to amend these terms and
          conditions at any time without prior notice. Any changes will be
          effective immediately upon posting on our website.
        </p>

        <h3>9. CONTACT INFORMATION</h3>
        <p>
          <strong>9.1.</strong> For any inquiries or assistance regarding
          in-store pickup of items, please contact us at{" "}
          <a href="mailto:support@gnfauto.com">support@gnfauto.com</a> or call
          us at 09123456789.
        </p>

        <h3>9. ACCOUNT SUSPENSION</h3>
        <p>
          <strong>9.1.</strong> We reserve the right to suspend customer
          accounts under the following conditions:
        </p>
        <p>
          <strong>9.1.1.</strong> If false information is provided during the
          purchase process or account registration.
        </p>
        <p>
          <strong>9.1.2.</strong> If the customer fails to pick up orders within
          the specified timeframe.
        </p>
        <p>
          <strong>9.1.3.</strong> If there are repeated violations of our terms
          and conditions or other fraudulent activities related to purchases.
        </p>
        <p>
          <strong>9.2.</strong> Suspended accounts will not have access to
          website features until the issue is resolved.
        </p>
        <h3>10. ACCOUNT DELETION</h3>
        <p>
          <strong>10.1.</strong> We reserve the right to delete customer
          accounts under the following conditions:
        </p>
        <p>
          <strong>10.1.1.</strong> Severe or repeated violations of our terms
          and conditions.
        </p>
        <p>
          <strong>10.1.2.</strong> Engagement in fraudulent activities or scams
          that harm our business or other customers.
        </p>
        <p>
          <strong>10.1.3.</strong> Legal requirements or court orders mandating
          account deletion.
        </p>
        <p>
          <strong>10.2.</strong> Deleted accounts will permanently lose access
          to all purchase history, saved information, and any pending orders.
        </p>
        <p>
          <strong>10.3.</strong> Customers may also request the deletion of
          their accounts at any time by contacting customer support at{" "}
          <a href="mailto:support@gnfauto.com">support@gnfauto.com</a>.
        </p>
        <p>
          <strong>10.4.</strong> We are not responsible for any loss of data
          resulting from the deletion of an account, whether initiated by us or
          at the customer's request.
        </p>

        <button
          className="back-button"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/");
            }
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
