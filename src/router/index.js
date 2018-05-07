import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld.vue';
import JobDetail from '@/components/JobDetail.vue';
import List from '@/components/List.vue';
import Login from '@/components/Login.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/:queue/:state',
      name: 'JobList',
      component: List,
    },
    {
      path: '/:queue/job/:id',
      name: 'JobDetail',
      component: JobDetail,
    },
  ],
});
