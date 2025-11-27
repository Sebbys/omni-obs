"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Search, Filter, SlidersHorizontal, Loader2, Plus } from "lucide-react"
import { useTasks, useDeleteTask, type Task } from "@/hooks/use-tasks"
import TaskCard from "./task-card"
import { TimelineSkeleton } from "./timeline-skeleton"
import { TaskModal } from "./modals/task-modal"
import { ManageModal } from "./modals/manage-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    startOfWeek,
    endOfWeek,
    addWeeks,
    subWeeks,
    format,
    eachDayOfInterval,
    isToday,
    differenceInDays,
    isBefore,
    isAfter,
} from "date-fns"

function calculateTaskPosition(
    task: Task,
    weekStart: Date,
    weekEnd: Date,
): { startDay: number; span: number; row: number } | null {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)

    if (isAfter(taskStart, weekEnd) || isBefore(taskEnd, weekStart)) {
        return null
    }

    const effectiveStart = isBefore(taskStart, weekStart) ? weekStart : taskStart
    const startDay = differenceInDays(effectiveStart, weekStart)

    const effectiveEnd = isAfter(taskEnd, weekEnd) ? weekEnd : taskEnd
    const span = Math.max(1, differenceInDays(effectiveEnd, effectiveStart) + 1)

    return { startDay: Math.max(0, Math.min(6, startDay)), span: Math.min(span, 7 - startDay), row: 0 }
}

function assignRows(
    tasks: Array<Task & { startDay: number; span: number }>,
): Array<Task & { startDay: number; span: number; row: number }> {
    const sorted = [...tasks].sort((a, b) => a.startDay - b.startDay || b.span - a.span)
    const rows: Array<{ end: number }[]> = []

    return sorted.map((task) => {
        let assignedRow = 0
        for (let r = 0; r < rows.length; r++) {
            const hasConflict = rows[r].some((slot) => task.startDay < slot.end)
            if (!hasConflict) {
                assignedRow = r
                break
            }
            assignedRow = r + 1
        }

        if (!rows[assignedRow]) rows[assignedRow] = []
        rows[assignedRow].push({ end: task.startDay + task.span })

        return { ...task, row: assignedRow }
    })
}

