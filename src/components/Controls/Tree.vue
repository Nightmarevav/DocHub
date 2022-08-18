<template>
  <tree-item v-bind:items="items" />
</template>

<script>

  import TreeItem from './TreeItem';

  export default {
    name: 'Tree',
    components: {
      TreeItem
    },
    props: {
      items: { type: Array, default: () => ([]) }
    },
    data() {
      return {
      };
    },
    computed: {
    },
    methods: {
    }
  };
</script>

<style>

</style>
