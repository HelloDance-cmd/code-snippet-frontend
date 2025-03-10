import { createWebHashHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import HomeView from '../view/HomeView.vue'
import UserView from '../view/UserView.vue';
import LoginView from '../view/LoginView.vue';
import RegisterView from '../view/RegisterView.vue';
import DashboardView from '../view/DashboardView.vue';
import TestView from '../view/TestView.vue';
import { fetchTokenIsExpired } from '../utils/userReqeust';
import ForgotPasswordView from '../view/ForgotPasswordView.vue';

const routes: Readonly<RouteRecordRaw[]> = [
  { path: '/', component: HomeView },
  // 用户设置
  { path: '/user-setting', components: UserView },

  { path: '/dashboard', component: DashboardView },

  // 用户登录和注册
  {
    path: '/user',
    children: [
      { path: '/login', component: LoginView },
      { path: '/register', component: RegisterView }
    ]
  },
  { path: '/forget-password', component: ForgotPasswordView },
  { path: '/test', component: TestView }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

/**
 * 设置前置路由守卫
 */
// router.beforeEach(async (to, _, next) => {
//   const toPath = to.path;

//   const whiteList = ['/login', '/register', '/', '/forget-password']
//   if(whiteList.includes(toPath)) {
//     if (localStorage.getItem("token")) localStorage.removeItem("token");
//     next();
//     return;
//   }
  
//   const isExpired = await fetchTokenIsExpired();
  
//   if (isExpired.data.data || isExpired.status == 401)
//     next('/login');
//   else
//     next();
// })

export default router;