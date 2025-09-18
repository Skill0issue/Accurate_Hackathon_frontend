"use client";
import React from "react";

type InfoCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
};

const OrderDetails: React.FC<InfoCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white shadow rounded-2xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-xl font-semibold">{value}</h3>
      </div>
    </div>
  );
};

export default OrderDetails;
