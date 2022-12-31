"use client"

import { MDXRemote } from "next-mdx-remote"

export default function Loading({ comment }: { comment: any }) {
  return (
    <article className="prose">
      <MDXRemote {...comment} />
    </article>
  )
}
