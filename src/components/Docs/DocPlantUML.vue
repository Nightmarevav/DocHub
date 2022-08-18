<template>
  <plantuml v-if="uml" v-bind:uml="uml" />
</template>

<script>

  import Plantuml from '../Schema/PlantUML';
  import docs from '../../helpers/docs';
  import requests from '../../helpers/requests';

  export default {
    name: 'DocPlantUML',
    components: {
      Plantuml
    },
    props: {
      document: { type: String, default: '' }
    },
    data() {
      return {
        uml: ''
      };
    },
    computed: {
      url() {
        const profile = this.manifest.docs ? this.manifest.docs[this.document] : null;
        return profile ?
          docs.urlFromProfile(profile,
                              (this.$store.state.sources.find((item) => item.path === `/docs/${this.document}`) || {}).location
          )
          : '';
      }
    },
    watch: {
      url() { this.refresh(); }
    },
    mounted() {
      this.refresh();
    },
    methods: {
      refresh() {
        if (!this.url) {
          this.uml = '';
          return;
        }
        requests.request(this.url).then((response) => {
          this.uml = response.data.toString();
        })
          // eslint-disable-next-line no-console
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.error(e, `Ошибка запроса (2) [${this.url}]`, e);
          });
      }
    }
  };
</script>

<style>

</style>
