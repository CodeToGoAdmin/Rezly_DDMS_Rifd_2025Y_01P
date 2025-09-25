import React from "react";

const StatCard = ({ title, value, icon, className }) => {
  return (
    <div className={`bg-white shadow rounded-xl flex p-4 ${className}`}>
      <img src={icon} alt={title} className="w-8 h-8" />

      <div className="flex flex-col ml-auto items-end">
        <p className="text-gray-600 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
