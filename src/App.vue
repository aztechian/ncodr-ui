<template>
<v-app id="ncodr">
  <v-navigation-drawer fixed :clipped="$vuetify.breakpoint.mdAndUp" app v-model="drawer">
    <v-list dense>
      <template v-for="item in items">
          <v-layout row v-if="item.heading" align-center :key="item.heading">
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group v-else-if="item.children" v-model="item.model" :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']" append-icon="">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(child, i) in item.children" :key="i" :to="{ name: 'JobList',
              params: { queue: item.text, state: child.text } }">
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text | capitalize }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :key="item.text">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar app color="primary" clipped-left fixed>
    <v-toolbar-title to="/"
      :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'"
      class="ml-0 pl-3">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" aria-label="Toggle Side Drawer">
      </v-toolbar-side-icon>
      <a href="/">
        <span class="hidden-xs-only">Ncodr</span>
        <span class="material-icons icon">local_movies</span>
      </a>
    </v-toolbar-title>
    <div class="d-flex align-center" style="margin-left: auto">
      <v-btn icon aria-label="Notifications">
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-btn icon large @click.stop="logout" aria-label="User Avatar">
        <v-avatar size="32px">
          <img v-if="avatar" :src="avatar" alt="user">
          <img v-else src="./assets/logo.png" alt="Ncodr">
        </v-avatar>
      </v-btn>
    </div>
  </v-toolbar>
  <v-content>
    <v-container fluid fill-height>
      <v-layout justify-center align-center>
        <router-view></router-view>
      </v-layout>
    </v-container>
  </v-content>
  <v-btn color="secondary" fab bottom right fixed aria-label="Create New Job"
    @click.stop="showNewDialog">
    <v-icon>add</v-icon>
  </v-btn>

  <v-dialog v-model="dialog" width="800px">
    <component :is="dialogContent"></component>
  </v-dialog>

  <v-snackbar :timeout="snackbarTimeout" :color="snackbarColor" v-model="snackbar">
    {{ snackbarText }}
    <v-btn dark flat @click.native="closeSnackbar">Close</v-btn>
  </v-snackbar>
</v-app>
</template>

<script>
import { mapState } from 'vuex';
import auth from './auth';
import NewRipDialog from './components/NewRipDialog.vue';
import NewEncodeDialog from './components/NewEncodeDialog.vue';

export default {
  data: () => ({
    drawer: null,
    snackbarTimeout: 6000,
    dialogContent: 'NewRipDialog',
    navbarStaticItems: [
      {
        icon: 'chat_bubble',
        text: 'Send feedback',
      },
      {
        icon: 'help',
        text: 'Help',
      },
    ],
    queueStates: [
      'active',
      'completed',
      'waiting',
      'delayed',
      'failed',
    ],
  }),
  components: {
    NewRipDialog,
    NewEncodeDialog,
  },
  methods: {
    showNewDialog() {
      const q = this.$route.params.queue;
      // console.log(`showing dialog for ${q}`);
      switch (q) {
        case 'disc ripping':
          this.$data.dialogContent = 'NewRipDialog';
          break;
        case 'video encoding':
          this.$data.dialogContent = 'NewEncodeDialog';
          break;
        default:
          this.$data.dialogContent = '';
          break;
      }

      if (this.$data.dialogContent !== '') this.$store.commit('setDialog', true);
    },
    closeSnackbar() {
      this.$store.commit('showSnackbar', { state: false });
    },
    logout() {
      auth.logout();
    },
  },
  computed: {
    items() {
      const queueItems = this.$store.state.queueList.map(text => ({
        text,
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        model: false,
        children: this.$data.queueStates.map(s => ({ text: s })),
      }));
      return queueItems.concat(this.$data.navbarStaticItems);
    },
    avatar() {
      return this.$store.state.avatar;
    },
    snackbar: {
      get() {
        return this.$store.state.snackbar;
      },
      set(value) {
        this.$store.commit('showSnackbar', { state: value });
      },
    },
    ...mapState(['dialog', 'snackbarColor', 'snackbarText']),
  },
  filters: {
    capitalize(s) {
      return s.toString().charAt(0).toUpperCase() + s.slice(1);
    },
  },
};
</script>

<style>
  .container.fill-height {
    padding-bottom: 77px;
  }

  .application .toolbar__title a {
    text-decoration: none;
    color: black;
  }
</style>
