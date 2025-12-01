"use client"

import { useMemo } from "react"
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { type Task } from "@/hooks/use-tasks"

interface PriorityBarChartProps {
  tasks: Task[]
}

const PRIORITY_COLORS = {
  high: "var(--chart-5)",
  medium: "var(--chart-3)",
  low: "var(--chart-2)",
}

const PRIORITY_LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
}

export function PriorityBarChart({ tasks }: PriorityBarChartProps) {
  const data = useMemo(() => {
    const counts = {
      high: 0,
      medium: 0,
      low: 0,
    }

    tasks.forEach(task => {
      if (counts[task.priority] !== undefined) {
        counts[task.priority]++
      }
    })

    return [
      { name: 'High', value: counts.high, color: PRIORITY_COLORS.high },
      { name: 'Medium', value: counts.medium, color: PRIORITY_COLORS.medium },
      { name: 'Low', value: counts.low, color: PRIORITY_COLORS.low },
    ]
  }, [tasks])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} className="stroke-muted" />
        <XAxis type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)' }}
          width={60}
        />
        <Tooltip
          cursor={{ fill: 'var(--muted)/0.3' }}
          contentStyle={{
            backgroundColor: "var(--popover)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--popover-foreground)",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
          }}
          itemStyle={{ color: "var(--foreground)" }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
