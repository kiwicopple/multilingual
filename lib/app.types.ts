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
