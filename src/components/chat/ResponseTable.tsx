"use client";

import React from "react";

const data = [
  { region: "West Coast", total: 2456, disputes: 295, rate: "12%" },
  { region: "East Coast", total: 3123, disputes: 250, rate: "8%" },
  { region: "Midwest", total: 1789, disputes: 107, rate: "6%" },
  { region: "Southwest", total: 1345, disputes: 121, rate: "9%" },
];

export default function ResponseTable() {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-2">Region</th>
            <th className="px-4 py-2">Total Cases</th>
            <th className="px-4 py-2">Disputes</th>
            <th className="px-4 py-2">Rate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, i) => (
            <tr key={i}>
              <td className="px-4 py-2">{row.region}</td>
              <td className="px-4 py-2">{row.total.toLocaleString()}</td>
              <td className="px-4 py-2">{row.disputes}</td>
              <td className="px-4 py-2">{row.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
