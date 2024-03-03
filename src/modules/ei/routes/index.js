import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import PageNotFound from "../pages/PageNotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
        /* {
          path: '/',
          name: 'home',
          component: HomeView
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        }, */
        {
            path: "/auth",
            name: "Auth",
            component: () => import("../layouts/LoginLayout.vue"),
            children: [
                {
                    path: "/login",
                    name: "Login",
                    component: () => import("../pages/auth/Login.vue"),
                }
            ]
        },
        {
            name: "HomeView",
            component: () => import("../layouts/default/DefaultLayout.vue"),
            path: "/",
            children: [
                {
                    path: "/",
                    alias: ['', 'news'],
                    name: "News",
                    component: () => import("../pages/news/News.vue")
                },
                {
                    path: "/:newsId?/:newsTitle?",
                    name: "NewsOverview",
                    component: () => import("../pages/news/NewsOverview.vue")
                },
                {
                    alias: ['banner-1'],
                    path: "/kontakt/:bannerSlug?",
                    name: "Banner1",
                    component: () => import("../pages/news/components/banners/Banner1.vue"),
                },
                {
                    path: "regulations/",
                    name: "Regulations",
                    component: () => import("../pages/regulations/Regulations.vue"),
                },
                {
                    path: "regulations/:regulationTypeId?",
                    name: "Regulations",
                    component: () => import("../pages/regulations/Regulations.vue"),
                },
                {
                    path: "regulation/:regulationId?",
                    name: "Regulation",
                    component: () => import("../pages/regulations/Regulation.vue"),
                },
                {
                    path: "documents/",
                    name: "Documents",
                    component: () => import("../pages/documents/Documents.vue"),
                },
                {
                    path: "documents/:documentTypeId?",
                    name: "Documents",
                    component: () => import("../pages/documents/Documents.vue"),
                },
                {
                    path: "document/:documentId?",
                    name: "Document",
                    component: () => import("../pages/documents/Document.vue"),
                },
                {
                    path: "create-account/",
                    name: "CreateAccount",
                    component: () => import("../pages/CreateAccount.vue"),
                },
                {
                    path: "articles/",
                    name: "Articles",
                    component: () => import("../pages/articles/Articles.vue"),
                },
                {
                    path: "articles/:articleTypeId?",
                    name: "Articles",
                    component: () => import("../pages/articles/Articles.vue"),
                },
                {
                    path: "article/:articleId?",
                    name: "Article",
                    component: () => import("../pages/articles/Article.vue"),
                },
                {
                    path: "questions/",
                    name: "Questions",
                    component: () => import("../pages/questions/Questions.vue"),
                },
                {
                    path: "questions/:questionTypeId?",
                    name: "Questions",
                    component: () => import("../pages/questions/Questions.vue"),
                },
                {
                    path: "question/:questionId?",
                    name: "Question",
                    component: () => import("../pages/questions/Question.vue"),
                },
                {
                    path: "videos/",
                    name: "Videos",
                    component: () => import("../pages/videos/Videos.vue"),
                },
                {
                    path: "contact/",
                    name: "Contact",
                    component: () => import("../pages/Contact.vue"),
                },
                {
                    path: "no-access/",
                    name: "NoAccess",
                    component: () => import("../pages/noAccess/NoAccess.vue"),
                },
            ],
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        },
        {
            path: "/:pathMatch(.*)*",
            name: "PageNotFound",
            component: PageNotFound
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

export default router

