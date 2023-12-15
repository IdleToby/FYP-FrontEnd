import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/frontPage',
      name: 'frontPage',
      component: () => import('../views/FrontPageView.vue')
    },
    {
      path: '/myProfile',
      name: 'myProfile',
      component: () => import('../views/MyProfileView.vue')
    },
    {
      path: '/changePassword',
      name: 'changePassword',
      component: () => import('../views/ChangePasswordView.vue')
    },
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: () => import('../views/ForgetPasswordView.vue')
    },
    {
      path: '/profile/:userId',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsView.vue')
    },
    {
      path: '/news/newsDetails/:newsId',
      name: 'newsDetails',
      component: () => import('../views/NewsDetailView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      children: [
        {
          path: 'userManagement',
          name: 'userManagement',
          component: () => import('../views/UserManagementView.vue')
        },
        {
          path: 'newsManagement',
          name: 'newsManagement',
          component: () => import('../views/NewsManagementView.vue')
        },
        {
          path: 'postManagement',
          name: 'postManagement',
          component: () => import('../views/PostManagementView.vue')
        }
      ]
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue')
    }
  ]
})

export default router
