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
        <b-navbar-item :href="app.github" target="_blank" title="Go to GitHub">
          <b-icon icon="github" type="is-info"></b-icon>&nbsp;
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