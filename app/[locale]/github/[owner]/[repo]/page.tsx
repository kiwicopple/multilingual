import Pagination from "./client/Pagination"
import DiscussionItem from "./client/DiscussionItem"
import { TranslatedDiscussion, UrlParams } from "./layout.types"
import { fetchDiscussions } from "../../../../../lib/github"
import { translateStrings } from "../../../../../lib/openai"

async function getData({ params }: { params: UrlParams }) {
  const locale = params.locale.toLocaleLowerCase()
  const skipTranslation = locale == "default" || locale == "en-us"
  const githubDiscussionsResponse = await fetchDiscussions()
  const githubDiscussions = githubDiscussionsResponse.nodes
  let titles: string[] = []
  let discussions: TranslatedDiscussion[] = []

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

export default async function Discussions({ params }: { params: UrlParams }) {
  const data = await getData({ params })
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
