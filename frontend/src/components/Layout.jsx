import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="w-full min-h-screen bg-bg flex">
      {/* Sidebar ثابت على الشاشات الكبيرة - drawer على الموبايل */}
      <div className="hidden lg:block">
        <Sidebar onClose={() => setOpenSidebar(false)} />
      </div>

      {/* Drawer للموبايل */}
      {openSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenSidebar(false)}
          />
          <div className="absolute left-0 top-0 w-64 h-full bg-bg p-4">
            <Sidebar onClose={() => setOpenSidebar(false)} />
          </div>
        </div>
      )}

      {/* المحتوى */}
      <div className=" flex flex-col">
        {/* تمرير الفنكشن لزر فتح السايدبار بالموبايل داخل Topbar */}
        <Topbar onMenuClick={() => setOpenSidebar(true)} />

        <main className="p-6 w-full  overflow-auto">
          {/* هنا يتغير المحتوى حسب الراوت */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
