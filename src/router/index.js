import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import JobDetail from '@/components/JobDetail';
import List from '@/components/List';
import Login from '@/components/Login';

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
