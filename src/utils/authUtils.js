import { jwtDecode } from "jwt-decode";

export const getTokenExpirationTime = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp) {
      return decodedToken.exp * 1000;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }
  return null;
};

export const getRemainingTime = (expirationTime) => {
  const currentTime = Date.now();
  return expirationTime - currentTime;
};
