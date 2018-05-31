<template>
  <v-card>
    <v-toolbar color="blue" dark>
      <v-toolbar-title>Tasks for today ({{todayDate}})</v-toolbar-title>      
    </v-toolbar>
    <v-list>
      <v-subheader class="pt-3 pb-1" style="height: auto">Do not put off till tomorrow what you can do the day after tomorrow =D <br>
        PS: {{user.name}} please mark task in case it's done
      </v-subheader>

      <v-list-tile avatar v-for="(task, index) in todayTasks" :key="index" class="tasks-item">
        <v-list-tile-action>
          <v-btn flat fab small @click="moveTaskToAll(task.name, index)">
            <v-icon medium color="grey">chevron_left</v-icon>
          </v-btn>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{task.name}}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-checkbox v-model="task.done" color="info" @click="changeTaskStatus(index)"></v-checkbox>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>

  </v-card>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {currentDate} from '@/helpers'
  export default {
    data () {
      return {
        preloaderShow: false,
      }
    },
    computed: {
      ...mapGetters([
        'todayTasks',
        'user'
      ]),
      active () {
        return this.todayTasks.length
      },
      todayDate() {
        return currentDate()
      }
    },
    methods: {
      moveTaskToAll (taskTitle, index) { 
        this.$store.dispatch('removeTaskFromToday', {title: taskTitle, index: index})
      },
      changeTaskStatus (index) {
        this.todayTasks[index].done = !this.todayTasks[index].done
        this.$store.dispatch('updateRemoteTodayTasksList')
      }
    }
  }
</script>

<style>
  .auth-preloader{
    margin: 0 0 5px 10px;
    opacity: 0;
    transition: opacity .3s;
  }
  .auth-preloader.is-visible{
    opacity: 1;
  }
</style>