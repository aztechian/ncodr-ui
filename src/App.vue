<template>
<v-app id="ncodr">
  <v-navigation-drawer fixed clipped app v-model="drawer">
    <v-list dense>
      <template v-for="(item, i) in items">
          <v-layout row v-if="item.heading" align-center :key="i">
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group v-else-if="item.children" v-model="item.model" no-action>
            <v-list-tile slot="item" @click="">
              <v-list-tile-action>
                <v-icon>{{ item.model ? item.icon : item['icon-alt'] }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(child, i) in item.children" :key="i" :to="{ name: 'JobList', params: { queue: item.text, state: child.text } }">
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
          <v-list-tile v-else @click="">
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
  <v-toolbar color="blue darken-3" dark app clipped-left fixed>
    <v-toolbar-title to="/" :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'" class="ml-0 pl-3">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <a href="/">
        <span class="hidden-xs-only">Ncodr</span>
        <span class="material-icons icon">local_movies</span>
      </a>
    </v-toolbar-title>
    <div class="d-flex align-center" style="margin-left: auto">
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img src="/static/ncodr.png" alt="Ncodr">
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
  <v-btn fab bottom right color="pink" dark fixed @click.stop="dialog = !dialog">
    <v-icon>add</v-icon>
  </v-btn>

  <v-dialog v-model="dialog" width="800px">
    <v-card>
      <v-card-title class="grey lighten-4 py-4 title">
        Create contact
      </v-card-title>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex xs12 align-center justify-space-between>
            <v-layout align-center>
              <v-avatar size="40px" class="mr-3">
                <img src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png" alt="">
              </v-avatar>
              <v-text-field placeholder="Name"></v-text-field>
            </v-layout>
          </v-flex>
          <v-flex xs6>
            <v-text-field prepend-icon="business" placeholder="Company"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field placeholder="Job title"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field prepend-icon="mail" placeholder="Email"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field type="tel" prepend-icon="phone" placeholder="(000) 000 - 0000" mask="phone"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field prepend-icon="notes" placeholder="Notes"></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-btn flat color="primary">More</v-btn>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
        <v-btn flat @click="dialog = false">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</v-app>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    drawer: null,
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
  },
  filters: {
    capitalize(s) {
      return s.toString().charAt(0).toUpperCase() + s.slice(1);
    },
  },
  props: {
    source: String,
  },
};
</script>

<style>
  .container.fill-height {
    padding-bottom: 77px;
  }

  .application .toolbar__title a {
    text-decoration: none;
    color: white;
  }
</style>
