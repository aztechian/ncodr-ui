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
    dialog: false,
    snackbar: false,
    snackbarColor: 'green',
    snackbarText: '',
    avatar: '',
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
    setDialog(state, to) {
      state.dialog = to;
    },
    showSnackbar(state, payload) {
      state.snackbarColor = payload.color || state.snackbarColor;
      state.snackbarText = payload.text || state.snackbarText;
      if (Object.prototype.hasOwnProperty.call(payload, 'state')) {
        state.snackbar = payload.state;
      } else {
        state.snackbar = true;
      }
    },
    setAvatar(state, img) {
      state.avatar = img;
    },
  },
  actions: {
    // eslint doesn't like { commit } if it doesn't get used in the action, but vuex appears to
    // require having that parameter (the context)
    /* eslint-disable no-unused-vars */
    getQueues({ commit }) {
      return Vue.http.get('/api/queues').then(response => commit('updateQueueList', response.body));
    },
    getQueueStatus({ commit }, payload) {
      return Vue.http.get(`/api/queues/${payload.queue}/`);
    },
    getJobs({ commit }, payload) {
      return Vue.http.get(`/api/queues/${payload.queue}/jobs/`, { params: { status: payload.status } })
        .then(response => commit('updateJobList', response.body));
    },
    getJob({ commit }, payload) {
      return Vue.http.get(`/api/queues/${payload.queue}/jobs/${payload.id}`)
        .then(response => commit('updateJobDetail', response.body));
    },
    submitJob({ commit }, payload) {
      const url = `/api/queues/${encodeURIComponent(payload.queuename)}/jobs/`;
      return Vue.http.post(url, payload.data, { responseType: 'json' });
    },
    getQueueFiles({ commit }, payload) {
      const url = `/api/queues/${encodeURIComponent(payload.queuename)}/files/`;
      return Vue.http.get(url);
    },
    /* eslint-enable no-unused-vars */
  },
});
