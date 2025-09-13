import React from 'react'
import Homesidebar from '../assets/icon/homesidebar.svg'
import Employeeside from '../assets/icon/employeeside.svg'
import WalletSide from '../assets/icon/walletSide.svg'
import Booking from '../assets/icon/booking.svg'
import Logout from '../assets/icon/logoutsidbar.svg'
import Logo from '../assets/icon/rezly-logo.svg'

export default function Sidebar() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <aside className="w-64 bg-[#F8F9FA] p-5 flex flex-col h-screen">

        <nav className="flex-1">
          <div className="logo p-3">
            <img src={Logo} alt='rezly logo' className='w-30 h-13 m-auto' />
          </div>

          <ul className="space-y-4 mt-3">
            <li>
              <button className="w-full flex items-center justify-start gap-3 p-3 rounded-xl
                                 text-[#7E818C] hover:text-black hover:bg-white
                                 border-0 focus:outline-none focus:ring-0 transition">
                <div className="w-8 h-8 rounded-full flex items-center justify-center 
                                bg-[#6A0EAD] text-white">
                  <img src={Homesidebar} className="w-7 h-6" />
                </div>
                <span>الصفحة الرئيسية</span>
              </button>
            </li>

            <li>
              <button className="w-full flex items-center justify-start gap-3 p-3 rounded-xl 
                                 text-[#7E818C] hover:text-black hover:bg-white border-none transition">
                <div className="w-8 h-8 rounded-full flex items-center justify-center 
                                bg-[#6A0EAD] text-white">
                  <img src={Booking} className="w-7 h-6" />
                </div>
                <span>الحجوزات</span>
              </button>
            </li>

            <li>
              <button className="w-full flex items-center justify-start gap-3 p-3 rounded-xl 
                                 text-[#7E818C] hover:text-black hover:bg-white border-none transition">
                <div className="w-8 h-8 rounded-full flex items-center justify-center 
                                bg-[#6A0EAD] text-white">
                  <img src={Employeeside} className="w-7 h-6" />
                </div>
                <span>الموارد البشرية</span>
              </button>
            </li>

            <li>
              <button className="w-full flex items-center justify-start gap-3 p-3 rounded-xl 
                                 text-[#7E818C] hover:text-black hover:bg-white border-none transition">
                <div className="w-8 h-8 rounded-full flex items-center justify-center 
                                bg-[#6A0EAD] text-white">
                  <img src={WalletSide} className="w-7 h-6" />
                </div>
                <span>المالية</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-6">
          <button className="w-full flex items-center justify-start gap-3 p-3 rounded-xl 
                             text-[#7E818C] hover:text-black hover:bg-white border-none transition">
            <div className="w-8 h-8 rounded-full flex items-center justify-center 
                            bg-[#6A0EAD] text-white">
              <img src={Logout} className="w-7 h-6" />
            </div>
            <span>تسجيل الخروج</span>
          </button>
        </div>

      </aside>

      <main className="flex-1 p-6">
        {/* هنا محتوى الصفحة الرئيسي */}
      </main>
    </div>
  )
}
