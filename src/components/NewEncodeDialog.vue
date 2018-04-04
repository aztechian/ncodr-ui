<template>
<v-card>
  <v-card-title class="grey lighten-4 py-4 title">
    Create {{queuename}} Job
  </v-card-title>
  <v-form v-model="valid" ref="form">
    <v-container grid-list-sm class="pa-4">
      <v-layout row wrap>
        <v-flex xs12>
          <v-select prepend-icon="group_work" label="Type" placeholder="handbrake" v-model="type" :items="types" :rules="typevalidation" required></v-select>
        </v-flex>
        <v-flex xs6 align-center justify-space-between>
          <v-select prepend-icon="input" label="Input" autocomplete cache-items :items="inputFiles" :search-input.sync="search" :loading="inputLoading" v-model="input" :rules="inputvalidation" required></v-select>
        </v-flex>
        <v-flex xs6 justify-space-between>
          <v-text-field prepend-icon="redo" label="Output" v-model="output"></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-switch label="Scan" v-model="scan"></v-switch>
        </v-flex>
        <v-flex xs12>
          <v-text-field prepend-icon="notes" textarea label="Options" v-model="options" :rules="optionsValidation"></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn flat @click="close">Cancel</v-btn>
    <v-btn flat color="primary" @click="submit" :disabled="!valid">Create</v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
export default {
  name: 'NewRipDialog',
  data() {
    return {
      types: [
        'handbrake',
        'avconv',
      ],
      type: '',
      input: '',
      output: '',
      scan: false,
      options: '',
      valid: false,
      inputLoading: false,
      typevalidation: [
        v => !!v || 'Type is required',
      ],
      inputvalidation: [
        v => !!v || 'Input is required',
      ],
      optionsValidation: [
        v => !!JSON.parse(v) || 'Not valid JSON',
      ],
      inputFiles: [],
      search: null,
    };
  },
  watch: {
    search(val) {
      if (val) this.getFiles(val);
    },
  },
  methods: {
    close() {
      this.$store.commit('setDialog', false);
    },
    getFiles(val) {
      const queuename = this.queuename;
      this.inputLoading = true;
      return this.$store.dispatch('getQueueFiles', { queuename, val })
        .then((response) => {
          this.inputFiles = response.body;
          this.inputLoading = false;
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        const jobdata = {
          type: this.$data.type,
          input: this.$data.input,
        };

        if (this.$data.output) jobdata.output = this.$data.output;
        if (this.$data.options) jobdata.options = JSON.parse(this.$data.options);
        if (this.$data.scan) jobdata.scan = this.$data.scan;

        return this.$store.dispatch('submitJob', {
          queuename: this.queuename,
          data: jobdata,
        }).then((response) => {
          this.$store.commit('showSnackbar', {
            text: `Submitted Job #${response.body.id}`,
            color: 'success',
          });
          this.clear();
          this.close();
        }).catch((err) => {
          const color = 'error';
          let text = '';
          if (!err.body) {
            text = `Error submitting Job: ${err.status}`;
          } else {
            text = `Error: ${err.body.message}`;
          }
          this.$store.commit('showSnackbar', {
            text,
            color,
          });
        }).then(() => this.$store.dispatch('getJobs', {
          queue: this.queuename,
          status: this.$route.params.state,
        }));
      }
      return '';
    },
    clear() {
      this.$refs.form.reset();
    },
  },
  computed: {
    queuename() {
      return this.$route.params.queue;
    },
  },
  created() {
    this.getFiles();
  },
};
</script>
