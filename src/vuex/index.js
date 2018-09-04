import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export  default  new Vuex.Store({
    state: {
        userId:"",
        userName:"",
        password:"",
        parkId:""
    },
    mutations: {
        postUserId(state, userId) {
            state.userId=userId;
        },
        postUserName (state, userName) {
            state.userName=userName;
        },
        postPassword (state, password) {
            state.password=password;
        },
        postParkId (state, parkId) {
            state.parkId=parkId;
        }

    }
});