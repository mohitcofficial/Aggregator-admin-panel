import React from "react";

const Loader = () => {
  return (
    <div style={overlayStyle}>
      <div
        style={{ ...spinnerStyle, animation: "spin 1s linear infinite" }}
      ></div>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  zIndex: 9998,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const spinnerStyle = {
  zIndex: 9999,
  width: "50px",
  height: "50px",
  border: "6px solid rgba(22, 79, 99, 0.3)",
  borderTopColor: "#226178",
  borderRadius: "50%",
};

export default Loader;
