import Vue, { AsyncComponent } from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import Login from './Pages/Login';

const importByPageName = (page: string): AsyncComponent => () =>
  import(
    /* webpackPrefetch: true */ /* webpackChunkName: "[request]" */ /* webpackMode: "lazy" */ `../src/Pages/${page}`
  )

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: importByPageName('Home')
  },
  {
    path: '/login',
    name: 'login',
    component: importByPageName('Login')
  }
]

const router = new VueRouter({ routes })
Vue.use(VueRouter)

export default router
