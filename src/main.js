// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import Vuetify from 'vuetify';
import GSigninButton from 'vue-google-signin-button';
import 'vuetify/dist/vuetify.css';

import App from './App';
import router from './router';
import store from './store';
import auth from './auth';

import NewRipDialog from './components/NewRipDialog';

Vue.use(VueResource);
Vue.use(GSigninButton);
Vue.use(Vuetify, {
  theme: {
    primary: '#ee44aa',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App,
    router,
    NewRipDialog,
  },
  created() {
    if (!store.state.config.useAuth) {
      store.dispatch('getQueues');
    } else if (auth.isAuthenticated) {
      store.dispatch('getQueues');
    }
  },
});
