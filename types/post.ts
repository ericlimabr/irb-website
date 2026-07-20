import { PostStatus, PostType, Prisma, Tag } from "@prisma/client"
import { Post } from "@prisma/client"

export type PostTypeValue = PostType
export type PostStatusValue = PostStatus
export type PostTag = Tag

export type Article = Post

export const postTypeLabels: Record<PostTypeValue, string> = {
  ARTICLE: "Publicação",
  VIDEO: "Sermão",
  STUDY: "Estudo Bíblico",
}

export const postStatusLabels: Record<PostStatusValue, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
}

export type PostsForListing = Prisma.PostGetPayload<{
  select: {
    id: true
    title: true
    status: true
    type: true
    updatedAt: true
    publishedAt: true
  }
}>

export type PostWithoutTags = Prisma.PostGetPayload<{
  include: { tags: false }
}>

export type PostWithTags = Prisma.PostGetPayload<{
  include: { tags: true }
}>

export type PostsForPublicListingWithTags = Prisma.PostGetPayload<{
  select: {
    title: true
    slug: true
    excerpt: true
    status: true
    type: true
    coverImage: true
    updatedAt: true
    publishedAt: true
    tags: {
      select: {
        name: true
      }
    }
  }
}>
