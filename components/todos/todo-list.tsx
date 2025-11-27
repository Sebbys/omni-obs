"use client"

import { useQuery } from "@tanstack/react-query"
import { getProjectTodos } from "@/app/actions/todos"
import { TodoItem } from "./todo-item"
import { AddTodoForm } from "./add-todo-form"
import { TodoSkeleton } from "./todo-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TodoListProps {
    projectId: string
}

export function TodoList({ projectId }: TodoListProps) {
    const { data: todos, isLoading } = useQuery({
        queryKey: ["project-todos", projectId],
        queryFn: () => getProjectTodos(projectId),
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium">To-Do List</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <TodoSkeleton />
                ) : (
                    <div className="space-y-1">
                        {todos?.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No tasks yet. Add one below!
                            </p>
                        )}
                        {todos?.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))}
                    </div>
                )}
                <AddTodoForm projectId={projectId} />
            </CardContent>
        </Card>
    )
}
