import { type } from "os"
import {
  GitHubCategory,
  GitHubDiscussion,
} from "../../../../../lib/github.types"

export type SupportedLocales =
  | "default"
  | "en-us"
  | "de-de"
  | "fr-fr"
  | "es-es"
  | "zh-cn"
  | "ja-jp"
export type Locale = {
  id: SupportedLocales
  name: string
  icon: string
}
export type Locales = Map<string, Locale>

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
