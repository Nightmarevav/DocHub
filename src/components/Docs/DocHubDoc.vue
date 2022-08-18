<template>
  <div>
    <empty v-if="isEmpty" />

    <div v-else>
      <async-api-component v-if="docType === DocTypes.ASYNCAPI" v-bind:document="document" />
      <swagger v-if="docType === DocTypes.OPENAPI" v-bind:document="document" />
      <plantuml v-if="docType === DocTypes.PLANTUML" v-bind:document="document" />
      <doc-markdown v-if="docType === DocTypes.MARKDOWN" v-bind:document="document" />
      <doc-table v-if="docType === DocTypes.TABLE" v-bind:document="document" />
    </div>
  </div>
</template>

<script>
  import { DocTypes } from '@/components/Docs/enums/doc-types.enum';
  import Swagger from './DocSwagger.vue';
  import AsyncApiComponent from '@/components/Docs/DocAsyncApi.vue';
  import Plantuml from './DocPlantUML.vue';
  import DocMarkdown from './DocMarkdown.vue';
  import DocTable from './DocTable.vue';
  import Empty from '../Controls/Empty.vue';

  export default {
    name: 'Document',
    components: {
      AsyncApiComponent,
      Plantuml,
      Swagger,
      DocMarkdown,
      DocTable,
      Empty
    },
    props: {
      document: { type: String, default: '' }
    },
    data() {
      return {
        DocTypes
      };
    },
    computed: {
      isEmpty() {
        return !this.docs[this.document];
      },
      docs() {
        return (this.manifest).docs || {};
      },
      docType() {
        return ((this.docs[this.document] || {}).type || 'unknown').toLowerCase();
      }
    },
    mounted() {
    },
    methods: {
    }
  };
</script>
