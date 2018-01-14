<template>
<v-card>
  <v-card-title class="grey lighten-4 py-4 title">
    Create {{queuename}} Job
  </v-card-title>
  <v-container grid-list-sm class="pa-4">
    <v-layout row wrap>
      <v-flex xs12 align-center justify-space-between>
        <v-layout align-center>
          <v-avatar size="40px" class="mr-3">
            <img src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png" alt="">
          </v-avatar>
          <v-text-field prepend-icon="input" placeholder="Input"></v-text-field>
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <v-text-field prepend-icon="redo" placeholder="Output"></v-text-field>
      </v-flex>
      <v-flex xs6>
        <v-text-field placeholder="Scan"></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field prepend-icon="notes" textarea placeholder="Options"></v-text-field>
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
  props: ['queuename'],
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    close() {
      this.$emit('dialog-close');
    },
    submit() {

    },
  },
};
</script>
