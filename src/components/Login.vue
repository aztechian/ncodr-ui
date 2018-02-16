<template>
<v-layout>
  <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-card-title primary-title>
        <p v-if="useAuth" class="headline mb-0 text-xs-center" style="width: 100%;">Sign In with Google</p>
        <p v-else="useAuth" class="headline mb-0 text-xs-center" style="width: 100%;">No Login Required</p>
      </v-card-title>
      <v-card-text>
        <div v-show="useAuth" class="text-xs-center">
          <g-signin-button :params="googleSignInParams" @success="onSignInSuccess" @error="onSignInError">
            Sign in with Google
          </g-signin-button>
        </div>
      </v-card-text>
    </v-card>
  </v-flex>
</v-layout>
</template>

<script>
import auth from '../auth';

export default {
  data() {
    const config = this.$store.state.config;
    if (config.clientId) {
      return {
        googleSignInParams: {
          client_id: config.clientId,
        },
      };
    }
    return {
      googleSignInParams: {},
    };
  },
  methods: {
    onSignInSuccess(googleUser) {
      // `googleUser` is the GoogleUser object that represents the just-signed-in user.
      // See https://developers.google.com/identity/sign-in/web/reference#users
      // const profile = googleUser.getBasicProfile();
      const jwt = googleUser.getAuthResponse().id_token;
      auth.googleUser = googleUser;
      auth.login(jwt);
      this.$store.commit('setAvatar', auth.getAvatar());
      this.$store.dispatch('getQueues');
      this.$router.push('/');
    },
    onSignInError(error) {
      // `error` contains any error occurred.
      // eslint-disable-next-line no-console
      console.log('OH NOES', error);
    },
  },
  computed: {
    useAuth() {
      return this.$store.state.config.useAuth;
    },
  },
};
</script>

<style>
.g-signin-button {
  cursor: pointer;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
}
</style>
