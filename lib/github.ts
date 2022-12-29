import { graphql } from "@octokit/graphql"

const OWNER = "supabase"
const REPO = "supabase"
const DEFAULT_LIMIT = 10

type Discussion = {
  id: string
  name: string
  createdAt: string
  description: string
  slug: string
}
const queryFetchCategories = `
{
  repository(owner: "${OWNER}", name: "${REPO}") {
    discussionCategories(first: ${DEFAULT_LIMIT}) {
      nodes {
        id
        name
        createdAt
        description
        slug
      }
    }
  }
}
`
export async function fetchCategories(): Promise<Discussion[]> {
  // @ts-ignore
  const { repository } = await graphql(queryFetchCategories, {
    headers: {
      authorization: `token ${process.env.NEXT_PUBLIC_DISCUSSIONS_TOKEN}`,
    },
  })
  return repository.discussionCategories.nodes
}

const queryFetchDiscussions = `
{
  repository(owner: "${OWNER}", name: "${REPO}") {
    discussions(first: ${DEFAULT_LIMIT}) {
      nodes {
        id
        author {
          avatarUrl
          url
          login
        }
        body
        title
        answer {
          author {
            avatarUrl
            login
          }
          body
          createdAt
        }
        createdAt
      }
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
}
`
export async function fetchDiscussions() {
  // @ts-ignore
  const { repository } = await graphql(queryFetchDiscussions, {
    headers: {
      authorization: `token ${process.env.NEXT_PUBLIC_DISCUSSIONS_TOKEN}`,
    },
  })
  return repository.discussions.nodes
}
