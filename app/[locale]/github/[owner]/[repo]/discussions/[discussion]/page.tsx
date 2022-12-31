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
  let comments: TranslatedComment[] = githubDiscussion.comments.nodes.map(
    (comment) => ({
      ...comment,
      titleTranslation: comment.title,
      bodyTranslation: comment.body,
    })
  )

  // The initial discussion is the first comment.
  comments.unshift({
    ...githubDiscussion,
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
    if (comment.id == "D_kwDODMpXOc4AR9Nq") {
      console.log("\n\ncomment.body\n\n", comment.body)
      console.log("\n\ncomment.bodyTranslation\n\n", comment.bodyTranslation)
    }
    const markdown = await serializeMarkdown(comment.body)
    const translation = await serializeMarkdown(comment.bodyTranslation)
    return { markdown, translation }
  })
  const serialized = await Promise.all(serializedPromises)
  return serialized
}

export default async function Discussion({ params }: { params: UrlParams }) {
  const data = await getData({ params })
  const { discussion, serialized } = data

  return (
    <>
      <h2 className="p-4 border-b text-lg font-bold">{discussion.title}</h2>
      {serialized.map((comment, i) => (
        <div key={i} className={`border-b flex divide-x`}>
          <div
            className={`p-4 flex-1 w-1/2 ${i % 2 ? "bg-gray-100" : "bg-white"}`}
          >
            <Comment comment={comment.translation} />
          </div>
          <div
            className={`p-4 flex-1 w-1/2 opacity-10 hover:opacity-100 transition-opacity ${
              i % 2 ? "bg-gray-100" : "bg-white"
            }`}
          >
            <Comment comment={comment.markdown} />
          </div>
        </div>
      ))}
    </>
  )
}
