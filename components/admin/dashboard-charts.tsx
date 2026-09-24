"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import type { DownloadPoint } from "@/lib/data/dashboard";

const contentConfig = { count: { label: "Items", color: "#3b82f6" } } satisfies ChartConfig;
const downloadConfig = {
  resume: { label: "Resume PDFs", color: "#2dd4bf" },
  ebook: { label: "eBooks", color: "#f59e0b" },
} satisfies ChartConfig;

const shortDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** Overview charts: content items per section and anonymous downloads over 30 days. */
export function DashboardCharts({ counts, downloads }: { counts: { section: string; count: number }[]; downloads: DownloadPoint[] }) {
  const totalDownloads = downloads.reduce((sum, d) => sum + d.resume + d.ebook, 0);
  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      <Card variant="admin-panel" className="p-6">
        <h2 className="font-serif text-lg text-white mb-1">Content by Section</h2>
        <p className="text-slate-500 text-xs mb-4">Items currently published in each section</p>
        <ChartContainer config={contentConfig} className="h-56 w-full [&_.recharts-cartesian-axis-tick_text]:fill-slate-500">
          <BarChart data={counts} margin={{ left: -20, right: 4 }} accessibilityLayer>
            <CartesianGrid vertical={false} stroke="#1e293b" />
            <XAxis dataKey="section" tickLine={false} axisLine={false} interval={0} fontSize={10} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={10} />
            <ChartTooltip cursor={{ fill: "#1e293b" }} content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </Card>

      <Card variant="admin-panel" className="p-6">
        <h2 className="font-serif text-lg text-white mb-1">Downloads</h2>
        <p className="text-slate-500 text-xs mb-4">
          Last 30 days · {totalDownloads} total · anonymous daily counts only
        </p>
        <ChartContainer config={downloadConfig} className="h-56 w-full [&_.recharts-cartesian-axis-tick_text]:fill-slate-500">
          <AreaChart data={downloads} margin={{ left: -20, right: 4 }} accessibilityLayer>
            <CartesianGrid vertical={false} stroke="#1e293b" />
            <XAxis dataKey="date" tickFormatter={shortDate} tickLine={false} axisLine={false} minTickGap={24} fontSize={10} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={10} />
            <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => shortDate(String(v))} />} />
            <Area dataKey="resume" type="monotone" stackId="d" stroke="var(--color-resume)" fill="var(--color-resume)" fillOpacity={0.2} />
            <Area dataKey="ebook" type="monotone" stackId="d" stroke="var(--color-ebook)" fill="var(--color-ebook)" fillOpacity={0.2} />
          </AreaChart>
        </ChartContainer>
      </Card>
    </div>
  );
}
