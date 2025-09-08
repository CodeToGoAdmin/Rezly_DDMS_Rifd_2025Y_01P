import React from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Chart from '../components/Chart'

export default function Dashboard() {
  return (
    <div className="w-screen min-h-screen flex flex-col bg-[#F8F9FA]">

      <div className="flex flex-1">
        <Sidebar className="w-64 bg-white  " />

        <div className="flex-1 pt-6 bg-[#F8F9FA]">
          <Topbar />
          <div className="left-section flex">
            <div className="chart">
              <Chart/>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
