<template>
  <box>
    <asyncapi-component
      v-if="schema"
      v-bind="{ schema, cssImportPath: '/assets/styles/asyncapi.css' }" />
  </box>
</template>

<script>
  import '@asyncapi/web-component/lib/asyncapi-web-component';

  import requests from '@/helpers/requests';
  import mustache from 'mustache';
  import DocMixin from './DocMixin';

  export default {
    mixins: [DocMixin],
    data() {
      return {
        schema: ''
      };
    },
    methods: {
      refresh() {
        this.getSchema();
      },
      async getSchema() {
        const params =  {
          raw: true
        };
        if (this.isTemplate) {
          params.responseHook= (response) => {
            response.data = mustache.render(response.data, this.source.dataset);
            return response;
          };
        }
        requests.request(this.url, undefined, params).then((response) => {
          this.schema = response.data;
        }).catch((e) => this.error = e);
        this.sourceRefresh();
      }
    }
  };
</script>
