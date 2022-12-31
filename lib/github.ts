import { graphql } from "@octokit/graphql"

const OWNER = "supabase"
const REPO = "supabase"
const DEFAULT_LIMIT = 10

export type Discussion = {
  id: string
  number: string
  title: string
  createdAt: string
  upvoteCount: number
  author: {
    avatarUrl: string
    url: string
    login: string
  }
  category: {
    id: number
    name: string
  }
  comments: {
    nodes: {
      id: string
      author: {
        avatarUrl: string
        login: string
      }
    }[]
  }
}
export type Category = {
  id: string
  name: string
  createdAt: string
  description: string
  slug: string
  translation?: string
}

export interface GitHubResponse {
  totalCount: number
  pageSize: number
  pageInfo: {
    startCursor: string
    endCursor: string
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
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
export type CategoryResponse = GitHubResponse & { nodes: Category[] }
export async function fetchCategories(): Promise<CategoryResponse> {
  // @ts-ignore
  const { repository } = await graphql(queryFetchCategories, {
    headers: {
      authorization: `token ${process.env.NEXT_PUBLIC_DISCUSSIONS_TOKEN}`,
    },
  })
  return { ...repository.discussionCategories, pageSize: DEFAULT_LIMIT }
}

const queryFetchDiscussions = `
{
  repository(owner: "${OWNER}", name: "${REPO}") {
    discussions(first: ${DEFAULT_LIMIT}) {
      nodes {
        id
        title
        createdAt
        upvoteCount
        number
        author {
          avatarUrl
          url
          login
        }
        category {
          id
          name
        }
        labels(first: 5) {
          nodes {
            id
            color
            description
            name
          }
        }
        comments(first: 5) {
          nodes {
            id
            author {
              avatarUrl
              login
            }
          }
        }
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
export type DiscussionsResponse = GitHubResponse & { nodes: Discussion[] }
export async function fetchDiscussions(): Promise<DiscussionsResponse> {
  // @ts-ignore
  const { repository } = await graphql(queryFetchDiscussions, {
    headers: {
      authorization: `token ${process.env.NEXT_PUBLIC_DISCUSSIONS_TOKEN}`,
    },
  })
  return {
    ...repository.discussions,
    pageSize: DEFAULT_LIMIT,
  }
}
