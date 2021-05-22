import Vue from 'vue'
import Router from 'vue-router'
import { storage as StoreAction } from '@/common/';
import Cookies from 'js-cookie';

// Containers
import Full from '@/container/Full';

// 路由懶加載
const Redirect = () => import('@/views/Redirect');
const Login = () => import('@/views/Login');
const LoggedHome = () => import('@/views/LoggedHome');
const GUI = () => import('@/views/GUI');

// 由於正式會員登入後,後端產生的cookie在domain前面會加上"."因此用此方法移除
function removeSubdomainCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
  document.cookie = name + "=" + "; expires=" + exp.toGMTString() + "; path=/; domain=." + window.location.host;
}

Vue.use(Router);

const router = new Router({
  base: process.env.ROUTER_PATH,
  mode: 'history',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      component: Full,
      children: [
        {
          path: '/',
          name: 'Login',
          component: Login
        },
        {
          path: '/home',
          name: 'LoggedHome',
          component: LoggedHome
        },
        {
          path: '/redirect', //richmenu導頁用
          name: 'Redirect',
          component: Redirect
        },
        {
          path: '/gui',
          name: 'GUI',
          component: GUI
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  next();
});

export default router
