"use client"

import Link from "next/link"
import { useContext } from "react"
import { LayoutContext } from "../providers"
import { TranslatedDiscussionSummary } from "../layout.types"
import {
  CalendarIcon,
  ChevronRightIcon,
  ArrowSmallUpIcon,
} from "@heroicons/react/20/solid"

export default function DiscussionItem({
  discussion,
}: {
  discussion: TranslatedDiscussionSummary
}) {
  const context = useContext(LayoutContext)
  const { categories } = context
  const category = categories.get(discussion.category.id)

  return (
    <li key={discussion.id}>
      <Link href={discussion.href} className="block hover:bg-gray-50">
        <div className="flex items-center px-4 py-4 sm:px-6">
          <div className="min-w-0 sm:flex sm:items-center sm:justify-between mr-4">
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-transparent bg-green-700 px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
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
                <p className="truncate font-medium text-green-700">
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
                    in {category?.nameTranslation}
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
  )
}
