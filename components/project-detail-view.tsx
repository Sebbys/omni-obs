"use client"


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getProjects } from "@/app/actions/projects"
import { type Project } from "@/hooks/use-projects"
import { KanbanBoard } from "@/components/todos/kanban-board"
import { ProjectChangelog } from "./project-changelog"
import TimelineView from "@/components/timeline-view"

interface ProjectDetailViewProps {
  projectId: string
  // Initial data can be passed from Server Component if needed, for hydration
  initialProject?: Project | null
}

export function ProjectDetailView({ projectId, initialProject }: ProjectDetailViewProps) {
  // Fetch a single project by ID, or use initial data
  // Assuming a useProject hook that takes ID, or filtering from useProjects
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"], // Global key, will filter client-side
    queryFn: () => getProjects(),
    initialData: initialProject ? [initialProject] : undefined, // Hydrate with initial data
    staleTime: 0, // Always refetch to ensure RBAC is up to date
  })

  const project = projects?.find((p: Project) => p.id === projectId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-destructive py-8">
        <p>Failed to load project details.</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p className="text-lg">Project not found.</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color || "#3b82f6" }} />
            {project.name}
          </h1>
          {project.description && (
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
          )}
        </div>
        {/* Add Edit button for project here, opens ProjectModal */}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4"> {/* Adjusted for 4 main tabs */}
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="todos">To-Dos</TabsTrigger>
          <TabsTrigger value="changelog">Changelog</TabsTrigger>
          {/* Add a "Settings" tab in the future */}
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>Key statistics and details for this project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Tasks:</span>
                <span className="font-medium">{project.tasks?.length || 0}</span> {/* Assuming project.tasks is available from getProjects */}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              {/* Add more overview stats as needed */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          {/* TimelineView currently displays all tasks. Needs filtering by projectId */}
          {/* For now, we'll just show all tasks, but ideally it would be filtered */}
          <TimelineView />
        </TabsContent>

        <TabsContent value="todos" className="mt-6">
          <KanbanBoard projectId={projectId} />
        </TabsContent>

        <TabsContent value="changelog">
          <ProjectChangelog projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
