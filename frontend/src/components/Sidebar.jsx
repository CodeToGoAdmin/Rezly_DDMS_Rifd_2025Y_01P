import React, { useState } from 'react'
import Homesidebar from '../assets/icon/homesidebar.svg'
import Employeeside from '../assets/icon/employeeside.svg'
import WalletSide from '../assets/icon/walletSide.svg'
import Booking from '../assets/icon/booking.svg'
import Logout from '../assets/icon/logoutsidbar.svg'
import Logo from '../assets/icon/rezly-logo.svg'

export default function Sidebar() {
  const [active, setActive] = useState('home')

  const menuItems = [
    { id: 'home', label: 'الصفحة الرئيسية', icon: Homesidebar },
    { id: 'booking', label: 'إدارة العملاء', icon: Booking },
    { id: 'employees', label: 'طاقم العمل', icon: Employeeside },
    { id: 'finance', label: 'المالية', icon: WalletSide },
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">

      {/* الـ Sidebar */}
      <aside className="w-64 bg-[#F8F9FA] p-5 flex flex-col min-h-[150vh] font-[Cairo] overflow-y-auto scroll-smooth">

        {/* اللوجو */}
        <div className="logo p-3">
          <img src={Logo} alt='rezly logo' className='w-30 h-13 m-auto' />
        </div>

        {/* القائمة */}
        <nav className="flex-1 mt-3">
          <ul className="space-y-4">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActive(item.id)}
                  className={`w-full flex items-center justify-start gap-3 p-3 rounded-xl
                              hover:text-black hover:bg-white
                              border-none transition`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#6A0EAD] text-white">
                    <img src={item.icon} className="w-7 h-6" />
                  </div>
                  <span className={`text-[14px] leading-[21px] font-[Cairo] ${active === item.id ? 'font-bold text-black' : 'font-normal text-black'}`}>
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* زر تسجيل الخروج */}
        <div className="mt-auto">
          <button className="w-full flex items-center justify-start gap-3 p-3 rounded-xl 
                             border-none transition hover:text-black hover:bg-white">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#6A0EAD] text-white">
              <img src={Logout} className="w-7 h-6" />
            </div>
            <span className="text-[14px] leading-[21px] font-bold text-black">تسجيل الخروج</span>
          </button>
        </div>

      </aside>

      {/* المحتوى حسب active */}
      <main className="flex-1 p-6">
        {/* هنا يمكن وضع محتوى كل صفحة حسب active */}
      </main>

    </div>
  )
}
