<template>
<v-layout child-flex>
  <v-data-table hide-actions loading="true" class="elevation-1" v-bind:headers="headers" :items="items">
    <template slot="items" slot-scope="props">
      <tr @click="goToJob(props.item.id)">
        <td class="text-xs-right">{{ props.item.id }}</td>
        <td class="text-xs-right">{{ props.item.progress }}</td>
        <td class="text-xs-right">{{ props.item.finishedOn }}</td>
        <td class="text-xs-right">{{ props.item.failedReason }}</td>
        <td class="text-xs-right">{{ props.item.attemptsMade }}</td>
      </tr>
    </template>
  </v-data-table>
</v-layout>
</template>

<script>
import store from '@/store';

export default {
  data() {
    return {
      headers: [
        {
          text: 'ID',
          value: 'ID',
        },
        {
          text: 'Progress',
          value: 'Progress',
        },
        {
          text: 'Finished At',
          value: 'Finished At',
        },
        {
          text: 'Failure Reason',
          value: 'Failure Reason',
        },
        {
          text: 'Attempts',
          value: 'Attempts',
        },
      ],
    };
  },
  computed: {
    items() {
      return this.$store.state.jobList;
    },
  },
  methods: {
    goToJob(id) {
      const queue = this.$route.params.queue;
      this.$router.push({ name: 'JobDetail', params: { queue, id } });
    },
    fetchJobList() {
      const queue = this.$route.params.queue;
      const status = this.$route.params.state;
      this.$store.dispatch('getJobs', { queue, status });
    },
  },
  created() {
    this.fetchJobList();
  },
  beforeRouteUpdate(to, from, next) {
    const queue = to.params.queue;
    const status = to.params.state;
    store.dispatch('getJobs', { queue, status }).then(() => next());
  },
};
</script>
