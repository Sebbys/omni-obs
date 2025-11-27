export enum Priority {
    HIGH = "High",
    MEDIUM = "Medium",
    LOW = "Low",
}

export interface User {
    id: string
    name: string
    avatar: string
}

export interface Task {
    id: string
    title: string
    dateRange: string
    priority: Priority
    progress: number
    assignees: User[]
    row: number
    startDay: number
    span: number
    color: string
}

export interface DayColumn {
    name: string
    date: number
    isToday: boolean
}
