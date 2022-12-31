import Sidebar from "./sidebar"
import ThemeProvider from "./providers"
import type { TranslatedCategory, UrlParams } from "./layout.types"
import { fetchCategories } from "../../../../../lib/github"
import { translateStrings } from "../../../../../lib/openai"

export const revalidate = 600 // 10 minutes

async function getData({ params }: { params: UrlParams }) {
  const locale = params.locale.toLocaleLowerCase()
  const skipTranslation = locale == "default" || locale == "en-us"
  const githubCategoriesResponse = await fetchCategories()
  const githubCategories = githubCategoriesResponse.nodes
  let names: string[] = []
  let categories: TranslatedCategory[] = []

  // Enrich categories with href and translated name.
  // For now the translated name is the same as the name.
  for (let i = 0; i < githubCategories.length; i++) {
    const category = githubCategories[i]
    names.push(category.name)
    categories.push({
      ...category,
      href: `/${params.locale}/github/${params.owner}/${params.repo}/categories/${category.slug}`,
      nameTranslation: category.name,
    })
  }

  // Get translations if this is not the default locale
  // @todo: cache translations
  if (!skipTranslation) {
    const translations = await translateStrings(names, locale)
    categories.forEach((category, index) => {
      category.nameTranslation = translations[index]
    })
  }

  return { categories }
}

export default async function DiscussionsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: UrlParams
}) {
  const data = await getData({ params })

  return (
    <html lang="en" className="h-full">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="h-full">
        <Sidebar categories={data.categories} urlParams={params} />
        <ThemeProvider categories={data.categories} labels={[]}>
          <div className=" md:pl-64 flex min-h-0 flex-1 flex-col flex-grow h-full">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
