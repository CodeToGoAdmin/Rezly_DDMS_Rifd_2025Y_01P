import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// ممكن تستخدم lazy loading للصفحات الكبيرة
const Home = lazy(() => import("./pages/Home"));
const Clients = lazy(() => import("./pages/Clients"));
const Employees = lazy(() => import("./pages/Employees"));
const Finance = lazy(() => import("./pages/Finance"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="p-6">جارٍ التحميل...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="clients" element={<Clients />} />
            <Route path="employees" element={<Employees />} />
            <Route path="finance" element={<Finance />} />
          </Route>

        </Routes>
      </Suspense>
    </Router>
  );
}
