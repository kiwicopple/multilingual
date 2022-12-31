import Sidebar from "./sidebar"
import type { UrlParams } from "./layout.types"
import { fetchCategories } from "../../../../../lib/github"
import { translateCategories } from "../../../../../lib/openai"

async function getData({ params }: { params: UrlParams }) {
  const githubCategories = await fetchCategories()
  const categories = githubCategories.nodes.map((category) => ({
    ...category,
    href: `/${params.locale}/github/${params.owner}/${params.repo}/categories/${category.slug}`,
  }))

  // Get translations if this is not the default locale
  // @todo: cache translations
  const locale = params.locale.toLocaleLowerCase()
  const skipTranslation = locale == "default" || locale == "en-us"
  if (!skipTranslation) {
    const translations = await translateCategories(categories, locale)
    console.log("translations", translations)

    categories.forEach((category, index) => {
      category.translation = translations[index]
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
        <div className=" md:pl-64 flex min-h-0 flex-1 flex-col flex-grow h-full">
          {children}
        </div>
      </body>
    </html>
  )
}
