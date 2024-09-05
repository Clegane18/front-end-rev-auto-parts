import React from "react";
import { Link } from "react-router-dom";
const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link to="/" style={styles.link}>
        Go back to Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: "48px",
    margin: "0",
    color: "#333",
  },
  message: {
    fontSize: "18px",
    marginTop: "16px",
    color: "#666",
  },
  link: {
    marginTop: "24px",
    fontSize: "16px",
    color: "#B22222",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default NotFoundPage;
