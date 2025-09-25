import React from "react";
import { NavLink } from "react-router-dom";
import Homesidebar from "../assets/icon/homesidebar.svg";
import Employeeside from "../assets/icon/employeeside.svg";
import WalletSide from "../assets/icon/walletSide.svg";
import Booking from "../assets/icon/booking.svg";
import Logo from "../assets/icon/rezly-logo.svg";

export default function Sidebar({ onClose }) {
  const menu = [
    { to: "/", label: "الصفحة الرئيسية", icon: Homesidebar },
    { to: "/clients", label: "إدارة العملاء", icon: Booking },
    { to: "/employees", label: "طاقم العمل", icon: Employeeside },
    { to: "/finance", label: "المالية", icon: WalletSide },
  ];

  return (
    <aside className="w-64 bg-bg p-5 flex flex-col min-h-screen font-[Cairo]">
      <div className="logo p-3">
        <img src={Logo} alt="logo" className="w-30 h-13 m-auto" />
      </div>

      <nav className="flex-1 mt-3">
        <ul className="space-y-4">
          {menu.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 p-3 rounded-xl transition ${
                    isActive ? "bg-white font-bold text-black" : "text-black hover:bg-white"
                  }`
                }
              >
                <div className="w-7 h-7 rounded-[12px] flex items-center justify-center bg-[var(--color-purple)]">
                  <img src={item.icon} className="w-4 h-4" alt="" />
                </div>
                <span className="text-[14px]">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <NavLink to="/login" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white">
          تسجيل الخروج
        </NavLink>
      </div>
    </aside>
  );
}
