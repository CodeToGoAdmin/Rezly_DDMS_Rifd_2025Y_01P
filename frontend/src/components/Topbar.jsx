import React from 'react'
import { Bell, MessageCircle, Settings } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="w-full flex items-center justify-between bg-[#F8F9FA] px-6 py-2 ">
      
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
        مرحباً بك في لوحة التحكم، نتمنى لك يوماً مثمراً!
      </h2>
      <div className="flex items-center gap-4">
             <div className="relative">
          <MessageCircle className="cursor-pointer text-[#6A0EAD] hover:text-black" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
            4
          </span>
          
        </div>
         <div className="relative">
          <Bell className="cursor-pointer text-[#6A0EAD] hover:text-black" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
            4
          </span>
          
        </div>
        <Settings className="cursor-pointer text-[#6A0EAD] hover:text-black" />
       
      
        
      </div>
    </header>
  )
}
