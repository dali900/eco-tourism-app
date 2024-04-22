export default [
    {
        path: "/",
        alias: "",
        name: "home",
        component: () => import("@eco/pages/home/index.vue"),
    },
    {
        path: "about/",
        alias: ["onama/"],
        name: "about",
        component: () => import("@eco/pages/AboutUs.vue"),
    },
    {
        path: "places/",
        alias: "mesta/",
        name: "places",
        component: () => import("@eco/pages/places/Places.vue"),
    },
    {
        path: "place/:id?",
        name: "place",
        component: () => import("@eco/pages/places/Place.vue"),
    },
    {
        path: "attraction/:id?",
        alias: "atrakcije/",
        name: "attraction",
        component: () => import("@eco/pages/attractions/Attraction.vue"),
    },
    {
        path: "attractions/",
        name: "attractions",
        component: () => import("@eco/pages/attractions/Attractions.vue"),
    },
    {
        path: "eco-categories/",
        name: "eco-categories",
        component: () => import("@eco/pages/ecoCategories/Categories.vue"),
    },
    {
        path: "eco-category/:id",
        name: "eco-category",
        component: () => import("@eco/pages/ecoCategories/Category.vue"),
    },
    /* {
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
    }, */
];