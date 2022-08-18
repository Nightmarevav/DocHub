<template>
  <div 
    style="width: 300px; height: 200px; left: 50%; top: 50%; position: absolute; margin-left: -150px; margin-top: -100px; text-align:center;">
    Не найден корневой манифест архитектуры.
    <br><br>
    <v-btn depressed color="primary" v-on:click="initEmptyProject">Создать пустой файл</v-btn>
    <br><br>
    <v-btn depressed color="primary" v-on:click="initExampleProject">Создать пример</v-btn>
  </div>
</template>

<script>

  export default {
    name: 'Empty',
    data() {
      return {};
    },
    methods: {
      initEmptyProject() {
        window.$PAPI.initProject();
      },
      initExampleProject() {
        window.$PAPI.initProject('example');
      }
    }
  };
</script>

<style scoped>


</style>
