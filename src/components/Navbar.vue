<template>
  <div class="container">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <!-- YT-RCP -->
          <img src="@/assets/img/logo-377x-134.png" alt="Logo">
        </b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item tag="router-link" :to="{ path: '/history' }" title="Winner History">
          <b-icon icon="history"></b-icon>
          <span style="padding-left: 8px; padding-right: 5px; margin: 0px -4px 3px;">&nbsp;History</span>
        </b-navbar-item>
        <b-navbar-item :href="app.github" target="_blank" title="Go to GitHub">
          <b-button type="is-info" icon-left="github" outlined>
            GitHub
          </b-button>
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>

<script>
// App Info
import app from '../appInfo.js'

export default {
  name: "my-navbar",
  data() {
    return {
      app: false
    }
  },
  created() {
    this.app = app
  },
};
</script>