// src/components/Dashboard.jsx
import React from "react";
import StatCard from "./StatCard";

// استدعاء الأيقونات
import Icon1 from "../icones/CardIcon (1).svg";
import Icon2 from "../icones/CardIcon (2).svg";
import Icon3 from "../icones/CardIcon (3).svg";
import Icon4 from "../icones/CardIcon (4).svg";

const Dashboard = () => {
  return (
<div className="bg-white min-h-screen p-6">
  <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-[434px] ml-auto">
    <StatCard className="w-[216px] h-[126px]"  value="$440" icon={Icon1} title="إشغال المكان" />
    <StatCard className="w-[216px] h-[126px]"  value="60" icon={Icon2 } title="إيرادات اليوم"/>
    <StatCard className="w-[216px] h-[126px]"  value="55" icon={Icon3} title="اشتراكات اليوم" />
    <StatCard className="w-[216px] h-[126px]"  value="23" icon={Icon4} title="المستخدمون النشطون"/>
  </div>
</div>
  );
};

export default Dashboard;
