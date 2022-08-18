<template>
  <div>
    <empty v-if="isEmpty" />
    <template v-else-if="error">
      <v-alert v-bind:value="true" color="error" icon="warning">
        Возникла ошибка при генерации контекста [{{ context }}]
        <br>[{{ error }}]
      </v-alert>
    </template>
    <template v-else>
      <plantuml 
        v-if="isCustomUML && customUML" 
        v-bind:uml="customUML" />
      <schema 
        v-else
        v-bind:schema="schema" />
    </template>
  </div>
</template>

<script>
  import Schema from '../Schema/Schema';
  import query from '../../manifest/query';
  import Plantuml from '../Schema/PlantUML';
  import requests from '../../helpers/requests';
  import Empty from '../Controls/Empty.vue';
  import datasets from '../../helpers/datasets';

  export default {
    name: 'Context',
    components: {
      Schema,
      Plantuml,
      Empty
    },
    props: {
      context: { type: String, default: '' }
    },
    data() {
      const provider = datasets();
      provider.dsResolver = (id) => {
        return {
          subject: (this.manifest.contexts || {})[id],
          baseURI: (this.$store.state.sources.find((item) => item.path === `/contexts/${id}`) || {}).location
        };
      };

      return {
        provider,
        error: null,
        dataset: null,
        refresher: null,
        customUML: null
      };
    },
    computed: {
      isEmpty() {
        return !(this.manifest.contexts || {})[this.context];
      },
      contextParams() {
        return Object.assign({'source': '($)'}, (this.manifest.contexts || {})[this.context] || {}) ;
      },
      basePath() {
        return (this.$store.state.sources.find((item) => item.path === `/contexts/${this.context}`) || {}).location;
      },
      schema() {
        this.$nextTick(this.reloadCustomUML);
        const result = query.expression(query.context(this.context, this.location)).evaluate(this.dataset) || {};
        return result;
      },
      isCustomUML() {
        return typeof this.schema.uml === 'string';
      }
    },
    watch: {
      context() { 
        this.refresh(); 
      },
      manifest() { 
        this.refresh(); 
      }
    },
    mounted(){
      this.refresh();
    },
    methods : {
      reloadCustomUML() {
        if (!this.isCustomUML) return;
        const basePath = (this.$store.state.sources.find((item) => item.path === `/contexts/${this.context}`) || {}).location;
        requests.request(this.schema.uml, basePath)
          .then((response) => {
            this.customUML = response.data;
          }).catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err);
          });
      },
      refresh() {
        this.refresher && clearTimeout(this.refresher);
        this.dataset = null;
        this.refresher = setTimeout(() => {
          this.provider.getData(this.manifest, this.contextParams)
            .then((dataset) => {
              this.dataset = dataset;
            })
            .catch((e) => this.error = e)
            .finally(() => this.refresher = null);
        }, 50);
      }
    }
  };
</script>

<style scoped>

</style>
