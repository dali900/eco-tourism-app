import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PageNotFound from "../pages/PageNotFound.vue";
import adminRoutes from "../modules/admin/routes/index"
import ecoRoutes from "../modules/eco/routes/index"
import newsRoutes from "../modules/news/routes/index"
import marketRoutes from "../modules/market/routes/index"
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
            meta: {requiresAuth: true, admin:true},
        },
        {
            name: "Eco",
            path: "/",
            alias: ['/home'],
            component: () => import("@eco/layouts/DefaultLayout.vue"),
            children: ecoRoutes,
        },
        {
            name: "NewsModule",
            path: "/news",
            alias: ['/e-novine'],
            component: () => import("@news/layouts/DefaultLayout.vue"),
            children: newsRoutes,
        },
        {
            name: "MarketModule",
            path: "/market",
            alias: ['/e-novine'],
            component: () => import("@eco/layouts/DefaultLayout.vue"),
            children: marketRoutes,
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

router.beforeEach((to, from, next) => {
    if(to.meta.requiresAuth){
        const authStore = useAuthStore();
        //Auth user exists
        if(authStore.isAuthenticated){
            next();
        }
        //Fetching user from api
        else if (authStore.fetchingUser){
            authStore.$subscribe((mutation, state) => {
                if(state.user){
                    next();
                } else {
                    authStore.redirectUrl = to.fullPath;
                    if(to.meta.requiresAuth) {
                        next({ name: 'AdminLogin', params: {error: 'no-access'} }); 
                    } else {
                        next({ name: 'Login' });
                    }
                }
            });
        }
        //Guest user
        else {
            authStore.redirectUrl = to.fullPath;
            //next({ name: 'Login', query: { from: loginpath } });
            if(to.meta.requiresAuth) {
                next({ name: 'AdminLogin' });
            } else {
                next({ name: 'Login' });
            }
        }
    } else {
        next();
    }
})

export default router

