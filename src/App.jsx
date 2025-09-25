// src/App.jsx
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import React from "react";
import Dashboard from "./components/Dashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {}

          <Dashboard />
    </div>
  );
}

export default App;
