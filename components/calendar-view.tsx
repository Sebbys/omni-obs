"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTasks, Task } from "@/hooks/use-tasks"
import { TaskModal } from "@/components/modals/task-modal"
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
    format,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
} from "date-fns"

const priorityColors = {
    high: "bg-chart-5 text-white",
    medium: "bg-chart-3 text-white",
    low: "bg-chart-2 text-white",
}

export function CalendarView() {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [taskModal, setTaskModal] = useState<{ open: boolean; task: Task | null }>({ open: false, task: null })

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const { data: tasks } = useTasks()

    const calendarDays = useMemo(() => {
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    }, [calendarStart, calendarEnd])

    const getTasksForDay = (date: Date) => {
        if (!tasks) return []
        return tasks.filter((task) => {
            const start = new Date(task.startDate)
            const end = new Date(task.endDate)
            return date >= start && date <= end
        })
    }

    const goToPrevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1))
    const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1))
    const goToToday = () => setCurrentMonth(new Date())

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-foreground">Calendar</h1>
                    <p className="text-sm text-muted-foreground">View and manage your schedule</p>
                </div>
                <Button onClick={() => setTaskModal({ open: true, task: null })}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Event
                </Button>
            </div>

            {/* Calendar Controls */}
            <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToPrevMonth}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[140px] text-center">{format(currentMonth, "MMMM yyyy")}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToNextMonth}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
                <div className="w-16 hidden sm:block" />
            </div>

            {/* Calendar Grid */}
            <Card>
                <CardContent className="p-0">
                    {/* Week Day Headers */}
                    <div className="grid grid-cols-7 border-b border-border">
                        {weekDays.map((day) => (
                            <div
                                key={day}
                                className="py-3 text-center text-xs font-medium text-muted-foreground border-r border-border last:border-r-0"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7">
                        {calendarDays.map((day, index) => {
                            const dayTasks = getTasksForDay(day)
                            const isCurrentMonth = isSameMonth(day, currentMonth)
                            const isSelected = selectedDate && isSameDay(day, selectedDate)
                            const today = isToday(day)

                            return (
                                <div
                                    key={index}
                                    onClick={() => setSelectedDate(day)}
                                    className={`
                    min-h-[100px] md:min-h-[120px] p-2 border-r border-b border-border last:border-r-0 cursor-pointer
                    transition-colors hover:bg-accent/50
                    ${!isCurrentMonth ? "bg-muted/30" : ""}
                    ${isSelected ? "bg-accent" : ""}
                  `}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span
                                            className={`
                        text-sm w-7 h-7 flex items-center justify-center rounded-full
                        ${today ? "bg-chart-1 text-white font-medium" : ""}
                        ${!isCurrentMonth ? "text-muted-foreground" : "text-foreground"}
                      `}
                                        >
                                            {format(day, "d")}
                                        </span>
                                        {dayTasks.length > 0 && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                                        <MoreHorizontal className="w-3 h-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => setTaskModal({ open: true, task: null })}>
                                                        Add task
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        {dayTasks.slice(0, 2).map((task) => (
                                            <div
                                                key={task.id}
                                                className="text-[10px] md:text-xs px-1.5 py-0.5 rounded truncate bg-accent text-foreground"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setTaskModal({ open: true, task })
                                                }}
                                            >
                                                {task.title}
                                            </div>
                                        ))}
                                        {dayTasks.length > 2 && (
                                            <div className="text-[10px] text-muted-foreground px-1.5">+{dayTasks.length - 2} more</div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Selected Date Tasks */}
            {selectedDate && (
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-medium text-foreground mb-3">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
                        {getTasksForDay(selectedDate).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No tasks scheduled for this day</p>
                        ) : (
                            <div className="space-y-2">
                                {getTasksForDay(selectedDate).map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer"
                                        onClick={() => setTaskModal({ open: true, task })}
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{task.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(task.startDate), "MMM d")} - {format(new Date(task.endDate), "MMM d")}
                                            </p>
                                        </div>
                                        <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                                            {task.priority}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <TaskModal
                open={taskModal.open}
                onOpenChange={(open) => setTaskModal({ open, task: null })}
                task={taskModal.task}
            />
        </div>
    )
}
