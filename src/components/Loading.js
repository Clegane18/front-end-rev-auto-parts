import React from "react";
import "../styles/Loading.css";
import loadingGif from "../assets/loading.gif";

const Loading = () => (
  <div id="root-loading-component">
    <div className="loading-container">
      <img src={loadingGif} alt="Loading..." className="loading-image" />
      <div className="dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  </div>
);

export default Loading;
