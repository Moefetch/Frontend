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
        path: "/album/:albumName",
        name: ":album",
        component: () => import("../views/Album.vue"),
        meta: {
          title: "Moefetch | :album",
        },
      },
      {
        path: "/album/undefined",
        redirect: "/"
      },
      {
        path: "/album/",
        redirect: "/"
      },
    ]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;