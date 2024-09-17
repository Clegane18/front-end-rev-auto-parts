export const printWaybill = (order, formatCurrency) => {
  const printWindow = window.open("", "_blank", "width=400,height=600");

  if (printWindow) {
    // Wait until the window is fully ready
    printWindow.document.open(); // Ensure document is open
    printWindow.document.write(`
        <html>
          <head>
            <title>Print Waybill - Order #${order.orderNumber}</title>
            <style>
              body {
                font-family: 'Montserrat', serif;
                text-transform: none;
                padding: 10px;
                margin: 0;
                width: 4in;
                height: 6in;
              }
              .header-section {
                border-bottom: 1px solid #ddd;
                margin-bottom: 10px;
                padding-bottom: 5px;
              }
              .header-section h2 {
                font-size: 16px;
                font-weight: bold;
                color: #d30a0a;
                text-transform: uppercase;
              }
              .header-info {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #333;
                padding: 5px 0;
              }
              .items-section h3 {
                font-size: 14px;
                font-weight: bold;
                color: #d30a0a;
                text-transform: uppercase;
                padding-bottom: 5px;
                margin-bottom: 5px;
              }
              .item-row {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                padding: 3px 0;
                border-bottom: 1px solid #ddd;
              }
              .customer-shipping-section {
                display: flex;
                justify-content: space-between;
                padding-top: 5px;
                font-size: 12px;
              }
              .customer-details, .shipping-details {
                width: 45%;
              }
              .customer-details h3, .shipping-details h3 {
                font-size: 14px;
                font-weight: bold;
                color: #d30a0a;
                text-transform: uppercase;
              }
              .customer-details p, .shipping-details p {
                font-size: 12px;
                margin-bottom: 3px;
                color: #333;
              }
            </style>
          </head>
          <body>
            <div class="header-section">
              <h2>ORDER #${order.orderNumber}</h2>
              <div class="header-info">
                <span>Status: <strong>${order.status}</strong></span>
                <span>Total Amount: <strong>${formatCurrency(
                  order.totalAmount
                )}</strong></span>
                <span>Order Date: <strong>${new Date(
                  order.createdAt
                ).toLocaleDateString()}</strong></span>
              </div>
            </div>
  
            <div class="items-section">
              <h3>Items Ordered</h3>
              ${order.items
                .map(
                  (item) => `
                <div class="item-row">
                  <div class="item-details">
                    <span class="item-name">${item.productName}</span>
                    <span class="item-quantity">Qty: ${item.quantity}</span>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
  
            <div class="customer-shipping-section">
              <div class="shipping-details">
                <h3>Shipping Address</h3>
                <p>Full Name: <strong>${order.address.fullName}</strong></p>
                <p>Phone: <strong>${order.customer.phoneNumber}</strong></p>
                <p>Region: <strong>${order.address.region}</strong></p>
                <p>Province: <strong>${order.address.province}</strong></p>
                <p>City: <strong>${order.address.city}</strong></p>
                <p>Barangay: <strong>${order.address.barangay}</strong></p>
                <p>Postal Code: <strong>${order.address.postalCode}</strong></p>
                <p>Address Line: <strong>${
                  order.address.addressLine
                }</strong></p>
              </div>
            </div>
          </body>
        </html>
      `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  } else {
    console.error("Failed to open print window.");
  }
};
