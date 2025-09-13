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
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "150%", // 21px
  };

  return (
    <section
      style={{
        borderRadius: "10px",
        padding: "20px",
        background: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* أزرار الزوار والمبيعات */}
        <div
          className="btn-box mb-3"
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <button className="tab-btn active" style={buttonTextStyle}>الزوار</button>

          {/* المبيعات وبوتون الأسبوع داخل flex لعمل الفراغ بينهم */}
          <div style={{
            display: "flex",
            padding: "0 16px",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            gap: "50px"
          }}>
            <button className="tab-btn" style={buttonTextStyle}>المبيعات</button>
            <select className="filter-select" style={buttonTextStyle}>
              <option>اليوم</option>
              <option selected>الأسبوع</option>
              <option>الشهر</option>
            </select>
          </div>
        </div>

        {/* أيقونة التاريخ وبقية الفلاتر */}
        <div
          className="filter mb-3"
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <button className="filter-btn" onClick={toggleChartType}>
            <img src={Charticon} alt="chart icon date" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button className="filter-btn filter-btn2">...</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
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
    </section>
  );
}
