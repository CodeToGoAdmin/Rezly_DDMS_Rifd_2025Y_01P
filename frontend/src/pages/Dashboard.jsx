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
  return (
    <div className="w-screen min-h-screen flex bg-[#F8F9FA]">

      {/* Sidebar */}
      <Sidebar className="w-64 bg-white" />

      {/* العمود الرئيسي */}
      <div className="flex-1 flex flex-col pt-6 gap-6">

        {/* Topbar يأخذ كل العرض المتبقي */}
        <div className="w-full">
          <Topbar />
        </div>

        {/* محتوى الصفحة مقسم لنصين */}
        <div className="flex-1 flex gap-6">

          {/* القسم الأيسر - الكروت + الشارت + جدول الحضور */}
          <div className="w-2/5 flex flex-col gap-6">

            {/* الكروت */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-full">
              <StatCard 
                value={<span className="text-black text-[28px] font-cairo font-bold tracking-[1px] break-words">60</span>} 
                icon={Icon1} 
                title={<span className="text-black text-[12px] font-cairo font-bold leading-[18px] break-words">إشغال المكان</span>} 
                bgColor="#9333EA" 
              />
              <StatCard 
                value={<span className="text-black text-[28px] font-cairo font-bold tracking-[1px] break-words">$440</span>} 
                icon={Icon2} 
                title={<span className="text-black text-[12px] font-cairo font-bold leading-[18px] break-words">إيرادات اليوم</span>} 
                bgColor="#22C55E" 
              />
              <StatCard 
                value={<span className="text-black text-[28px] font-cairo font-bold tracking-[1px] break-words">23</span>} 
                icon={Icon3} 
                title={<span className="text-black text-[12px] font-cairo font-bold leading-[18px] break-words">اشتراكات اليوم</span>} 
                bgColor="#3B82F6" 
              />
              <StatCard 
                value={<span className="text-black text-[28px] font-cairo font-bold tracking-[1px] break-words">15</span>} 
                icon={Icon4} 
                title={<span className="text-black text-[12px] font-cairo font-bold leading-[18px] break-words">زوار الموقع الآن</span>} 
                bgColor="#FACC15" 
              />
            </div>

            {/* الشارت */}
            <div className="bg-white rounded-2xl shadow p-4 w-full">
              <Chart />
            </div>

            {/* جدول الحضور */}
            <div className="bg-white rounded-2xl shadow p-4 w-full">
              <AttendanceTable />
            </div>

          </div>

          {/* القسم الأيمن - الكاليندر */}
          <div className="w-3/5">
            <div className="bg-white rounded-2xl shadow p-4 h-full">
              <Calender2 />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
