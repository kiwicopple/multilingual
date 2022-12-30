import Pagination from "./pagination"
import { fetchDiscussions } from "../../../../../lib/github"
import {
  CalendarIcon,
  ChevronRightIcon,
  ArrowSmallUpIcon,
} from "@heroicons/react/20/solid"

async function getData({
  params,
}: {
  params: { lang: string; owner: string; repo: string }
}) {
  const githubDiscussions = await fetchDiscussions()
  const {
    nodes: discussions,
    totalCount: totalDiscussions,
    pageSize: discussionsPageSize,
    pageInfo: discussionsPagination,
  } = githubDiscussions

  return {
    discussions,
    totalDiscussions,
    discussionsPageSize,
    discussionsPagination,
  }
}

export default async function Discussions({
  params,
}: {
  params: { lang: string; owner: string; repo: string }
}) {
  const data = await getData({ params })
  const { discussions } = data
  return (
    <div className="flex grow flex-col overflow-y-auto">
      <main className="flex-1">
        <div className="overflow-hidden bg-white border-b border-gray-200 ">
          <ul role="list" className="divide-y divide-gray-200">
            {discussions.map((discussion) => (
              <li key={discussion.id}>
                <a href="#" className="block hover:bg-gray-50">
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
                            {discussion.title}
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
                          {discussion.comments.nodes?.map((commentor) => (
                            <img
                              key={commentor.id}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                              src={commentor.author.avatarUrl}
                              alt={commentor.author.login}
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
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <div className=" border-t border-gray-200">
        <Pagination
          total={data.totalDiscussions}
          pageSize={data.discussionsPageSize}
          pagination={data.discussionsPagination}
        />
      </div>
    </div>
  )
}
