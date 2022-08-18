<template>
  <v-container grid-list-xl fluid>
    <v-layout wrap>
      <v-flex xs12 md5 d-flex>
        <validators v-bind:subject="subject" />
      </v-flex>
      <v-flex xs12 md7 d-flex>
        <problem-blank v-if="subject" v-bind:subject="subject" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  import Validators from './tabs/Validators.vue';
  import ProblemBlank from './tabs/ProblemBlank.vue';

  export default {
    name: 'Problems',
    components: {
      Validators,
      ProblemBlank
    },
    props: {
      subject: { type: String, default: '' }
    },
    data() {
      return {
      };
    },
    methods: {
      onGoto(route) {
        window.$PAPI.goto(route);
      }
    }
  };
</script>

<style scoped>
</style>
