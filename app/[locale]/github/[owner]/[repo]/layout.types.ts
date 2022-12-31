import { type } from "os"
import {
  GitHubCategory,
  GitHubDiscussionComment,
  GitHubDiscussionSummary,
} from "../../../../../lib/github.types"

export type UrlParams = {
  locale: string
  owner: string
  repo: string
  category?: string
  discussion?: number
}

export type TranslatedCategory = GitHubCategory & {
  href: string
  nameTranslation: string
}

export type TranslatedDiscussionSummary = GitHubDiscussionSummary & {
  href: string
  titleTranslation: string
}

export type TranslatedComment = GitHubDiscussionComment & {
  titleTranslation: string
  bodyTranslation: string
}
