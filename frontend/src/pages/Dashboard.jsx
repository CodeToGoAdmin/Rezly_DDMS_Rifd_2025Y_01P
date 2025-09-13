import React from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Chart from '../components/Chart'
import AttendanceTable from '../components/AttendanceTable/AttendanceTable'
import StatCard from '../components/StatCard'
import Calender2 from "../components/Calender/Calender2"

import Icon1 from '../assets/icon/card-icon1.svg'
import Icon2 from '../assets/icon/card-icon2.svg'
import Icon3 from '../assets/icon/card-icon3.svg'
import Icon4 from '../assets/icon/card-icon4.svg'

export default function Dashboard() {

  // ملاحظة: أزلنا w-[216px] وحطينا w-full
  const cardProps = "flex flex-col items-start gap-2 h-[126px] p-[24px_16px] w-full"

  return (
    <div className="w-screen min-h-screen flex bg-[#F8F9FA] font-[Cairo]">

      {/* Sidebar */}
      <Sidebar className="w-64 bg-white" />

      {/* Main content */}
      <div className="flex-1 flex flex-col pt-6 gap-6">

        {/* Topbar */}
        <div className="w-full">
          <Topbar />
        </div>

        {/* Page content */}
        <div className="flex-1 flex gap-6">

          {/* Left section: cards + chart + table */}
          <div className="max-w-[720px] w-full flex flex-col gap-6 mx-auto">

            {/* Cards Grid */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <StatCard 
                value={<span className="text-black font-cairo text-[28px] font-bold leading-normal tracking-[1px] break-words">60</span>} 
                icon={Icon1} 
                title={<span className="text-black text-right font-cairo text-[12px] font-bold leading-[18px] break-words">إشغال المكان</span>} 
                className={cardProps} 
                bgColor="#9333EA" 
              />
              <StatCard 
                value={<span className="text-black font-cairo text-[28px] font-bold leading-normal tracking-[1px] break-words">$440</span>} 
                icon={Icon2} 
                title={<span className="text-black text-right font-cairo text-[12px] font-bold leading-[18px] break-words">إيرادات اليوم</span>} 
                className={cardProps} 
                bgColor="#22C55E" 
              />
              <StatCard 
                value={<span className="text-black font-cairo text-[28px] font-bold leading-normal tracking-[1px] break-words">23</span>} 
                icon={Icon3} 
                title={<span className="text-black text-right font-cairo text-[12px] font-bold leading-[18px] break-words">اشتراكات اليوم</span>} 
                className={cardProps} 
                bgColor="#3B82F6" 
              />
              <StatCard 
                value={<span className="text-black font-cairo text-[28px] font-bold leading-normal tracking-[1px] break-words">15</span>} 
                icon={Icon4} 
                title={<span className="text-black text-right font-cairo text-[12px] font-bold leading-[18px] break-words">زوار الموقع الآن</span>} 
                className={cardProps} 
                bgColor="#FACC15" 
              />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl shadow p-4 w-full">
              <Chart />
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-2xl shadow p-4 w-full">
              <AttendanceTable />
            </div>

          </div>

          {/* Right section - Calendar */}
          <div className="flex-1 pr-6">
            <div className="bg-white rounded-2xl shadow p-4 h-full">
              <Calender2 />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
