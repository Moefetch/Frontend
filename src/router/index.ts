import { createRouter,createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("../views/Home.vue"),
        meta: {
          title: "Home",
        },
      },
      {
        path: "/page1",
        name: "page1",
        component: () => import("../views/Page1.vue"),
        meta: {
          title: "Page1",
        },
      },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;