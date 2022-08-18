<template>
  <div>
    <asyncapi-component
      v-if="schema"
      v-bind="{ schema, cssImportPath: '/assets/styles/asyncapi.css' }" />
  </div>
</template>

<script>
  import '@asyncapi/web-component/lib/asyncapi-web-component';

  import YAML from 'yaml';
  import docs from '@/helpers/docs';
  import requests from '@/helpers/requests';

  export default {
    props: {
      document: { type: String, default: '' }
    },
    data() {
      return {
        schema: ''
      };
    },
    computed: {
      url() {
        const profile = this.manifest.docs?.[this.document] || null;

        return profile ? docs.urlFromProfile(
          profile, 
          this.$store.state.sources.find((item) => item.path === `/docs/${this.document}`)?.location
        ) : null;
      }
    },
    created() {
      this.onComponentCreated();
    },
    methods: {
      onComponentCreated() {
        this.getSchema();
      },
      async getSchema() {
        try {
          const { data } = await requests.request(this.url);
          
          this.schema = YAML.stringify(data);
        } catch (e) {
          //
        }
      }
    }
  };
</script>
