<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import './assets/css/common.css'

  export default {
    name: 'App',
    data() {
    },
    methods: {
    }
  }
</script>

<style>
  body::-webkit-scrollbar {
    width: 10px;
    height: 2px;
    background: #ccc;
    border-radius: 10px; /*外层轨道*/
  }
  body::-webkit-scrollbar-thumb {
    display: block;
    width: 6px;
    margin: 0 auto;
    border-radius: 10px;
    background: #888; /*内层轨道*/
  }
</style>

<style scoped>
</style>
