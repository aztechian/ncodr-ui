import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const config = {};
if (window.ncodr) {
  Object.assign(config, window.ncodr);
}

export default new Vuex.Store({
  state: {
    config,
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
      return Vue.http.get('/api/queues').then(response => commit('updateQueueList', response.body));
    },
    getQueueStatus({ commit }, payload) {
      return Vue.http.get(`/api/queues/${payload.queue}/`);
    },
    getJobs({ commit }, payload) {
      return Vue.http.get(`/api/queues/${payload.queue}/jobs`, { params: { status: payload.status } })
        .then(response => commit('updateJobList', response.body));
    },
    getJob({ commit }, payload) {
      return Vue.http.get(`/api/queues/${payload.queue}/jobs/${payload.id}`)
        .then(response => commit('updateJobDetail', response.body));
    },
  },
});
