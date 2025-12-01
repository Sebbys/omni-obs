"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { type Task } from "@/hooks/use-tasks"

interface StatusPieChartProps {
  tasks: Task[]
}

const STATUS_COLORS = {
  todo: "var(--muted)",
  in_progress: "var(--chart-1)",
  review: "var(--chart-3)",
  done: "var(--chart-2)",
}

const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
}

export function StatusPieChart({ tasks }: StatusPieChartProps) {
  const data = useMemo(() => {
    const counts = {
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0,
    }

    tasks.forEach(task => {
      if (counts[task.status] !== undefined) {
        counts[task.status]++
      }
    })

    return Object.entries(counts).map(([key, value]) => ({
      name: STATUS_LABELS[key as keyof typeof STATUS_LABELS],
      value,
      color: STATUS_COLORS[key as keyof typeof STATUS_COLORS],
    })).filter(item => item.value > 0)
  }, [tasks])

  if (data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--popover-foreground)",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
          }}
          itemStyle={{ color: "var(--foreground)" }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          formatter={(value) => <span className="text-sm text-muted-foreground ml-1">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
