import React from "react";
import "../styles/loader.css";
import animacionLogo from "../assets/animacion_logo.mp4";

export default function Loader() {
  return (
    <div className="loader-container">
      <video
        className="loader-video"
        src={animacionLogo}
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
