export default [
    {
        path: "/",
        alias: "",
        name: "ads",
        component: () => import("@ads/pages/home/Index.vue"),
    },
    {
        path: "/ad/:id",
        alias: "/oglas/:id",
        name: "ad",
        component: () => import("@ads/pages/ad/Ad.vue"),
    },
];