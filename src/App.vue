<template>
  <v-app>
    <v-toolbar fixed app :clipped-left="clipped" color="blue" dark>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
          v-if="!user.id"
          v-for="(item, index) in topMenuItemsUnAuthorized"
          flat
          :key="'top-menu-'+index"  
          :to="item.link"
      >
        <v-icon left>{{item.icon}}</v-icon>
        {{item.title}}
      </v-btn>
      <v-btn flat v-if="user.id" @click="logOut">
        <v-icon left>exit_to_app</v-icon>
        Log out
      </v-btn>
    </v-toolbar>

    <v-content class="content-wrapper">

      <transition name="slide-fade" mode="out-in">
        <router-view></router-view>
      </transition> 

    </v-content>

    <v-footer :fixed="fixed" app >
      <v-spacer></v-spacer>
        <span>&hearts; Yabadabadooo &copy; 2018</span>
      <v-spacer></v-spacer>
    </v-footer>
    <transition name="fade">
      <div class="preloader" v-if="!appIsLoaded && $route.path === '/'">
        <v-progress-circular :size="50" indeterminate color="blue"></v-progress-circular>
      </div>
    </transition>
  </v-app>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        title: 'Judolaunch ToDo',
        topMenuItemsUnAuthorized: [
          { icon: 'face', title: 'Sign Up', link: '/signup' },
          { icon: 'lock_open', title: 'Sign In', link: '/signin' }
        ],
        clipped: false,
        fixed: false
        
      }
    },
    computed: {
      ...mapGetters([
        'appIsLoaded',
        'user',
        'dialog'
      ]),
      user () { return this.$store.getters['user'] }
    },
    methods: {
      logOut () {
        this.$store.dispatch('logOut')
      }
    }
  }
</script>

<style>
  .preloader{
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content-wrapper{
    width: 100%;
    max-width: 1170px;
    margin: 0 auto;
  }
  .fade-enter-active {
    transition: all .3s ease;
  }
  .fade-leave-active {
    transition: all .5s ease;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
  }
</style>
