import React from 'react'
import { Home, BarChart3, Users, Wallet, LogOut } from 'lucide-react'

export default function Sidebar() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <aside className="w-64 bg-[#F8F9FA] p-5 flex flex-col h-screen">

        <nav className="flex-1 pt-8 mt-8 ">
          <ul className="space-y-4">

            <li>
              <button
                className="w-full flex items-center justify-start gap-3 p-3 rounded-xl
               text-[#7E818C] hover:text-black hover:bg-white
               border-0 focus:outline-none focus:ring-0 transition"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center 
                 bg-[#6A0EAD] text-white"
                >
                  <Home className="w-4 h-4" />
                </div>
                <span>الصفحة الرئيسية</span>
              </button>
            </li>


            <li>
              <button className="w-full flex items-center justify-start gap-3 p-3 rounded-xl 
                                 text-[#7E818C] hover:text-black hover:bg-white border-none transition">
                <div className="w-8 h-8 rounded-full flex items-center justify-center 
                                bg-[#6A0EAD] text-white">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span>الحجوزات</span>
              </button>
            </li>

            <li>
              <button className="w-full flex items-center justify-start gap-3 p-3 rounded-xl 
                                 text-[#7E818C] hover:text-black hover:bg-white border-none transition">
                <div className="w-8 h-8 rounded-full flex items-center justify-center 
                                bg-[#6A0EAD] text-white">
                  <Users className="w-4 h-4" />
                </div>
                <span>الموارد البشرية</span>
              </button>
            </li>

            <li>
              <button className="w-full flex items-center justify-start gap-3 p-3 rounded-xl 
                                 text-[#7E818C] hover:text-black hover:bg-white border-none transition">
                <div className="w-8 h-8 rounded-full flex items-center justify-center 
                                bg-[#6A0EAD] text-white">
                  <Wallet className="w-4 h-4" />
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
              <LogOut className="w-4 h-4" />
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
