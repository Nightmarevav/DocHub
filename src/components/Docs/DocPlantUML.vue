<template>
  <plantuml v-if="uml" v-bind:uml="uml" />
</template>

<script>

  import Plantuml from '../Schema/PlantUML';
  import requests from '../../helpers/requests';
  import DocMixin from './DocMixin';
  import mustache from 'mustache';

  export default {
    name: 'DocPlantUML',
    components: {
      Plantuml
    },
    mixins: [DocMixin],
    data() {
      return {
        uml: ''
      };
    },
    methods: {
      refresh() {
        if (!this.url) {
          this.uml = '';
          return;
        }
        requests.request(this.url).then((response) => {
          const content = response.data.toString();
          if (this.isTemplate) {
            this.uml = mustache.render(content, this.source.dataset);
          } else this.uml = content;
        }).catch((e) => {
          // eslint-disable-next-line no-console
          console.error(`Ошибка запроса [${this.url}]`, e);
        });
        this.sourceRefresh();
      }
    }
  };
</script>

<style>

</style>
