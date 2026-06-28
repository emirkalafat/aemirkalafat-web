import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import LoginView from "@/views/LoginView.vue";
import MediaView from "@/views/MediaView.vue";
import HomeView from "@/views/HomeView.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import BlogView from "@/views/BlogView.vue";
import StatusView from "@/views/StatusView.vue";
import MediaDetailView from "@/views/MediaDetailView.vue";
import ProjectDetailView from "@/views/ProjectDetailView.vue";
import BlogDetailView from "@/views/BlogDetailView.vue";
import ContactView from "@/views/ContactView.vue";
import AdminDashboardView from "@/views/admin/AdminDashboardView.vue";
import AdminBlogView from "@/views/admin/AdminBlogView.vue";
import AdminProjectsView from "@/views/admin/AdminProjectsView.vue";
import AdminMediaView from "@/views/admin/AdminMediaView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", component: HomeView },
      { path: "media", component: MediaView },
      { path: "media/:id", component: MediaDetailView },
      { path: "projects", component: ProjectsView },
      { path: "projects/:name", component: ProjectDetailView },
      { path: "blog", component: BlogView },
      { path: "blog/:id", component: BlogDetailView },
      // { path: "status", component: StatusView },
      { path: "contact", component: ContactView },
    ],
  },
  {
    path: "/login",
    component: LoginView,
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundView,
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", component: AdminDashboardView },
      { path: "blog", component: AdminBlogView },
      { path: "projects", component: AdminProjectsView },
      { path: "media", component: AdminMediaView },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const { user, authReady } = useAuth();
  await authReady;

  if (to.meta.requiresAuth && !user.value) {
    const redirect = to.fullPath;
    next({ path: "/login", query: { redirect } });
  } else if (to.path === "/login" && user.value) {
    next("/admin");
  } else {
    next();
  }
});

export default router;
