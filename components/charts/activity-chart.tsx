"use client"

import { useMemo } from "react"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts"
import { type Task } from "@/hooks/use-tasks"
import { subDays, format, isSameDay } from "date-fns"

interface ActivityChartProps {
  tasks: Task[]
  days?: number
}

export function ActivityChart({ tasks, days = 7 }: ActivityChartProps) {
  const data = useMemo(() => {
    const today = new Date()
    const chartData = []

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i)
      const dateStr = format(date, "MMM d")
      
      // Count tasks created on this day
      const createdCount = tasks.filter(t => 
        isSameDay(new Date(t.createdAt), date)
      ).length

      // Count tasks completed on this day (using updatedAt as a proxy for completion time if status is done)
      // Note: Ideally we'd have a completedAt field, but this serves for the prototype
      const completedCount = tasks.filter(t => 
        t.status === 'done' && isSameDay(new Date(t.updatedAt), date)
      ).length

      chartData.push({
        date: dateStr,
        Created: createdCount,
        Completed: completedCount
      })
    }
    return chartData
  }, [tasks, days])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
        <XAxis 
            dataKey="date" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            minTickGap={32}
        />
        <YAxis 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}`}
            allowDecimals={false}
        />
        <Tooltip 
            contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--card-foreground))"
            }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
            cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Legend wrapperStyle={{ paddingTop: "10px" }} />
        <Line 
            type="monotone" 
            dataKey="Created" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={2} 
            activeDot={{ r: 6, className: "fill-chart-1" }} 
            dot={false}
        />
        <Line 
            type="monotone" 
            dataKey="Completed" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={2} 
            activeDot={{ r: 6, className: "fill-chart-2" }} 
            dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
