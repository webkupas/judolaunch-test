import Vue from 'vue'
import Vuex from 'vuex'
import { db, firebaseApp } from '@/firebase'
import { router } from '@/router/index'
import { currentDateCode, currentTime } from '@/helpers' 

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appIsLoaded: false,
    user: {
      id: null,
      name: null
    },
    allTasks: [],
    todayTasks: [],
    history: [],
    maxFiveAlert: false
  },
  getters: {
    appIsLoaded: (state) => state.appIsLoaded,
    user: (state) => state.user,
    allTasks: (state) => state.allTasks,
    todayTasks: (state) => state.todayTasks,
    history: (state) => state.history,
    maxFiveAlert: (state) => state.maxFiveAlert
  },
  mutations: {
    setUser (state, userID) { state.user.id = userID },
    setUserName (state, name) { state.user.name = name },
    setAllTasks (state, tasks) { state.allTasks = tasks },
    setTodayTasks (state, tasks) { state.todayTasks = tasks },
    setHistory (state, history) { state.history = history },
    setAppAsLoaded (state) { state.appIsLoaded = true },
    resetAll (state) { 
      state.user.id = null
      state.user.name = null
      state.appIsLoaded = false
      state.allTasks = []
      state.todayTasks = []
      state.history = []
      state.maxFiveAlert = false
    },
    addNewTask (state, taskTitle) {state.allTasks.push(taskTitle)},
    deleteTask (state, index) {state.allTasks.splice(index, 1)},
    moveTaskOnToday (state, taskTitle) {state.todayTasks.push({name: taskTitle, done: false})},
    removeTaskFromToday (state, index) {state.todayTasks.splice(index, 1)},
    maxFiveAlertChangeState (state, isVisible) {state.maxFiveAlert = isVisible}
  },
  actions: {
    logOut ({commit}) {
      commit('resetAll')
      firebaseApp.auth().signOut()
      router.push('/signin')
      if (typeof localStorage !== 'undefined') {
          try {
              localStorage.removeItem('vuex')
          } catch(e) {
              throw new Error('localStorage is disabled')
          }
      }
    },
    autoSignIn ({commit, dispatch}, userID) {
      db.collection('users').doc(userID).get()
        .then(UserDocRef => {
          if (UserDocRef.exists && UserDocRef.data()) {
            if (UserDocRef.data().name && UserDocRef.data().name !== '') {
              commit('setUserName', UserDocRef.data().name)
            }
            if (UserDocRef.data().all && Array.isArray(UserDocRef.data().all)) {
              commit('setAllTasks', UserDocRef.data().all)
            }            
            if (UserDocRef.data().history &&
                Object.keys(UserDocRef.data().history).length && 
                UserDocRef.data().history[currentDateCode()] &&
                UserDocRef.data().history[currentDateCode()].tasks) {
                  commit('setTodayTasks', UserDocRef.data().history[currentDateCode()].tasks)
            }
          }
        })
        .then(() => {
          commit('setAppAsLoaded')
        })
      commit('setUser', userID, {root: true})
    },
    signUserIn ({commit, dispatch}, payload) {
      return firebaseApp.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(userObj => {
          dispatch('autoSignIn', userObj.user.uid)
        })
    },
    registerNewUser ({commit, dispatch}, payload) {
      return firebaseApp.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then((userObj) => {
          if (userObj.user) {
            userObj.user.updateProfile({
              displayName: payload.name
            })  
          } else {
            throw new Error('Can not fetch user credentioals from firebase')
          }
          return userObj.user
        })
        .then(user => {
          if (user) {
            dispatch('createNewUser', {name: payload.name, email: payload.email, id: user.uid})
              .catch(error => console.error(error))
          }
        })
        .catch(error => { throw error })
    },
    createNewUser (context, user) {
      db.collection('users').doc(user.id)
        .set({
          name: user.name,
          email: user.email,
          id: user.id
        })
        .then(() => {
          console.log('New user document successfully written!')
          return user
        })
        .catch((error) => {
          console.error('Error writing document: ', error)
          throw new Error('Error writing document: ', error)
        })
    },
    updateRemoteAllTasksList ({getters}) {
      db.collection('users').doc(getters.user.id).update({
        'all':getters.allTasks
      })
    },
    updateRemoteTodayTasksList ({getters}) {
      db.collection('users').doc(getters.user.id).update({
        [`history.${currentDateCode()}.tasks`]:getters.todayTasks,
        [`history.${currentDateCode()}.time`]: currentTime()
      })
    },
    addNewTask ({commit, dispatch}, taskTitle) {
      commit('addNewTask', taskTitle)
      dispatch('updateRemoteAllTasksList')
    },
    deleteTask ({commit, dispatch}, index) {
      commit('deleteTask', index)
      dispatch('updateRemoteAllTasksList')
    },
    moveTaskOnToday ({commit, dispatch, getters}, task) {
      if( getters.todayTasks.length < 5 ) {
        commit('moveTaskOnToday', task.title)
        commit('deleteTask', task.index)
        dispatch('updateRemoteTodayTasksList')
        dispatch('updateRemoteAllTasksList')
      } else {
        commit('maxFiveAlertChangeState', true)
      }
    },
    removeTaskFromToday ({commit, dispatch}, task) {
      commit('addNewTask', task.title)
      commit('removeTaskFromToday', task.index)
      dispatch('updateRemoteTodayTasksList')
      dispatch('updateRemoteAllTasksList')
    },
    fetchHistory ({commit, getters}) {
      db.collection('users').doc(getters.user.id).get()
        .then(userDocRef => {
          if (userDocRef.exists && userDocRef.data() && userDocRef.data().history) {
            commit('setHistory', userDocRef.data().history)
          }
        })
        .catch(error => console.error('Error with fetching user history', error))
    }
  }
})
