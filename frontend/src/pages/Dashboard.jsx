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
    <div className="w-screen min-h-screen flex flex-col bg-[#F8F9FA]">
      <div className="flex flex-1">
        <Sidebar className="w-64 bg-white" />

        <div className="flex-1 pt-6 bg-[#F8F9FA]">
          <Topbar />
          <div className="mb-4 w-[448px] h-[268px]">
            <div className="grid grid-cols-2 gap-4 ml-auto">
              <StatCard value="60" icon={Icon1} title="إشغال المكان" bgColor="#9333EA" />
              <StatCard value="$440" icon={Icon2} title="إيرادات اليوم" bgColor="#22C55E" />
              <StatCard value="23" icon={Icon3} title="اشتراكات اليوم" bgColor="#3B82F6" />
              <StatCard value="15" icon={Icon4} title="زوار الموقع الآن" bgColor="#FACC15" />
            </div>
          </div>

          <div className="chart w-[436px] h-[214px] ">
            <Chart />
          </div>
          
            
          
        </div>
      </div>
    </div>
  )
}
