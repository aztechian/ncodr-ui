// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import Vuetify from 'vuetify';
import GSigninButton from 'vue-google-signin-button';
import 'vuetify/dist/vuetify.css';

import App from './App.vue';
import router from './router';
import store from './store';
import auth from './auth';

Vue.use(VueResource);
Vue.use(GSigninButton);
Vue.use(Vuetify, {
  theme: {
    primary: '#64DD17',
    secondary: '#78909C',
    accent: '#00B0FF',
    error: '#EF5350',
    warning: '#FDD835',
    info: '#2196f3',
    success: '#43A047',
  },
});

auth.checkAuth();

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next();
  }

  if (store.state.config.useAuth && !auth.isAuthenticated) {
    return next('/login');
  }
  return next();
});

// set up AJAX request interceptor
Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', auth.getAuthHeader());
  // continue to next interceptor
  next();
});

Vue.http.interceptors.push((request, next) => {
  next((response) => {
    if (response.status === 401 || response.status === 403) {
      if (auth.isAuthenticated) {
        auth.refresh()
          .then(() => Vue.http[request.method.toLowerCase()](request.url, request.params))
          .catch(() => {
            auth.logout();
            store.commit('setAvatar', '');
            router.push('/login');
          });
      }
      auth.logout();
      store.commit('setAvatar', '');
      router.push('/login');
    }
  });
});

// eslint-disable-next-line no-unused-vars
const vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App,
    router,
  },
  created() {
    if (!store.state.config.useAuth) {
      store.dispatch('getQueues');
    } else if (auth.isAuthenticated) {
      store.dispatch('getQueues');
      store.commit('setAvatar', auth.getAvatar());
    }
  },
  mounted() {
    // registers the service worker -- Vue equivalent to onLoad()
    navigator.serviceWorker.register('/service-worker.js');
  },
  render: h => h(App),
});
