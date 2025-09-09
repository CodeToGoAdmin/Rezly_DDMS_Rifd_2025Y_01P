import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="flex flex-col items-start gap-[10px] w-[216px] h-[126px] p-6 rounded-xl shadow bg-white">
      
      <div className="flex w-[184px] justify-between items-start">
        <p className="text-gray-600 font-medium">{title}</p>
        <img src={icon} alt={title} className="w-[46px] h-[48px]"/>
      </div>

      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default StatCard;
