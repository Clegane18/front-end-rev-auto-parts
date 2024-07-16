export const formatCurrency = (amount) => {
  return `₱${parseFloat(amount).toLocaleString()}`;
};
