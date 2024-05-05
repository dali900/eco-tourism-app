export default [
    {
        path: "/",
        alias: "",
        component: () => import("@news/pages/home/Index.vue"),
    },
    {
        path: ":id/",
        name: "news-overview",
        component: () => import("@news/pages/newsOverview/News.vue"),
    },
    {
        path: "news-category/:id",
        name: "news-category",
        component: () => import("@news/pages/home/newsCategories/Category.vue"),
    },
];