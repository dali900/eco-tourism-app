import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PageNotFound from "../pages/PageNotFound.vue";
import adminRoutes from "../modules/admin/routes/index"
import ecoRoutes from "../modules/eco/routes/index"
const router = createRouter({
  history: createWebHistory(),
  routes: [
        {
            name: "AdminAuth",
            path: "/admin-login",
            component: () => import("@admin/layouts/LoginLayout.vue"),
            children: [
                {
                    name: "AdminLogin",
                    path: "/admin-login",
                    alias: "admin-login",
                    component: () => import("@admin/pages/auth/Login.vue"),
                }
            ]
        },
        {
            name: "Admin",
            path: "/admin",
            component: () => import("@admin/layouts/DefaultLayout.vue"),
            children: adminRoutes,
            meta: {requiresAuth: true, adminPanel: true},
        },
        {
            name: "Eco",
            path: "/",
            alias: ['/home'],
            component: () => import("@eco/layouts/DefaultLayout.vue"),
            children: ecoRoutes,
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

/* router.beforeEach((to, from, next) => {
    if(to.meta.requiresAuth && to.meta.adminPanel){
        const authStore = useAuthStore();
        //Auth user exists
        if(authStore.isAuthenticated && authStore.hasAccessLevel(1)){
            next();
        }
        //Fetching user from api
        else if (authStore.fetchingUser){
            authStore.$subscribe((mutation, state) => {
                if(state.user && authStore.hasAccessLevel(1)){
                    next();
                } else {
                    authStore.redirectUrl = to.fullPath;
                    next({ name: 'AdminLogin', params: {error: 'no-access'} }); 
                }
            });
        }
        //Guest user
        else {
            authStore.redirectUrl = to.fullPath;
            //next({ name: 'Login', query: { from: loginpath } });
            next({ name: 'AdminLogin' });
        }
    } else {
        next();
    }
}) */

export default router

