import { ProjectDetailView } from "@/components/project-detail-view"
import { getProject } from "@/app/actions/projects"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { ProjectDetailSkeleton } from "@/components/skeletons/project-detail-skeleton"

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
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailsFetcher params={params} />
    </Suspense>
  )
}
