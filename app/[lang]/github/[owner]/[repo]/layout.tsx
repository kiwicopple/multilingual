import Sidebar from "./sidebar"
import { fetchCategories } from "../../../../../lib/github"

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
        <div className="flex flex-1 flex-col md:pl-64">
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
              </div>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {/* Replace with your content */}
                <div className="py-4">
                  <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
                </div>
                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
