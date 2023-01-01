import Pagination from "./client/Pagination"
import DiscussionItem from "./client/DiscussionItem"
import { TranslatedDiscussionSummary, UrlParams } from "./layout.types"
import { fetchDiscussions } from "../../../../../lib/github"
import { translateStrings } from "../../../../../lib/openai"

async function getData({
  params,
  searchParams,
}: {
  params: UrlParams
  searchParams: any
}) {
  const locale = params.locale.toLocaleLowerCase()
  const categoryFilter = searchParams["category"] as string
  const skipTranslation = locale == "default" || locale == "en-us"
  const githubDiscussionsResponse = await fetchDiscussions({
    category: categoryFilter,
  })
  const githubDiscussions = githubDiscussionsResponse.nodes
  let titles: string[] = []
  let discussions: TranslatedDiscussionSummary[] = []

  // Enrich discussions with href and translation.
  // For now the translations name are populated with the default locale.
  for (let i = 0; i < githubDiscussions.length; i++) {
    const discussion = githubDiscussions[i]
    titles.push(discussion.title)
    discussions.push({
      ...discussion,
      href: `/${params.locale}/github/${params.owner}/${params.repo}/discussions/${discussion.number}`,
      titleTranslation: discussion.title,
    })
  }

  // Get translations if this is not the default locale
  // @todo: cache translations
  if (!skipTranslation) {
    const translations = await translateStrings(titles, locale)
    discussions.forEach((discussion, index) => {
      discussion.titleTranslation = translations[index]
    })
  }

  return {
    discussions,
    totalDiscussions: githubDiscussionsResponse.totalCount,
    discussionsPageSize: githubDiscussionsResponse.pageSize,
    discussionsPageInfo: githubDiscussionsResponse.pageInfo,
  }
}

export default async function Discussions({
  params,
  searchParams,
}: {
  params: UrlParams
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const data = await getData({ params, searchParams })
  const { discussions } = data

  return (
    <div className="flex grow flex-col overflow-y-auto">
      <main className="flex-1">
        <div className="overflow-hidden bg-white border-b border-gray-200 ">
          <ul role="list" className="divide-y divide-gray-200">
            {discussions.map((discussion) => (
              <DiscussionItem key={discussion.id} discussion={discussion} />
            ))}
          </ul>
        </div>
      </main>

      <div className=" border-t border-gray-200">
        <Pagination
          total={data.totalDiscussions}
          pageSize={data.discussionsPageSize}
          pageInfo={data.discussionsPageInfo}
        />
      </div>
    </div>
  )
}
