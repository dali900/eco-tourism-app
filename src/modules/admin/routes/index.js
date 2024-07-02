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
        path: "attractions",
        name: "AdminAttractions",
        component: () => import("../pages/attractions/Attractions.vue"),
    },
    {
        path: "attraction/:attractionId?",
        name: "AdminAttraction",
        component: () => import("../pages/attractions/Attraction.vue"),
    },
    {
        path: "attraction-categories",
        name: "AdminAttractionCategories",
        component: () => import("../pages/attractions/attractionCategories/AttractionCategories.vue"),
    },
    {
        path: "places",
        name: "AdminPlaces",
        component: () => import("../pages/places/Places.vue"),
    },
    {
        path: "place/:id?",
        name: "AdminPlace",
        component: () => import("../pages/places/Place.vue"),
    },
    {
        path: "news/",
        name: "admin-news",
        component: () => import("../pages/news/News.vue"),
    },
    {
        path: "news-form/:id?",
        name: "admin-news-form",
        component: () => import("../pages/news/NewsForm.vue"),
    },
    {
        path: "news-categories",
        name: "admin-news-categories",
        component: () => import("../pages/news/newsCategories/NewsCategories.vue"),
    },
    {
        path: "trips/",
        name: "admin-trips",
        component: () => import("../pages/trip/Trips.vue"),
    },
    {
        path: "trip/:id?",
        name: "admin-trip",
        component: () => import("../pages/trip/Trip.vue"),
    },
    {
        path: "other/languages/",
        name: "languages",
        component: () => import("../pages/languages/Languages.vue"),
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
        path: "banners/",
        name: "AdminBanners",
        component: () => import("../pages/banners/Banners.vue"),
    }
];