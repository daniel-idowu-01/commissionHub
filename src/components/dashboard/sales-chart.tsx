"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

// Mock data for the sales chart
const mockData = [
  { name: "Mon", sales: 4, amount: 400 },
  { name: "Tue", sales: 7, amount: 680 },
  { name: "Wed", sales: 5, amount: 500 },
  { name: "Thu", sales: 8, amount: 780 },
  { name: "Fri", sales: 9, amount: 920 },
  { name: "Sat", sales: 3, amount: 320 },
  { name: "Sun", sales: 4, amount: 400 },
];

export function SalesChart() {
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
      <BarChart data={mockData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Bar
          yAxisId="left"
          dataKey="sales"
          fill="#8884d8"
          name="Sales"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          yAxisId="right"
          dataKey="amount"
          fill="#82ca9d"
          name="Revenue ($)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
