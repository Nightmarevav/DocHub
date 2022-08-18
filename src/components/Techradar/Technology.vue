<template>
  <v-container style="min-width: 100%">
    <h1>{{ technology }}</h1>
    <h3>{{ summary.title }}</h3>
    <div v-if="summary.aliases">Синонимы: {{ summary.aliases.join('; ') }}</div>
    <div v-if="summary.link">Сайт: <a v-bind:href="summary.link" target="_blank">{{ summary.link }}</a></div>
    <div class="summary-block">
      <div v-if="summary.components">Используется в компонентах:</div>
      <ul class="components">
        <li v-for="component in summary.components" v-bind:key="component.id" class="component">
          <router-link
            v-bind:to="`/architect/components/${component.id}`">
            {{ component.title }}
          </router-link>
        </li>
      </ul>
    </div>
    <div class="summary-block">
      <div v-if="summary.components">Встречается в контекстах:</div>
      <ul class="contexts">
        <li v-for="context in summary.contexts" v-bind:key="context.id" class="contexts">
          <router-link
            v-bind:to="`/architect/contexts/${context.id}`">
            {{ context.title }}
          </router-link>
        </li>
      </ul>
    </div>
  </v-container>
</template>

<script>

  import query from '../../manifest/query';
  import jsonata from 'jsonata';

  export default {
    components:{
    },
    props: {
      technology: { type: String, default: '' }
    },
    data() {
      return {
      };
    },
    computed: {
      summary() {
        return (jsonata(query.summaryForTechnology(this.technology))
          .evaluate(this.manifest) || []);
      }
    },
    mounted() {
    },
    methods: {}
  };
</script>

<style scoped>

  .summary-block {
    margin-top: 16px;
  }

</style>
