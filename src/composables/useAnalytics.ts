import { logEvent } from 'firebase/analytics'
import { analyticsReady } from '@/firebase'

async function track(name: string, params?: Record<string, unknown>) {
  const analytics = await analyticsReady
  if (!analytics) return
  logEvent(analytics, name, params)
}

// Search fires on every keystroke — debounce per list so we only log once
// the user pauses, instead of flooding GA4 with partial queries.
const searchDebounceTimers = new Map<string, ReturnType<typeof setTimeout>>()

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

  function trackSocialClick(platform: string, location: string) {
    track('social_click', { platform, location })
  }

  function trackCvDownload() {
    track('cv_download', {})
  }

  function trackProjectLinkClick(projectName: string, linkLabel: string, linkUrl: string) {
    track('project_link_click', { project_name: projectName, link_label: linkLabel, link_url: linkUrl })
  }

  function trackMediaSourceClick(mediaId: string, mediaTitle: string, externalUrl: string) {
    track('media_source_click', { media_id: mediaId, media_title: mediaTitle, external_url: externalUrl })
  }

  function trackStatusServiceVisit(serviceName: string, url: string) {
    track('status_service_visit', { service_name: serviceName, url })
  }

  function trackMinecraftAddressCopy(serverName: string) {
    track('minecraft_address_copy', { server_name: serverName })
  }

  function trackThemeToggle(newTheme: 'light' | 'dark') {
    track('theme_toggle', { new_theme: newTheme })
  }

  function trackContactFormSubmit() {
    track('contact_form_submit', {})
  }

  function trackContactFormResult(success: boolean, errorMessage?: string) {
    track(success ? 'contact_form_success' : 'contact_form_error', success ? {} : { error: errorMessage })
  }

  function trackFilterSelect(list: 'projects' | 'blog' | 'media', filterValue: string) {
    track('filter_select', { list, filter_value: filterValue })
  }

  function trackSearch(list: 'projects' | 'blog' | 'media', searchTerm: string, resultsCount: number) {
    const existing = searchDebounceTimers.get(list)
    if (existing) clearTimeout(existing)

    if (!searchTerm) {
      searchDebounceTimers.delete(list)
      return
    }

    searchDebounceTimers.set(list, setTimeout(() => {
      track('search', { list, search_term: searchTerm, results_count: resultsCount })
      searchDebounceTimers.delete(list)
    }, 800))
  }

  return {
    trackPageView,
    trackProjectView,
    trackBlogView,
    trackMediaView,
    trackSocialClick,
    trackCvDownload,
    trackProjectLinkClick,
    trackMediaSourceClick,
    trackStatusServiceVisit,
    trackMinecraftAddressCopy,
    trackThemeToggle,
    trackContactFormSubmit,
    trackContactFormResult,
    trackFilterSelect,
    trackSearch,
  }
}
