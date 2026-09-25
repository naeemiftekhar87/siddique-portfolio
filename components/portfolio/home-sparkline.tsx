"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

// Decorative sparkline in the Home hero's floating card (ported design).
// Loaded lazily from Home so Recharts stays out of the initial bundle.
const sparkData = [
  { v: 10 }, { v: 22 }, { v: 18 }, { v: 35 }, { v: 28 }, { v: 42 },
  { v: 38 }, { v: 55 }, { v: 60 }, { v: 52 }, { v: 70 }, { v: 80 },
];

export default function HomeSparkline() {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={sparkData}>
        <defs>
          <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke="#0d9488" fill="url(#spark)" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
