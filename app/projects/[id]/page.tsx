import { ProjectDetailView } from "@/components/project-detail-view"
import { getProject } from "@/app/actions/projects"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

interface ProjectDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function ProjectDetailsFetcher({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params
  // const project = await getProject(projectId)
  const project = null

  // if (!project) {
  //   notFound()
  // }

  return <ProjectDetailView projectId={projectId} initialProject={project} />
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectDetailsFetcher params={params} />
    </Suspense>
  )
}
