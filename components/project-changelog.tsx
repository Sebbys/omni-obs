"use client"

import { useState } from "react"
import { Plus, Trash2, Loader2, GitCommit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getProjectChangelogs,
  createProjectChangelog,
  deleteProjectChangelog,
} from "@/app/actions/project-features"
import { format } from "date-fns"

interface ProjectChangelogProps {
  projectId: string
}

export function ProjectChangelog({ projectId }: ProjectChangelogProps) {
  const queryClient = useQueryClient()
  const [newChangelog, setNewChangelog] = useState({
    version: "",
    title: "",
    content: "",
  })

  const {
    data: changelogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projectChangelogs", projectId],
    queryFn: () => getProjectChangelogs(projectId),
  })

  const createChangelogMutation = useMutation({
    mutationFn: (data: { version: string; title: string; content: string }) =>
      createProjectChangelog(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectChangelogs", projectId] })
      setNewChangelog({ version: "", title: "", content: "" })
    },
  })

  const deleteChangelogMutation = useMutation({
    mutationFn: (changelogId: string) =>
      deleteProjectChangelog(changelogId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectChangelogs", projectId] })
    },
  })

  const handleCreateChangelog = (e: React.FormEvent) => {
    e.preventDefault()
    if (newChangelog.version.trim() && newChangelog.title.trim() && newChangelog.content.trim()) {
      createChangelogMutation.mutate(newChangelog)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Project Changelog</h2>

      <Card>
        <CardHeader>
          <CardTitle>Add New Changelog Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateChangelog} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  placeholder="e.g., v1.0.0"
                  value={newChangelog.version}
                  onChange={(e) =>
                    setNewChangelog((prev) => ({ ...prev, version: e.target.value }))
                  }
                  disabled={createChangelogMutation.isPending}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Initial Release"
                  value={newChangelog.title}
                  onChange={(e) =>
                    setNewChangelog((prev) => ({ ...prev, title: e.target.value }))
                  }
                  disabled={createChangelogMutation.isPending}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Details of this update..."
                value={newChangelog.content}
                onChange={(e) =>
                  setNewChangelog((prev) => ({ ...prev, content: e.target.value }))
                }
                disabled={createChangelogMutation.isPending}
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={createChangelogMutation.isPending}>
                {createChangelogMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Entry
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="text-center text-destructive py-4">
          <p>Failed to load changelogs.</p>
        </div>
      )}

      {!isLoading && !error && changelogs?.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          No changelog entries for this project yet.
        </p>
      )}

      <div className="relative pl-8 space-y-6">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
        {changelogs?.map((changelog) => (
          <div key={changelog.id} className="relative">
            <div className="absolute -left-5 top-0 flex h-full items-start">
              <div className="h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -mt-1.5 p-1 rounded-full bg-card border border-border">
                <GitCommit className="h-4 w-4 text-primary" />
              </div>
            </div>
            <Card className="ml-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">{changelog.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {changelog.version} &bull;{" "}
                    {format(new Date(changelog.date), "MMM d, yyyy")}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteChangelogMutation.mutate(changelog.id)}
                  disabled={deleteChangelogMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{changelog.content}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
