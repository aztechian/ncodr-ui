<template>
<v-slide-x-transition>
  <v-layout child-flex>
    <v-card>
      <v-card-title primary-title>
        <h1>Job #{{details.id}}</h1>
        <h1>
          <i :title="details.state" class="material-icons" style="vertical-align: text-top;">{{mapStatusIcon}}</i>
           {{details.state | capitalize}}
        </h1>
      </v-card-title>
      <!-- <section class="mdc-card__supporting-text"> -->
      <v-card-text>
        <h3>
          Progress: {{details.progress}} %
          <v-progress-linear v-model="details.progress"></v-progress-linear>
          <hr v-if="details.progress <= 0"></hr>
        </h3>

        <div>
          <h3>Data: </h3>
          <pre class="job-data">{{details.data | prettyJSON}}</pre>
        </div>
        <div>
          <h3>Attempts: </h3>
          <p>{{details.attemptsMade}}</p>
        </div>
        <div>
          <h3>Stacktrace: </h3>
          <pre v-if="details.stacktrace.length > 0" style="height: 150px;" class="job-data">{{details.stacktrace[0]}}</pre>
          <p v-else></p>
        </div>
        <div>
          <h3>Completed at: </h3>
          <p>{{details.finishedOn | longdate}}</p>
        </div>
        <div>
          <h3>Duration: </h3>
          <p>{{duration}}</p>
        </div>
      </v-card-text>
      <!-- </section> -->
      <!-- <section class="mdc-card__actions"> -->
      <v-card-actions>
        <v-btn flat>Copy</v-btn>
        <v-btn flat>Retry</v-btn>
        <v-spacer></v-spacer>
        <v-btn flat>Close</v-btn>
        <!-- <button @click="$emit('close')" class="mdc-button mdc-button--compact mdc-card__action">Close</button>
      <button @click="$emit('copy', details)" class="mdc-button mdc-button--compact mdc-card__action">Copy</button>
      <button @click="$emit('retry', details.id)" class="mdc-button mdc-button--compact mdc-card__action">Retry</button> -->
        <!-- </section> -->
      </v-card-actions>


    </v-card>
  </v-layout>
</v-slide-x-transition>
</template>

<script>
import moment from 'moment';

export default {
  filters: {
    capitalize(value) {
      if (!value) return '';

      return value.toString().charAt(0).toUpperCase() + value.slice(1);
    },
    prettyJSON(json) {
      return JSON.stringify(json, undefined, 2);
    },
    longdate(ts) {
      if (!ts) return '-';
      return moment(ts).format('llll');
    },
  },
  computed: {
    details() {
      return this.$store.state.jobDetail;
    },
    duration() {
      let number;
      if (this.details.finishedOn) {
        // this job has finished
        number = this.details.finishedOn - this.details.processedOn;
      } else {
        number = Date.now() - this.details.processedOn;
      }
      const d = moment.duration(number, 'milliseconds');
      if (number < 60 * 1000) return `${d.asSeconds().toFixed(0)} seconds`;
      if (number <= 3600 * 1000) return `${d.asMinutes().toFixed(0)} minutes`;
      return `${d.asHours().toFixed(0)} hours`;
    },
    mapStatusIcon() {
      // completed, failed, delayed, active, waiting, paused, stuck
      switch (this.details.state) {
        case 'completed':
          return 'done';
        case 'failed':
          return 'error';
        case 'delayed':
          return 'hourglass_empty';
        case 'active':
          return 'play_circle_outline';
        case 'waiting':
          return 'watch_later';
        case 'paused':
          return 'pause_circle_outline';
        case 'stuck':
          return 'help_outline';
        default:
          return 'warning';
      }
    },
  },
  created() {
    const queue = this.$route.params.queue;
    const id = this.$route.params.id;
    this.$store.dispatch('getJob', { queue, id });
  },
};
</script>

<style>
  .card__title--primary {
    justify-content: space-between;
  }

  pre.job-data {
    overflow: auto;
    background-color: lightgrey;
    border: 1px solid darkgrey;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 8px;
    margin: 10px;
    padding: 8px;
  }

  .card__text h3,p {
    display: inline;
  }
</style>
