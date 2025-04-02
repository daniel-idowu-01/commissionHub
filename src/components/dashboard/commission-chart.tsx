"use client";

import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Mock data for the commission chart
const mockData = [
  { name: "Electronics", value: 35, color: "#8884d8" },
  { name: "Home & Kitchen", value: 25, color: "#82ca9d" },
  { name: "Fashion", value: 20, color: "#ffc658" },
  { name: "Sports", value: 15, color: "#ff8042" },
  { name: "Books", value: 5, color: "#0088fe" },
];

export function CommissionChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        Loading chart...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={mockData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {mockData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`$${typeof value === 'number' ? value.toFixed(2) : value}`, "Commission"]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
