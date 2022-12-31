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

export type GitHubDiscussion = {
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
  category: GitHubCategory
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
export type GitHubCategory = {
  id: string
  name: string
  createdAt: string
  description: string
  slug: string
}
