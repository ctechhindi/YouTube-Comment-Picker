<template>
  <div id="app">
    <my-navbar></my-navbar>
    <router-view></router-view>
    <!-- set progressbar -->
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'app',
  components: {
    'my-navbar': Navbar
  }
}
</script>