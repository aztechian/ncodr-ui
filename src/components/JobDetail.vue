<template>
<v-slide-x-transition>
  <v-layout child-flex>
    <v-card>
      <v-card-title primary-title>
        <h3 class="display-2 heading">Job #{{details.id}}</h3>
        <h3 class="display-2 heading">
          <i :title="details.state" class="material-icons"
            style="vertical-align: text-top;">{{mapStatusIcon}}</i>
           {{details.state | capitalize}}
        </h3>
      </v-card-title>

      <v-card-text>
        <h3 class="heading">
          Progress: {{progress}} %
          <v-progress-linear v-model="progress"></v-progress-linear>
        </h3>
        <div>
          <v-text-field label="Data" class="job-data" multi-line full-width readonly
            :value="details.data | prettyJSON">
          </v-text-field>
        </div>
        <div>
          <v-text-field label="Attempts" readonly full-width :value="details.attemptsMade">
          </v-text-field>
        </div>
        <div>
          <v-text-field label="Stacktrace" class="job-data" multi-line full-width readonly
            :value="details.stacktrace | prettyJSON">
          </v-text-field>
        </div>
        <div>
          <v-text-field label="Completed At" readonly full-width
            :value="details.finishedOn | longdate">
          </v-text-field>
        </div>
        <div>
          <v-text-field label="Duration" readonly full-width :value="duration"></v-text-field>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn flat>Copy</v-btn>
        <v-btn flat>Retry</v-btn>
        <v-spacer></v-spacer>
        <v-btn flat>Close</v-btn>
        <!-- eslint-disable max-len -->
        <!--
        <button @click="$emit('close')" class="mdc-button mdc-button--compact mdc-card__action">Close</button>
        <button @click="$emit('copy', details)" class="mdc-button mdc-button--compact mdc-card__action">Copy</button>
        <button @click="$emit('retry', details.id)" class="mdc-button mdc-button--compact mdc-card__action">Retry</button> -->
        <!-- </section> -->
        <!-- eslint-enable max-len  -->
      </v-card-actions>
    </v-card>
  </v-layout>
</v-slide-x-transition>
</template>

<script>
import moment from 'moment';

export default {
  data: () => ({
    progress: 0,
    events: null,
  }),
  filters: {
    capitalize(value) {
      if (!value) return '';

      return value.toString().charAt(0).toUpperCase() + value.slice(1);
    },
    prettyJSON(json) {
      const str = JSON.stringify(json, undefined, 2);
      if (str) return str.replace(/\\n/g, '\n');
      return '';
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
      if (!this.details.processedOn) return '-';
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
    const { queue, id } = this.$route.params;
    this.$store.dispatch('getJob', { queue, id })
      .then(() => {
        this.progress = this.$store.state.jobDetail.progress;
      });

    this.events = new EventSource(`/api/queues/${queue}/jobs/${id}/events`);
    this.events.addEventListener('progress', (e) => {
      this.progress = e.data;
    });
    this.events.addEventListener('complete', () => {
      this.events.close();
    });
  },
  beforeRouteLeave(to, from, next) {
    // close the event source if we're navigating away
    if (this.events) {
      this.events.close();
    }
    next();
  },
};
</script>

<style>
  .card__title--primary {
    justify-content: space-between;
  }

  .job-data textarea {
    overflow: auto;
    white-space: pre;
  }
</style>
