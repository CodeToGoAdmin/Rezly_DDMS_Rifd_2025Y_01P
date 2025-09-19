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
          <button className="tab-btn  active" style={buttonTextStyle}>الزوار</button>

          <div style={{
            display: "flex",
            padding: "0 8px",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            gap: "50px"
          }}>
            <button className="tab-btn " style={buttonTextStyle}>المبيعات</button>
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
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 2C2.36667 2 2.66699 2.30033 2.66699 2.66699V12C2.66699 12.3666 2.96649 12.6668 3.33301 12.667H14C14.3666 12.667 14.6668 12.9665 14.667 13.333C14.667 13.6997 14.3667 14 14 14H3.33301C2.22649 13.9998 1.33301 13.1066 1.33301 12V2.66699C1.33301 2.30033 1.63333 2 2 2ZM12.9795 4.31348C13.1195 4.17351 13.3397 4.12712 13.5264 4.20703C13.713 4.28036 13.833 4.46699 13.833 4.66699V11.333C13.833 11.6063 13.6063 11.833 13.333 11.833H4C3.72667 11.833 3.5 11.6063 3.5 11.333V9.33301C3.50008 9.19978 3.55322 9.07276 3.64648 8.97949L6.97949 5.64648C7.17278 5.4532 7.49318 5.4533 7.68652 5.64648L9.66699 7.62695L12.9795 4.31348Z" fill="var(--color-purple)"/>
</svg>
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
              stroke="var(--color-purple)"
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
            <Bar dataKey="value" fill="var(--color-purple)" barSize={30} radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </section>
  );
}
