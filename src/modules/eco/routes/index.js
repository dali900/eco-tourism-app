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