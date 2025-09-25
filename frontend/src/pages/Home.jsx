import React from "react";
import Chart from "../components/Chart";
import AttendanceTable from "../components/AttendanceTable/AttendanceTable";
import StatCard from "../components/StatCard";
import Calender from "../components/Calender/Calender";

import Icon1 from "../assets/icon/card-icon1.svg";
import Icon2 from "../assets/icon/card-icon2.svg";
import Icon3 from "../assets/icon/card-icon3.svg";
import Icon4 from "../assets/icon/card-icon4.svg";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-[2] flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard value={<span className="text-[28px] font-cairo font-bold">60</span>} icon={Icon1} title="إشغال المكان" bgColor="#9333EA" />
          <StatCard value={<span className="text-[28px] font-cairo font-bold">$440</span>} icon={Icon2} title="إيرادات اليوم" bgColor="#22C55E" />
          <StatCard value={<span className="text-[28px] font-cairo font-bold">23</span>} icon={Icon3} title="اشتراكات اليوم" bgColor="#3B82F6" />
          <StatCard value={<span className="text-[28px] font-cairo font-bold">15</span>} icon={Icon4} title="زوار الموقع الآن" bgColor="#FACC15" />
        </div>

        <div className="bg-white rounded-2xl shadow py-6">
          <Chart />
        </div>

        <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
          <AttendanceTable />
        </div>
      </div>

      <div className="flex-[3] flex mt-6 lg:mt-0 w-full">
        <div className="bg-white rounded-2xl shadow p-4">
          <Calender />
        </div>
      </div>
    </div>
  );
}
