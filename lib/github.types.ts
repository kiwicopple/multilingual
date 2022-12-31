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

export type GitHubUser = {
  avatarUrl: string
  login: string
  url: string
}

export type GitHubDiscussionSummary = {
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

export type GitHubDiscussionComment = {
  id: string
  number: string
  createdAt: string
  title: string
  body: string
  author: GitHubUser
  isAnswer: boolean
}

export type GitHubDiscussion = GitHubDiscussionComment & {
  category: GitHubCategory
  comments: {
    nodes: GitHubDiscussionComment[]
  }
}
