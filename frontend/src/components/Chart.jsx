import React from "react";
import Charticon from '../assets/icon/chart-03.svg'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "السبت", value: 26 },
  { day: "الأحد", value: 30 },
  { day: "الإثنين", value: 42 },
  { day: "الثلاثاء", value: 38 },
  { day: "الأربعاء", value: 55 },
  { day: "الخميس", value: 47 },
  { day: "الجمعة", value: 50 },
];

export default function Chart() {
  return (
    <section style={{  borderRadius: "10px", padding: "20px", background: "white" }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>

        <div className="btn-box mb-3" style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>
          <button className="tab-btn active">الزوار</button>
          <button className="tab-btn">المبيعات</button>


        </div>
        <div className="filter mb-3" style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>
          <select className="filter-select">
            <option>اليوم</option>
            <option selected>الأسبوع</option>
            <option>الشهر</option>
          </select>
          <button className="filter-btn">
            <img src={Charticon} alt="chart icon date" />
          </button>
          
          <button className="filter-btn filter-btn2">...</button>


        </div>

      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="day" interval={0} tick={{ fontSize: 11, fill: "#333", fontFamily: "Cairo" }} />
          <YAxis hide />       
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7c3aed"
            strokeWidth={3}
            dot
          />
        </LineChart>
      </ResponsiveContainer>

      
    </section>
  );
}
