export default [
    {
        path: "/",
        alias: "",
        name: "Home",
        component: () => import("@eco/pages/home/index.vue"),
    },
    {
        path: "/places",
        alias: "",
        name: "Places",
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