<template>
  <v-card class="card-item">
    <v-card-title>
      <v-icon left>settings</v-icon>
      <span class="title">Размещение</span>
    </v-card-title>
    <v-card-text class="headline font-weight-bold">
      <ul class="source-list">
        <li
          v-for="item in locations"
          v-bind:key="item.link"
          class="source-list-item">
          <d-c-link v-bind:href="item.link">{{ item.title }}</d-c-link>
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script>

  import DCLink from '../../Controls/DCLink.vue';

  export default {
    name: 'SrcLocation',
    components: { DCLink },
    props: {
      locations: { type: Array, default: () => ([]) }
    },
    data() {
      return {};
    }
  };
</script>

<style scoped>

  .card-item {
    width: 100%;
    margin-top: 12px;
  }

  .source-list-item {
    font-stretch: normal;
    font-size: 16px;
    font-weight: 300;
  }
</style>
