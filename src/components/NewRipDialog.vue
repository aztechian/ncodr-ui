<template>
<v-card>
  <v-card-title class="grey lighten-4 py-4 title">
    Create {{queuename}} Job
  </v-card-title>
  <v-container grid-list-sm class="pa-4">
    <v-layout row wrap>
      <v-flex xs12>
        <v-text-field prepend-icon="notes" textarea placeholder="Options" v-model="options"></v-text-field>
      </v-flex>
    </v-layout>
  </v-container>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn flat @click="close">Cancel</v-btn>
    <v-btn flat color="primary" @click="submit">Create</v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
export default {
  name: 'NewRipDialog',
  data() {
    return {
      options: '',
    };
  },
  methods: {
    close() {
      this.$store.commit('setDialog', false);
    },
    submit() {
      return this.$store.dispatch('submitJob', { queuename: this.queuename }).then((response) => {
        this.$store.commit('showSnackbar', { text: `Submitted Job #${response.body.id}`, color: 'success' });
        this.close();
      })
      .catch((err) => {
        const color = 'error';
        let text = '';
        if (!err.body) {
          text = `Error submitting Job: ${err.status}`;
        } else {
          text = `Error: ${err.body.message}`;
        }
        this.$store.commit('showSnackbar', { text, color });
      });
    },
  },
  computed: {
    queuename() {
      return this.$route.params.queue;
    },
  },
};
</script>
