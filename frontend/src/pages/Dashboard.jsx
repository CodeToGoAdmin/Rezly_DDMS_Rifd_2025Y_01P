import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Chart from "../components/Chart";
import AttendanceTable from "../components/AttendanceTable/AttendanceTable";
import StatCard from "../components/StatCard";
import Calender from "../components/Calender/Calender";

import Icon1 from "../assets/icon/card-icon1.svg";
import Icon2 from "../assets/icon/card-icon2.svg";
import Icon3 from "../assets/icon/card-icon3.svg";
import Icon4 from "../assets/icon/card-icon4.svg";

export default function Dashboard() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="w-full min-h-screen bg-bg flex flex-col relative">
      {/* Mobile Sidebar Drawer */}
      {openSidebar && (
        <div className="fixed top-0 left-0 w-[212px] h-full bg-bg shadow-lg border-r z-50 flex flex-col">
          <Sidebar />
          <button
            onClick={() => setOpenSidebar(false)}
            className="absolute top-4 left-4 text-black text-xl font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Mobile Sidebar Button */}
      <button
        onClick={() => setOpenSidebar(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-bg text-white rounded"
      >
        ☰
      </button>

      <div className=" flex flex-col lg:flex-row gap-6 px-4 lg:px-6">
        <div className="hidden lg:flex flex-none w-[212px] ">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col pt-6 gap-6">
          <div className="">
            <Topbar />
          </div>

          <div className=" flex flex-col lg:flex-row gap-6 px-4 lg:px-6">
            <div className="flex-[2] flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                <StatCard
                  className=""
                  value={
                    <span className="text-black text-[28px] font-cairo font-bold tracking-[1px] break-words">
                      60
                    </span>
                  }
                  icon={Icon1}
                  title={
                    <span className="text-black text-[12px] font-cairo font-bold leading-[18px] break-words">
                      إشغال المكان
                    </span>
                  }
                  bgColor="#9333EA"
                />
                <StatCard
                  className=""
                  value={
                    <span className="text-black text-[28px] font-cairo font-bold tracking-[1px] break-words">
                      $440
                    </span>
                  }
                  icon={Icon2}
                  title={
                    <span className="text-black text-[12px] font-cairo font-bold leading-[18px] break-words">
                      إيرادات اليوم
                    </span>
                  }
                  bgColor="#22C55E"
                />
                <StatCard
                  className=""
                  value={
                    <span className="text-black text-[28px] font-cairo font-bold tracking-[1px] break-words">
                      23
                    </span>
                  }
                  icon={Icon3}
                  title={
                    <span className="text-black text-[12px] font-cairo font-bold leading-[18px] break-words">
                      اشتراكات اليوم
                    </span>
                  }
                  bgColor="#3B82F6"
                />
                <StatCard
                  className=""
                  value={
                    <span className="text-black text-[28px] font-cairo font-bold tracking-[1px] break-words">
                      15
                    </span>
                  }
                  icon={Icon4}
                  title={
                    <span className="text-black text-[12px] font-cairo font-bold leading-[18px] break-words">
                      زوار الموقع الآن
                    </span>
                  }
                  bgColor="#FACC15"
                />
              </div>

              <div className="bg-white rounded-2xl shadow py-6  ">
                <Chart />
              </div>

              <div className="bg-white rounded-2xl shadow p-4  overflow-x-auto">
                <AttendanceTable />
              </div>
            </div>

            <div className="flex-[3] flex mt-6 lg:mt-0 w-full">
              <div className="bg-white rounded-2xl shadow p-4 ">
                <Calender />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
