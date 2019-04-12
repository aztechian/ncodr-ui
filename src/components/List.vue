<template>
  <v-layout child-flex>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :pagination.sync="pagination"
      :items="items"
    >
      <template slot="items" slot-scope="props">
        <tr @click="goToJob(props.item.id)">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.progress }}%</td>
          <td>{{ props.item.finishedOn | dynDate }}</td>
          <td class="hidden-md-and-down">{{ props.item.failedReason }}</td>
          <td class="hidden-md-and-down">{{ props.item.attemptsMade }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      pagination: {
        sortBy: "id",
        descending: true,
        rowsPerPage: 25
      },
      headers: [
        {
          text: "ID",
          value: "ID"
        },
        {
          text: "Progress",
          value: "Progress"
        },
        {
          text: "Finished At",
          value: "Finished At"
        },
        {
          text: "Failure Reason",
          value: "Failure Reason",
          sortable: false,
          class: "hidden-md-and-down"
        },
        {
          text: "Attempts",
          value: "Attempts",
          class: "hidden-md-and-down"
        }
      ]
    };
  },
  computed: {
    items() {
      return this.$store.state.jobList;
    }
  },
  methods: {
    goToJob(id) {
      const { queue } = this.$route.params;
      this.$router.push({ name: "JobDetail", params: { queue, id } });
    },
    fetchJobList() {
      const { queue, state: status } = this.$route.params;
      this.$store.dispatch("getJobs", { queue, status });
    }
  },
  filters: {
    dynDate(ts) {
      if (!ts) return "-";
      const now = moment();
      const timestamp = moment(ts);
      if (now.diff(timestamp, "day") > 7) {
        return timestamp.format("MMM Do");
      }
      if (timestamp.isBefore(now.startOf("day"))) {
        return timestamp.format("ddd h:mm:ss A");
      }
      return timestamp.format("h:mm:ss A");
    }
  },
  created() {
    this.fetchJobList();
  },
  beforeRouteUpdate(to, from, next) {
    const { queue, state: status } = to.params;
    this.$store.dispatch("getJobs", { queue, status }).then(() => next());
  }
};
</script>
