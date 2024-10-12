export const calculateRemainingBalance = (items) => {
  return items
    .filter((item) => item.purchaseMethod === "in-store-pickup")
    .reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity * 0.8,
      0
    );
};
