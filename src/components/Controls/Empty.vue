<template>
  <div 
    style="width: 160px; height: 32px; left: 50%; top: 50%; position: absolute; margin-left: -80px; margin-top: -16px; text-align:center;">
    <template v-if="isLoading">
      Вжуууух...
    </template>
    <template v-else>
      Упс... здесь пусто :(
    </template>
  </div>
</template>

<script>
  export default {
    name: 'Empty',
    data() {
      return {};
    },
    computed: {
      isLoading() {
        return this.$store.state.isReloading;
      }
    }
  };
</script>

<style scoped>


</style>
