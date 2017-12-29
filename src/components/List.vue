<template>
<v-layout child-flex>
  <v-data-table class="elevation-1" :headers="headers" :pagination.sync="pagination" :items="items">
    <template slot="items" slot-scope="props">
      <tr @click="goToJob(props.item.id)">
        <td class="text-xs-right">{{ props.item.id }}</td>
        <td class="text-xs-right">{{ props.item.progress }}</td>
        <td class="text-xs-right">{{ props.item.finishedOn | dynDate }}</td>
        <td class="text-xs-right">{{ props.item.failedReason }}</td>
        <td class="text-xs-right">{{ props.item.attemptsMade }}</td>
      </tr>
    </template>
  </v-data-table>
</v-layout>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      pagination: {
        sortBy: 'id',
        descending: true,
        rowsPerPage: 25,
      },
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
          sortable: false,
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
  filters: {
    dynDate(ts) {
      if (!ts) return '-';
      const now = moment();
      const timestamp = moment(ts);
      if (now.diff(timestamp, 'day') > 7) {
        return timestamp.format('MMM Do');
      } else if (timestamp.isBefore(now.startOf('day'))) {
        return timestamp.format('ddd h:mm:ss A');
      }
      return timestamp.format('h:mm:ss A');
    },
  },
  created() {
    this.fetchJobList();
  },
  beforeRouteUpdate(to, from, next) {
    const queue = to.params.queue;
    const status = to.params.state;
    this.$store.dispatch('getJobs', { queue, status }).then(() => next());
  },
};
</script>
