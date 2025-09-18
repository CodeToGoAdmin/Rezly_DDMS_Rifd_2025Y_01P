import React from 'react'
import BellIcon from '../assets/icon/bell.svg'
import MessageIcon from '../assets/icon/message.svg'
import Notification from '../assets/icon/notification-on.svg'

export default function Topbar() {
  return (
    <header className="w-full flex items-center justify-between bg-[#F8F9FA] px-6 py-5">

      <h2 className="text-black text-[16px] font-cairo font-bold leading-[24px] break-words">
        مرحباً بك في لوحة التحكم، نتمنى لك يوماً مثمراً!
      </h2>

      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={MessageIcon} alt="bell" className="w-6 h-6" />
          <span className="absolute -top-1  bg-red-500 text-white text-[10px] px-1 rounded-full">
            4
          </span>
        </div>

        <div className="relative">
          <img src={Notification} alt="notification icon" className="w-6 h-6" />
          <span className="absolute -top-1 -right-0 bg-red-500 text-white text-[10px] px-1 rounded-full">
            4
          </span>
        </div>

        <img src={BellIcon} alt="settings icon" className="w-6 h-6" />
      </div>
    </header>
  )
}
