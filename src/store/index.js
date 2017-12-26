import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    queueList: [],
    jobDetail: {},
    jobList: [],
  },
  mutations: {
    updateQueueList(state, queues) {
      state.queueList = queues;
    },
    updateCurrentQueue(state, payload) {
      state.currentQName = payload.queue;
    },
    updateJobList(state, jobs) {
      state.jobList = jobs;
    },
    updateJobDetail(state, job) {
      state.jobDetail = job;
    },
  },
  actions: {
    getQueues({ commit }) {
      return Vue.http.get('http://localhost:2000/api/queues').then(response => commit('updateQueueList', response.body));
    },
    getJobs({ commit }, payload) {
      return Vue.http.get(`http://localhost:2000/api/queues/${payload.queue}/jobs`, { params: { status: payload.status } })
        .then(response => commit('updateJobList', response.body));
    },
    getJob({ commit }, payload) {
      return Vue.http.get(`http://localhost:2000/api/queues/${payload.queue}/jobs/${payload.id}`)
        .then(response => commit('updateJobDetail', response.body));
    },
  },
});
