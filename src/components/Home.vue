<template>
  <v-container grid-list-xl>
        <v-layout row wrap pt-5>

          <v-flex xs12 sm6 >
            <koo-all-tasks />
          </v-flex>

          <v-flex xs12 sm6 >
            <koo-today-tasks />
          </v-flex> 

        </v-layout>
        <v-dialog v-model="maxFiveAlert" max-width="290">
          <v-card>
            <v-toolbar color="blue" dark>
              <v-toolbar-title>Ohh you touch my tralala!</v-toolbar-title>
            </v-toolbar>
            <v-card-text>Dear {{user.name}} you can't add more then 5 task to complete for today! &hearts; Hugs &hearts;</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat="flat" @click.native="$store.commit('maxFiveAlertChangeState', false)">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
</template>

<script>
  import TodayTasks from '@/components/HomeWidgets/TodayTasks'
  import AllTasks from '@/components/HomeWidgets/AllTasks'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
      }
    },
    computed: {
      ...mapGetters([
        'user',
        'maxFiveAlert'
      ]),
    },
    components: {
      'koo-today-tasks': TodayTasks,
      'koo-all-tasks': AllTasks
    }
  }
</script>

<style>
  .list__tile__title{
    height: auto !important;
    min-height: 24px;
  }
  .list__tile--avatar{
    height: auto !important;
    min-height: 56px;
  }
  .list__tile__title{
    white-space: normal !important;
  }
</style>

