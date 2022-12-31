"use client"

import { createContext } from "react"
import { arrayToMapByKey } from "../../../../../lib/helpers"
import { TranslatedCategory } from "./layout.types"
import { Locales } from "../../../../../lib/constants"

import type { Locale } from "../../../../../lib/app.types"

type LayoutState = {
  categories: Map<string, TranslatedCategory>
  locales: Map<string, Locale>
}

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
