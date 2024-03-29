export default [
    {
        path: "dashboard/",
        name: "AdminDashboard",
        component: () => import("../pages/dashboard/Dashboard.vue"),
    },
    {
        path: "users/",
        name: "AdminUsers",
        component: () => import("../pages/users/Users.vue"),
    },
    {
        path: "user-profiles/",
        name: "AdminUserProfiles",
        component: () => import("../pages/users/UserProfiles.vue"),
    },
    {
        path: "user-old/:userId",
        name: "AdminUserOld",
        component: () => import("../pages/users/UserOld.vue"),
    },
    {
        path: "user/:userId/",
        name: "AdminUser",
        component: () => import("../pages/users/User.vue"),
        children: [
            {
                path: "user-overview",
                //alias: "user-overview",
                name: "UserOverview",
                component: () => import("../pages/users/pages/userOverview/UserOverview.vue"),
            },
            {
                path: "subscriptions",
                name: "UserSubscriptions",
                component: () => import("../pages/users/pages/userSubscriptions/UserSubscriptions.vue"),
            },
            {
                path: "free-trials",
                name: "UserFreeTrials",
                component: () => import("../pages/users/pages/userFreeTrials/UserFreeTrials.vue"),
            },
        ]
    },
    {
        path: "plans/",
        name: "AdminPlans",
        component: () => import("../pages/plans/Plans.vue"),
    },
    {
        path: "regulations/",
        name: "AdminRegulations",
        component: () => import("../pages/regulations/Regulations.vue"),
    },
    {
        path: "regulation/:regulationId?",
        name: "AdminRegulation",
        component: () => import("../pages/regulations/Regulation.vue"),
    },
    {
        path: "regulation-types",
        name: "AdminRegulationTypes",
        component: () => import("../pages/regulations/regulationTypes/RegulationTypes.vue"),
    },
    {
        path: "news/",
        name: "AdminNews",
        component: () => import("../pages/news/News.vue"),
    },
    {
        path: "/documents",
        name: "AdminDocuments",
        component: () => import("../pages/documents/Documents.vue"),
    },
    {
        path: "/document/:documentId?",
        name: "AdminDocument",
        component: () => import("../pages/documents/Document.vue"),
    },
    {
        path: "/document-types",
        name: "AdminDocumentTypes",
        component: () => import("../pages/documents/documentTypes/DocumentTypes.vue"),
    },
    {
        path: "articles/",
        name: "AdminArticles",
        component: () => import("../pages/articles/Articles.vue"),
    },
    {
        path: "article/:articleId?/",
        name: "AdminArticle",
        component: () => import("../pages/articles/Article.vue"),
    },
    {
        path: "article-types/",
        name: "AdminArticleTypes",
        component: () => import("../pages/articles/articleTypes/ArticleTypes.vue"),
    },
    {
        path: "questions/",
        name: "AdminQuestions",
        component: () => import("../pages/questions/Questions.vue"),
    },
    {
        path: "question-types/",
        name: "AdminQuestionTypes",
        component: () => import("../pages/questions/questionTypes/QuestionTypes.vue"),
    },
    {
        path: "videos/",
        name: "AdminVideos",
        component: () => import("../pages/videos/Videos.vue"),
    },
    {
        path: "banners/",
        name: "AdminBanners",
        component: () => import("../pages/banners/Banners.vue"),
    }
];