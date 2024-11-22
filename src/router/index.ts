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
  },{
    path: "/settings",
    name: "settings",
    component: () => import("../views/SettingsMenu.vue"),
    meta: {
      title: "Moefetch | Settings",
    },
    children: [
      {
        name: "connections",
        path: "connections",
        component: () => import("../components/SettingsPages/Connections.vue")
      },
      {
        name: "appearance",
        path: "appearance",
        component: () => import("../components/SettingsPages/Appearance.vue")
      },
      {
        name: "behaviour",
        path: "behaviour",
        component: () => import("../components/SettingsPages/Behaviour.vue")
      },
      {
        name: "parameters",
        path: "parameters",
        component: () => import("../components/SettingsPages/Parameters.vue")
      },
      {
        name: "Export Or Import Settings",
        path: "export_or_import_settings",
        component: () => import("../components/SettingsPages/ExportAndImport.vue")
      },
      {
        name: "keys",
        path: "keys",
        component: () => import("../components/SettingsPages/Keys.vue")
      },
    ]
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