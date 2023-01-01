"use client"

import { MDXRemote } from "next-mdx-remote"
import { TranslatedComment } from "../../../layout.types"

export default function Loading({
  comment,
  markdown,
}: {
  comment: TranslatedComment
  markdown: any
}) {
  const isRoot = comment.level == 0
  const paddingLevel = isRoot ? "" : "border-l-10"

  //   if (!comment.author) {
  //     console.log("comment", comment)
  //     return null
  //   }
  return (
    <div className={`comment flex flex-col ${paddingLevel}`}>
      <div className="comment-header p-4 border-b opacity-20 remove-opacity-on-hover">
        <img
          className="inline-block h-6 w-6 rounded-full border border-gray-300"
          src={comment.author.avatarUrl}
          alt={comment.author.login}
          title={comment.author.login}
        />
        <span className="text-gray-500 text-sm ml-4">
          {comment.author.login} commented at{" "}
          <time dateTime={comment.createdAt}>{comment.createdAt}</time>
        </span>
      </div>
      <div className="p-4">
        <article className="prose">
          <MDXRemote {...markdown} />
        </article>
      </div>
    </div>
  )
}
