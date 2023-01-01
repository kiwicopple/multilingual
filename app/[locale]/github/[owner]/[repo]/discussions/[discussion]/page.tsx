import Comment from "./client/Comment"
import { TranslatedComment, UrlParams } from "../../layout.types"
import { fetchDiscussion } from "../../../../../../../lib/github"
import { translateMarkdown } from "../../../../../../../lib/openai"
import { serializeMarkdown } from "../../../../../../../lib/helpers"

async function getData({ params }: { params: UrlParams }) {
  const number = params.discussion!
  const locale = params.locale.toLocaleLowerCase()
  const skipTranslation = locale == "default" || locale == "en-us"
  const githubDiscussionResponse = await fetchDiscussion(number)
  const githubDiscussion = githubDiscussionResponse.discussion

  // Pluck out the comments and add default translations.
  let comments: TranslatedComment[] = []

  githubDiscussion.comments.nodes.forEach((comment) => {
    comments.push({
      ...comment,
      level: 0,
      titleTranslation: comment.title,
      bodyTranslation: comment.body,
    })

    // if there are replies, add them to the comments array.
    if (comment.replies?.nodes.length) {
      comment.replies.nodes.forEach((reply) => {
        comments.push({
          ...reply,
          level: 1,
          titleTranslation: reply.title,
          bodyTranslation: reply.body,
        })
      })
    }
  })

  // The initial discussion is the first comment.
  comments.unshift({
    ...githubDiscussion,
    level: 0,
    titleTranslation: githubDiscussion.title,
    bodyTranslation: githubDiscussion.body,
  })

  // Get translations if this is not the default locale
  // @todo: cache translations
  if (!skipTranslation) {
    const translationPromises = comments.map((comment) => {
      return translateMarkdown(comment.body, locale)
    })
    const translations = await Promise.all(translationPromises)
    comments.forEach((comment, index) => {
      comment.bodyTranslation = translations[index] || comment.body
    })
  }

  // Serialize the markdown.
  const serialized = await serializeComments(comments)

  return {
    discussion: githubDiscussion,
    comments,
    serialized,
  }
}

async function serializeComments(comments: TranslatedComment[]) {
  const serializedPromises = comments.map(async (comment) => {
    // if (comment.id == "D_kwDODMpXOc4AR9Nq") {
    //   console.log("\n\ncomment.body\n\n", comment.body)
    //   console.log("\n\ncomment.bodyTranslation\n\n", comment.bodyTranslation)
    // }
    const markdown = await serializeMarkdown(comment.body)
    const translation = await serializeMarkdown(comment.bodyTranslation)
    return { markdown, translation }
  })
  const serialized = await Promise.all(serializedPromises)
  return serialized
}

export default async function Discussion({ params }: { params: UrlParams }) {
  const data = await getData({ params })
  const { discussion, comments, serialized } = data

  return (
    <>
      <h2 className="p-4 border-b text-lg font-bold">{discussion.title}</h2>
      {comments.map((comment, i) => (
        <div key={i} className={`border-b flex divide-x`}>
          <div
            className={`flex-1 w-1/2 bg-white hover:bg-gray-100 transition-colors`}
          >
            <Comment comment={comment} markdown={serialized[i].translation} />
          </div>
          <div
            className={`flex-1 w-1/2 opacity-10 hover:opacity-100 transition-opacity bg-gray-100`}
          >
            <Comment comment={comment} markdown={serialized[i].markdown} />
          </div>
        </div>
      ))}
    </>
  )
}
