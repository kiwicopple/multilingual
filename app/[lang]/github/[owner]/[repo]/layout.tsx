import Sidebar from "./sidebar"
import { fetchCategories } from "../../../../../lib/github"
import Pagination from "./pagination"

async function getData({
  params,
}: {
  params: { lang: string; owner: string; repo: string }
}) {
  const githubCategories = await fetchCategories()
  const categories = githubCategories.map((category) => ({
    ...category,
    href: `/${params.lang}/github/${params.owner}/${params.repo}/categories/${category.slug}`,
  }))

  return { categories }
}

export default async function DiscussionsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string; owner: string; repo: string }
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
          <div className="flex grow flex-col overflow-y-auto">{children}</div>
          <div className=" border-t border-gray-200">
            <Pagination />
          </div>
        </div>
      </body>
    </html>
  )
}
