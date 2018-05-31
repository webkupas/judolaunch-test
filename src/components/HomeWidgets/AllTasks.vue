<template>
  <v-card>
    <v-toolbar color="blue" dark>
      <v-toolbar-title>All tasks</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="openHistory" class="white blue--text">History</v-btn>
    </v-toolbar>

    <v-card-title primary-title>
      <v-text-field
          :append-icon="'send'"
          :append-icon-cb="() => addNewTask(newTask)"
          label="Add New Task"
          v-model="newTask"
          @keydown.enter.native="addNewTask"
        ></v-text-field>
    </v-card-title>
    
    <v-list>
      <v-list-tile v-for="(task, index) in allTasks" avatar :key="index + '-task'" class="tasks-item">
        <v-list-tile-content>
          <v-list-tile-title>{{task}}</v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-btn flat fab small @click="deleteTask(index)">
            <v-icon medium color="red">close</v-icon>
          </v-btn>
        </v-list-tile-action>
        
        <v-list-tile-action>
          <v-btn flat fab small @click="moveTaskOnToday(task, index)">
            <v-icon medium color="grey">chevron_right</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-dialog v-model="historyModal" width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">History</span>
        </v-card-title>
        <v-card-text>
          <p v-for="(item, index) in history" :key="index" class="history-item grey lighten-3">
            <strong>{{`${index.substr(-2)}/${index.substr(-4, 2)}/${index.substr(1, 4)}`}}</strong> (last modified - {{item.time}}) </br>
            <span v-for="(task, index) in item.tasks" :key="index">
              <span :class="task.done ? 'green--text' : 'red--text'">{{task.done ? '&#10004;' : '&#10008; '}}</span>
              {{task.name}}</br>
              </span>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="historyModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        newTask: '',
        historyModal: false
      }
    },
    computed: {
      ...mapGetters([
        'allTasks',
        'history'
      ]),
      reversedHistory () {
        return this.history
      }
    },
    methods: {
      addNewTask (val) {
        let taskName = '';
        if (val instanceof Event) taskName = val.target.value
        else if (typeof(val) === 'string') taskName = val

        if (taskName !== ''){
          this.$store.dispatch('addNewTask', taskName)
            .then(() => {
              this.newTask = ''
            })
        }
      },
      deleteTask (index) {
        this.$store.dispatch('deleteTask', index)      
      },
      moveTaskOnToday(taskTitle, index) {
        this.$store.dispatch('moveTaskOnToday', {title: taskTitle, index: index})        
      },
      openHistory () {
        this.$store.dispatch('fetchHistory')
          .then(()=>{this.historyModal = true})        
      }
    }
  }
</script>
<style scoped>
  .history-item{
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
  }
</style>
 