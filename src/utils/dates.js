export const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const days = Array.from({ length: 31 }, (v, k) => ({
  value: (k + 1).toString().padStart(2, "0"),
  label: (k + 1).toString().padStart(2, "0"),
}));

export const years = Array.from({ length: 100 }, (_, i) => ({
  value: String(new Date().getFullYear() - i),
  label: String(new Date().getFullYear() - i),
}));
