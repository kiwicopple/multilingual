import { type } from "os"
import {
  GitHubCategory,
  GitHubDiscussion,
} from "../../../../../lib/github.types"

export type UrlParams = {
  locale: string
  owner: string
  repo: string
  category?: string
}

export type TranslatedCategory = GitHubCategory & {
  href: string
  nameTranslation: string
}

export type TranslatedDiscussion = GitHubDiscussion & {
  href: string
  titleTranslation: string
}
