"use client"

import { createContext } from "react"
import { arrayToMapByKey } from "../../../../../lib/helpers"
import { Locale, TranslatedCategory } from "./layout.types"

type LayoutState = {
  categories: Map<string, TranslatedCategory>
  locales: Map<string, Locale>
}

export const Locales: Map<string, Locale> = new Map([
  [
    "default",
    {
      id: "default",
      name: "Default",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg",
    },
  ],
  [
    "en-us",
    {
      id: "en-us",
      name: "English (US)",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg",
    },
  ],
  [
    "de-de",
    {
      id: "de-de",
      name: "German",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/DE.svg",
    },
  ],
  [
    "fr-fr",
    {
      id: "fr-fr",
      name: "French",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg",
    },
  ],
  [
    "es-es",
    {
      id: "es-es",
      name: "Spanish",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg",
    },
  ],
  [
    "zh-cn",
    {
      id: "zh-cn",
      name: "China (Mandarin)",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/CN.svg",
    },
  ],
  [
    "ja-jp",
    {
      id: "ja-jp",
      name: "Japanese",
      icon: "http://purecatamphetamine.github.io/country-flag-icons/3x2/JP.svg",
    },
  ],
])

const defaultState: LayoutState = {
  categories: new Map(),
  locales: Locales,
}
export const LayoutContext = createContext(defaultState)

export default function LayoutProvider({
  children,
  categories,
}: {
  children: React.ReactNode
  categories: TranslatedCategory[]
  labels: []
}) {
  const categoriesSet = arrayToMapByKey(categories, "id")
  return (
    <LayoutContext.Provider
      value={{ categories: categoriesSet, locales: Locales }}
    >
      {children}
    </LayoutContext.Provider>
  )
}
