import React from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Chart from '../components/Chart'
import AttendanceTable from '../components/AttendanceTable/AttendanceTable'
import StatCard from '../components/StatCard'

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

        {/* محتوى العمود الرئيسي */}
        <div className="flex-1 flex flex-col gap-6 ">

          {/* الكروت */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-[480px]">
            <StatCard value="60" icon={Icon1} title="إشغال المكان" bgColor="#9333EA" />
            <StatCard value="$440" icon={Icon2} title="إيرادات اليوم" bgColor="#22C55E" />
            <StatCard value="23" icon={Icon3} title="اشتراكات اليوم" bgColor="#3B82F6" />
            <StatCard value="15" icon={Icon4} title="زوار الموقع الآن" bgColor="#FACC15" />
          </div>

          {/* الشارت */}
          <div className="bg-white rounded-2xl shadow p-4  w-full max-w-[480px]">
            <Chart />
          </div>

          {/* جدول الحضور */}
          <div className="bg-white rounded-2xl shadow p-4 w-full max-w-[480px]">
            <AttendanceTable />
          </div>

        </div>
      </div>
    </div>
  )
}
