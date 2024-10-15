import React, { useState } from "react";
import "../styles/Loading.css";
import loadingGif from "../assets/loading.gif";

const Loading = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div id="root-loading-component">
      <div className="loading-container">
        <img
          src={loadingGif}
          alt="Loading..."
          className="loading-image"
          onLoad={() => setImageLoaded(true)}
          style={{ visibility: imageLoaded ? "visible" : "hidden" }}
        />
        <div
          className="dots"
          style={{ visibility: imageLoaded ? "visible" : "hidden" }}
        >
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
