import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", component: () => import("@/views/HomeView.vue") },
      { path: "media", component: () => import("@/views/MediaView.vue") },
      { path: "media/:id", component: () => import("@/views/MediaDetailView.vue") },
      { path: "projects", component: () => import("@/views/ProjectsView.vue") },
      { path: "projects/:name", component: () => import("@/views/ProjectDetailView.vue") },
      { path: "blog", component: () => import("@/views/BlogView.vue") },
      { path: "blog/:id", component: () => import("@/views/BlogDetailView.vue") },
      { path: "contact", component: () => import("@/views/ContactView.vue") },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/NotFoundView.vue"),
  },
  {
    path: "/admin",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "", component: () => import("@/views/admin/AdminDashboardView.vue") },
      { path: "blog", component: () => import("@/views/admin/AdminBlogView.vue") },
      { path: "projects", component: () => import("@/views/admin/AdminProjectsView.vue") },
      { path: "media", component: () => import("@/views/admin/AdminMediaView.vue") },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  if (to.meta.requiresAuth || to.path === "/login") {
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
  } else {
    next();
  }
});

export default router;
