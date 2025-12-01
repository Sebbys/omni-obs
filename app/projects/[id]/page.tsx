import { ProjectDetailView } from "@/components/project-detail-view"
import { getProject } from "@/app/actions/projects"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

interface ProjectDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function ProjectDetailsFetcher({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params
  const project = await getProject(projectId)

  if (!project) {
    notFound()
  }

  return <ProjectDetailView projectId={projectId} initialProject={project} />
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <ProjectDetailsFetcher params={params} />
    </Suspense>
  )
}
