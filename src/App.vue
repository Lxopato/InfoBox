<template>
  <div id="app">
    <Searcher/>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import Searcher from './components/Searcher.vue'

export default {
  name: 'app',
  components: {
    Searcher,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
