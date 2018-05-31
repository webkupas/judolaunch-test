import {firebaseApp} from '@/firebase'

const routerOptions = [
  {
    path: '/',
    name: 'Hello',
    component: 'Home',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: 'SignUp',
    beforeEnter: (to, from, next) => {
      firebaseApp.auth().onAuthStateChanged(user => {
        if (user) next('/')
        else next()
      })
    },
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: 'SignIn',
    beforeEnter: (to, from, next) => {
      firebaseApp.auth().onAuthStateChanged(user => {
        if (user) next('/')
        else next()
      })
    },
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '*',
    name: 'Hello',
    component: 'Home',
    beforeEnter: (to, from, next) => {
      firebaseApp.auth().onAuthStateChanged(user => {
        if (user) next('/')
        else next('/signin')
      })
    },
    meta: {
      requiresAuth: true
    }
  }
]
const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}`)
  }
})

export default routes
