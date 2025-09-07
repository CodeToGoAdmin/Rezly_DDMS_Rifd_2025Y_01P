import React from 'react'
import { Bell, MessageCircle, Settings } from 'lucide-react'
import BellIcon from '../assets/icon/bell.svg'
import MessageIcon from '../assets/icon/message.svg'
import Notification from '../assets/icon/notification-on.svg'

export default function Topbar() {
  return (
    <header className="w-full flex items-center justify-between bg-[#F8F9FA] px-6 py-2 ">

<h2 className="font-cairo text-lg sm:text-xl font-semibold text-gray-800">
        مرحباً بك في لوحة التحكم، نتمنى لك يوماً مثمراً!
      </h2>
      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={MessageIcon} alt="bell" className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
            4
          </span>

        </div>
        <div className="relative">
          <img src={Notification} alt="notification icon" className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
            4
          </span>

        </div>

        <img src={BellIcon} alt="settings icon" className="w-6 h-6" />



      </div>
    </header>
  )
}
