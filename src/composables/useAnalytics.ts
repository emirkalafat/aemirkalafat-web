import { logEvent } from 'firebase/analytics'
import { analyticsReady } from '@/firebase'

async function track(name: string, params?: Record<string, unknown>) {
  const analytics = await analyticsReady
  if (!analytics) return
  logEvent(analytics, name, params)
}

export function useAnalytics() {
  function trackPageView(path: string, title: string) {
    track('page_view', {
      page_path: path,
      page_title: title,
      page_location: window.location.href,
    })
  }

  function trackProjectView(name: string) {
    track('view_project', { project_name: name })
  }

  function trackBlogView(id: string, title: string, category?: string) {
    track('view_blog_post', { blog_id: id, blog_title: title, blog_category: category })
  }

  function trackMediaView(id: string, title: string, type?: string) {
    track('view_media', { media_id: id, media_title: title, media_type: type })
  }

  return { trackPageView, trackProjectView, trackBlogView, trackMediaView }
}
