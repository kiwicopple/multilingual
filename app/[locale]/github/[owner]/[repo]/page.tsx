import Link from "next/link"
import Pagination from "./pagination"
import { TranslatedDiscussion, UrlParams } from "./layout.types"
import { fetchDiscussions } from "../../../../../lib/github"
import { translateStrings } from "../../../../../lib/openai"
import {
  CalendarIcon,
  ChevronRightIcon,
  ArrowSmallUpIcon,
} from "@heroicons/react/20/solid"

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
              <li key={discussion.id}>
                <Link href={discussion.href} className="block hover:bg-gray-50">
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 sm:flex sm:items-center sm:justify-between mr-4">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <ArrowSmallUpIcon
                          className="-ml-0.5 mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        {discussion.upvoteCount}
                      </button>
                    </div>
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="truncate">
                        <div className="flex text-sm">
                          <p className="truncate font-medium text-indigo-600">
                            {discussion.titleTranslation ?? discussion.title}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <p>
                              <time dateTime={discussion.createdAt}>
                                {discussion.createdAt}
                              </time>{" "}
                              in {discussion.category.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="flex -space-x-1 overflow-hidden">
                          <img
                            key={discussion.author.login}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                            src={discussion.author.avatarUrl}
                            alt={discussion.author.login}
                          />
                          {discussion.comments.nodes?.map((commenter) => (
                            <img
                              key={commenter.id}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                              src={commenter.author.avatarUrl}
                              alt={commenter.author.login}
                              title={commenter.author.login}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <ChevronRightIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              </li>
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
