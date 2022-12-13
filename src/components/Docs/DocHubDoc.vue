<template>
  <div>
    <empty v-if="isEmpty" />
    <div v-else>
      <template v-if="isCorrectType">
        <async-api-component 
          v-if="docType === DocTypes.ASYNCAPI" 
          v-bind:document="document" 
          v-bind:params="params" 
          v-bind:profile-resolver="profileResolver" 
          v-bind:url-resolver="urlResolver" />
        <swagger 
          v-if="docType === DocTypes.OPENAPI"
          v-bind:document="document"
          v-bind:params="params" 
          v-bind:profile-resolver="profileResolver" 
          v-bind:url-resolver="urlResolver" />
        <plantuml
          v-if="docType === DocTypes.PLANTUML"
          v-bind:document="document"
          v-bind:params="params" 
          v-bind:profile-resolver="profileResolver" 
          v-bind:url-resolver="urlResolver" />
        <doc-markdown 
          v-if="docType === DocTypes.MARKDOWN"
          v-bind:document="document" 
          v-bind:params="params" 
          v-bind:profile-resolver="profileResolver" 
          v-bind:url-resolver="urlResolver" 
          v-bind:toc-show="!inline" />
        <doc-table
          v-if="docType === DocTypes.TABLE"
          v-bind:document="document" 
          v-bind:params="params" 
          v-bind:profile-resolver="profileResolver" 
          v-bind:url-resolver="urlResolver" />
        <doc-mermaid
          v-if="docType === DocTypes.MERMAID"
          v-bind:document="document" 
          v-bind:params="params" 
          v-bind:profile-resolver="profileResolver" 
          v-bind:url-resolver="urlResolver" />
        <doc-network
          v-if="docType === DocTypes.NETWORK"
          v-bind:document="document" 
          v-bind:params="params" 
          v-bind:profile-resolver="profileResolver" 
          v-bind:url-resolver="urlResolver" />
      </template>
      <v-alert v-else icon="warning">
        Неизвестный тип документа [{{ docType }}]
      </v-alert>      
    </div>
  </div>
</template>

<script>
  import docs from '@/helpers/docs';
  import { DocTypes } from '@/components/Docs/enums/doc-types.enum';
  import Swagger from './DocSwagger.vue';
  import AsyncApiComponent from '@/components/Docs/DocAsyncApi.vue';
  import Plantuml from './DocPlantUML.vue';
  import DocMarkdown from './DocMarkdown.vue';
  import DocTable from './DocTable.vue';
  import DocMermaid from './DocMermaid.vue';
  import DocNetwork from './DocNetwork.vue';
  import Empty from '../Controls/Empty.vue';

  export default {
    name: 'Document',
    components: {
      AsyncApiComponent,
      Plantuml,
      Swagger,
      DocMarkdown,
      DocTable,
      Empty,
      DocMermaid,
      DocNetwork
    },
    props: {
      document: { type: String, default: '' },
      inline: { type: Boolean, default: false },
      // Формирование профиля документа
      profileResolver: { 
        type: Function,
        default: function() {
          return this.manifest?.docs?.[this.document] || {};
        }
      },
      // Определение размещения объекта
      urlResolver: { 
        type: Function,
        default: function() {
          let result = this.profile ?
            docs.urlFromProfile(this.profile,
                                (this.$store.state.sources.find((item) => item.path === `/docs/${this.document}`) || {}).location
            ): '';
          result += result.indexOf('?') > 0 ? '&' : '?';
          result += `id=${this.document}`;
          return result;
        }
      },
      // Параметры передающиеся в запросы документа
      params: { 
        type: Object, 
        default() {
          return this.$router.query;
        }
      }
    },
    data() {
      return {
        DocTypes
      };
    },
    computed: {
      profile() {
        return this.profileResolver();
      },
      isEmpty() {
        return !this.profile;
      },
      isCorrectType() {
        for(const key in DocTypes) {
          if (DocTypes[key] === this.docType) return true;
        }
        return false;
      },
      docType() {
        return (this.profile.type || 'unknown').toLowerCase();
      }
    },
    mounted() {
    },
    methods: {
    }
  };
</script>
