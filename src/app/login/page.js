"use client";
import React, { useState } from "react";
import ADMIN_APIs from "../../services/api/Admin.api.services";

function page() {
  const [email, setEmail] = useState("mohitchandraofficial@gmail.com");
  const [password, setPassword] = useState("mausi@1234567");

  const handleLogin = async () => {
    const body = {
      email,
      password,
    };
    const response = await ADMIN_APIs.login(body);
    console.log("res: ", response);
  };
  return (
    <div>
      Login Page
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Submit</button>
    </div>
  );
}

export default page;
