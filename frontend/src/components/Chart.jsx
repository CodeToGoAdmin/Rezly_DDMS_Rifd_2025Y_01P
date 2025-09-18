import React, { useState } from "react";
import Charticon from '../assets/icon/chart-03.svg';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
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
  const [chartType, setChartType] = useState("line"); // line | bar

  const toggleChartType = () => {
    setChartType(chartType === "line" ? "bar" : "line");
  };

  const buttonTextStyle = {
    color: "var(--black, #000)",
    textAlign: "center",
    fontFamily: "Cairo",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "150%",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* ديف الهيدر فقط بدون padding يمين ويسار */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: "16px",
          marginRight: "16px",
          
        }}
      >
        {/* أزرار الزوار والمبيعات */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button className="tab-btn active" style={buttonTextStyle}>الزوار</button>
          <button className="tab-btn" style={buttonTextStyle}>المبيعات</button>
        </div>

        {/* الفلاتر */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <select style={buttonTextStyle}>
            <option>اليوم</option>
            <option selected>الأسبوع</option>
            <option>الشهر</option>
          </select>
          <button onClick={toggleChartType} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <img src={Charticon} alt="chart icon date" />
          </button>
<button className="filter-btn filter-btn2">...</button>
        </div>
      </div>

      {/* ديف الشارت بدون أي padding */}
      <div style={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={data}>
              <XAxis
                dataKey="day"
                interval={0}
                tick={{ fontSize: 11, fill: "#333", fontFamily: "Cairo" }}
              />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6A0EAD"
                strokeWidth={3}
                dot
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <XAxis
                dataKey="day"
                interval={0}
                tick={{ fontSize: 11, fill: "#333", fontFamily: "Cairo" }}
              />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill="#6A0EAD" barSize={30} radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
