import { AppShell } from "@/components/app-shell"
import { ProjectDetailView } from "@/components/project-detail-view"
import { getProject } from "@/app/actions/projects" // Assuming you've added getProject to projects actions
import { notFound } from "next/navigation"

interface ProjectDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id: projectId } = await params
  const project = await getProject(projectId)

  if (!project) {
    notFound()
  }

  return (
    <AppShell>
      <ProjectDetailView projectId={projectId} initialProject={project} />
    </AppShell>
  )
}
