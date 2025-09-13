import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="flex flex-col items-start w-[216px] h-[126px] px-4 py-6 gap-[10px] rounded-xl shadow bg-white">
      
      <div className="flex w-full justify-between items-start">
        <p className="text-gray-600 font-medium">{title}</p>
        <img src={icon} alt={title} className="w-[46px] h-[48px]" />
      </div>

      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default StatCard;
