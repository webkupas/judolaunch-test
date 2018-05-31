import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import {router} from './router/index'
import {firebaseApp} from './firebase'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify)
Vue.config.productionTip = false

/* eslint-disable no-new */
const unsubscribe = firebaseApp.auth()
  .onAuthStateChanged((firebaseUser) => {
    new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App),
      created () {
        if (firebaseUser) {
          this.$store.dispatch('autoSignIn', firebaseUser.uid)
        }
      }
    })
    unsubscribe()
  })
