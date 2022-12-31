import { UrlParams } from "../../layout.types"

export default function Discussion({ params }: { params: UrlParams }) {
  const discussionId = params.discussionId!

  return <p>Page...{discussionId}</p>
}
