import { createRouter, createWebHistory } from "vue-router";

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
    path: "/album/:albumUUID",
    name: "album",
    component: () => import("../views/Album.vue"),
    meta: {
      title: "Moefetch | :album",
    },
  },
  {
    path: "/search/:albumUUID",
    name: "search",
    component: () => import("../views/Album.vue"),
    meta: {
      title: "Moefetch | Search",
    },
  },{
    path: "/help",
    name: "help",
    component: () => import("../views/Help.vue"),
    meta: {
      title: "Moefetch | Help",
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