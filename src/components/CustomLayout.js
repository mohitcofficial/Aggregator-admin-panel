import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function CustomLayout({ children }) {
  return (
    <>
      <Sidebar />
      <Header />
      <main
        style={{
          padding: "60px 0 0 70px",
          zIndex: "0",
        }}
      >
        {children}
      </main>
    </>
  );
}

export default CustomLayout;
