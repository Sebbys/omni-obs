"use client"

import { useMemo } from "react"
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { type Task } from "@/hooks/use-tasks"

interface PriorityBarChartProps {
  tasks: Task[]
}

const PRIORITY_COLORS = {
  high: "hsl(var(--chart-5))",
  medium: "hsl(var(--chart-3))",
  low: "hsl(var(--chart-2))",
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
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} className="stroke-border" />
        <XAxis type="number" hide />
        <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
        />
        <Tooltip
            cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
            contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--card-foreground))"
            }}
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
