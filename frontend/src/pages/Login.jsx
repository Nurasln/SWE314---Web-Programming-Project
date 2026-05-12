import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [pin, setPin] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`/api/admin/login?pin=${pin}`);
      
      // TOKEN YOKSA bile role sakla (şimdilik)
      localStorage.setItem("role", res.data.role);

      alert("Login başarılı");
      window.location.href = "/";
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

      <input
        type="password"
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="border p-2 rounded mb-4"
      />

      <button
        onClick={handleLogin}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default Login;