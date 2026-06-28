import { getAll, upsert } from '@/services/db'
import { seedBlogPosts } from '@/data/blog'
import { seedProjects } from '@/data/projects'
import { seedMediaCards } from '@/data/media'
import type { BlogPost } from '@/data/blog'
import type { Project } from '@/data/projects'
import type { MediaCardData } from '@/data/media'

export async function seedFirestore(): Promise<void> {
  // Seed blog posts
  const existingBlog = await getAll<BlogPost>('blog')
  if (existingBlog.length === 0) {
    for (const post of seedBlogPosts) {
      await upsert('blog', post.id, post)
    }
  }

  // Seed projects
  const existingProjects = await getAll<Project>('projects')
  if (existingProjects.length === 0) {
    for (const project of seedProjects) {
      await upsert('projects', project.name, project)
    }
  }

  // Seed media
  const existingMedia = await getAll<MediaCardData>('media')
  if (existingMedia.length === 0) {
    for (const card of seedMediaCards) {
      await upsert('media', card.id, card)
    }
  }
}