export default function TimelineView() {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
    const [taskModal, setTaskModal] = useState<{ open: boolean; task: Task | null }>({ open: false, task: null })
    const [manageModal, setManageModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const weekEnd = useMemo(() => endOfWeek(currentWeekStart, { weekStartsOn: 1 }), [currentWeekStart])

    const { data: tasks, isLoading, error } = useTasks(currentWeekStart.toISOString(), weekEnd.toISOString())
    const deleteTask = useDeleteTask()

    const days = useMemo(() => {
        return eachDayOfInterval({ start: currentWeekStart, end: weekEnd }).map((date) => ({
            name: format(date, "EEE"),
            date: format(date, "d"),
            fullDate: date,
            isToday: isToday(date),
        }))
    }, [currentWeekStart, weekEnd])

    const positionedTasks = useMemo(() => {
        if (!tasks) return []

        const filteredTasks = searchQuery
            ? tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
            : tasks

        const tasksWithPosition = filteredTasks
            .map((task) => {
                const position = calculateTaskPosition(task, currentWeekStart, weekEnd)
                if (!position) return null
                return { ...task, ...position }
            })
            .filter(Boolean) as Array<Task & { startDay: number; span: number; row: number }>

        return assignRows(tasksWithPosition)
    }, [tasks, currentWeekStart, weekEnd, searchQuery])

    const timeIndicatorPosition = useMemo(() => {
        const now = new Date()
        const dayIndex = days.findIndex((d) => isToday(d.fullDate))
        if (dayIndex === -1) return null
        const hourProgress = (now.getHours() + now.getMinutes() / 60) / 24
        return ((dayIndex + hourProgress) / 7) * 100
    }, [days])

    const goToPrevWeek = () => setCurrentWeekStart((prev) => subWeeks(prev, 1))
    const goToNextWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, 1))
    const goToToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))

    const dateRangeLabel = `${format(currentWeekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`

    const handleEditTask = (task: Task) => {
        setTaskModal({ open: true, task })
    }

    const handleDeleteTask = async (taskId: string) => {
        if (confirm("Are you sure you want to delete this task?")) {
            await deleteTask.mutateAsync(taskId)
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
            {/* Toolbar */}
            <div className="px-4 md:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => setTaskModal({ open: true, task: null })}>
                        <Plus className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Add Task</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setManageModal(true)}>
                        <SlidersHorizontal className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Manage</span>
                    </Button>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Filter</span>
                    </Button>
                </div>
            </div>

            {/* Timeline Controls & Header */}
            <div className="px-4 md:px-6 py-4 flex flex-col flex-1 overflow-hidden">
                {/* Date Nav */}
                <div className="flex items-center justify-between mb-4 gap-2">
                    <Button variant="outline" size="sm" onClick={goToToday}>
                        Today
                    </Button>

                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToPrevWeek}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="px-3 py-1.5 text-sm font-medium min-w-[160px] text-center">{dateRangeLabel}</div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToNextWeek}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="w-16 hidden sm:block" />
                </div>

                {/* Calendar Grid Container */}
                {isLoading ? (
                    <TimelineSkeleton />
                ) : (
                    <div className="flex-1 overflow-auto relative border border-border rounded-lg bg-card">
                        {/* Days Header */}
                    <div className="grid grid-cols-7 border-b border-border sticky top-0 bg-card z-30">
                        {days.map((day, index) => (
                            <div
                                key={index}
                                className={`py-3 text-center border-r border-border last:border-r-0 ${day.isToday ? "bg-accent" : ""}`}
                            >
                                <div className="text-xs text-muted-foreground">{day.name}</div>
                                <div className={`text-sm font-medium ${day.isToday ? "text-chart-1" : ""}`}>{day.date}</div>
                            </div>
                        ))}
                    </div>

                    {/* Current Time Indicator Line */}
                    {timeIndicatorPosition !== null && (
                        <div
                            className="absolute top-12 bottom-0 w-px bg-chart-1 z-20 pointer-events-none"
                            style={{ left: `${timeIndicatorPosition}%` }}
                        >
                            <div className="absolute -top-1 -left-1 w-2 h-2 bg-chart-1 rounded-full" />
                        </div>
                    )}

                    {/* Tasks Grid */}
                    <div className="p-3 md:p-4 grid grid-cols-7 gap-y-3 gap-x-2 auto-rows-max relative min-h-[400px]">
                        {/* Background Grid Lines */}
                        <div className="absolute inset-0 grid grid-cols-7 pointer-events-none z-0">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="border-r border-border/50 h-full last:border-r-0" />
                            ))}
                        </div>

                        {error && (
                            <div className="col-span-7 flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                                <p className="text-sm">No tasks found. Add tasks to get started.</p>
                                <Button size="sm" onClick={() => setTaskModal({ open: true, task: null })}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Create Task
                                </Button>
                            </div>
                        )}

                        {!isLoading && !error && positionedTasks.length === 0 && (
                            <div className="col-span-7 flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                                <p className="text-sm">No tasks scheduled for this week.</p>
                                <Button size="sm" onClick={() => setTaskModal({ open: true, task: null })}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Task
                                </Button>
                            </div>
                        )}

                        {!isLoading &&
                            !error &&
                            positionedTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    startDay={task.startDay}
                                    span={task.span}
                                    row={task.row}
                                    onEdit={() => handleEditTask(task)}
                                    onDelete={() => handleDeleteTask(task.id)}
                                />
                            ))}
                    </div>
                </div>
                )}
            </div>

            <TaskModal
                open={taskModal.open}
                onOpenChange={(open) => setTaskModal({ open, task: null })}
                task={taskModal.task}
            />
            <ManageModal open={manageModal} onOpenChange={setManageModal} />
        </div>
    )
}
