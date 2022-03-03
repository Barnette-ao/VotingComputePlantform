import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Vote from '../views/vote.vue'
import Result from '../views/result.vue'
import Register from '../views/register.vue'
import Login from '../views/Login.vue'
import Guide from '../views/guide.vue'

Vue.use(VueRouter)

const constantRoutes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/guide',
    name: 'Guide',
    component: Guide
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/vote',
    name: 'Vote',
    component: Vote
  },
  {
    path: '/result',
    name: 'Result',
    component: Result
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]


const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
