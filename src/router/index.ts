import { createRouter, type RouteRecordRaw, createWebHistory } from 'vue-router'

import HomeView from '../view/HomeView.vue'
import UserProfileView from '../view/UserProfileView.vue';
import LoginView from '../view/LoginView.vue';
import RegisterView from '../view/RegisterView.vue';
import DashboardView from '../view/DashboardView.vue';
import { fetchTokenIsExpired } from '../utils/userReqeust';
import ForgotPasswordView from '../view/ForgotPasswordView.vue';
import FolderView from '../view/FolderView.vue';
import ControlPanelView from '../view/ControlPanelView.vue';

const routes: Readonly<RouteRecordRaw[]> = [
  { path: '/', component: HomeView },

  { 
    path: '/dashboard',
    component: DashboardView,
    children: [
      { path: 'panel', component: ControlPanelView },
      { path: 'folder', component: FolderView },
      { path: 'setting', component: UserProfileView },
    ]
  },

  // 用户登录和注册
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },

  { path: '/forget-password', component: ForgotPasswordView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * 设置前置路由守卫
 */
router.beforeEach(async (to, _, next) => {
  const toPath = to.path;

  const whiteList = ['/login', '/register', '/', '/forget-password']
  if(whiteList.includes(toPath)) {
    if (localStorage.getItem("token")) localStorage.removeItem("token");
    next();
    return;
  }
  
  const isExpired = await fetchTokenIsExpired();
  
  if (isExpired.data.data || isExpired.status == 401)
    next('/login');
  else
    next();
})

export default router;