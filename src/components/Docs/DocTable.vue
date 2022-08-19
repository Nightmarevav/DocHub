<template>
  <v-card>
    <template v-if="!error">
      <v-card-title v-if="(dataset || []).length > 10">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск"
          single-line
          hide-details />
      </v-card-title>
      <v-data-table
        v-bind:headers="headers"
        v-bind:items="dataset || []"
        v-bind:search="search"
        v-bind:items-per-page="15"
        v-bind:multi-sort="true"
        class="elevation-1">
        <template #item="{ item }">
          <tr>
            <td 
              v-for="(field, index) in rowFields(item)" 
              v-bind:key="index"
              v-bind:align="field.align">
              <template v-if="field.link">
                <d-c-link v-bind:href="field.link">
                  {{ field.value }}
                </d-c-link>
              </template>
              <template v-else>
                {{ field.value }}
              </template>
            </td>
          </tr>  
        </template>
        <template #no-data>
          <v-alert v-bind:value="true" color="error" icon="warning">
            Данных нет :(
          </v-alert>
        </template>  
      </v-data-table>
    </template>
    <template v-else>
      <v-alert v-bind:value="true" color="error" icon="warning">
        Возникла ошибка при генерации таблицы [{{ document }}]
        <br>[{{ error }}]
      </v-alert>
    </template>
  </v-card>
</template>

<script>

  import datasets from '../../helpers/datasets';
  import DCLink from '../Controls/DCLink.vue';

  export default {
    name: 'DocTable',
    components: { 
      DCLink 
    },
    props: {
      document: { type: String, default: '' }
    },
    data() {
      const provider = datasets();
      provider.dsResolver = (id) => {
        return {
          subject: Object.assign({$id: id}, (this.manifest.datasets || {})[id]),
          baseURI: (this.$store.state.sources.find((item) => item.path === `/datasets/${id}`) || {}).location
        };
      };
      return {
        provider,
        error: null,
        dataset: null,
        search: ''
      };
    },
    computed: {
      docParams() {
        return (this.manifest.docs || {})[this.document] || {};
      },
      headers() {
        return this.docParams.headers || [];
      },
      perPage() {
        return this.docParams['per-page'];
      }
    },
    watch: {
      document() { this.refresh(); }
    },
    mounted(){
      this.refresh();
    },
    methods: {
      refresh() {
        this.provider.getData(this.manifest, this.docParams)
          .then((dataset) => {
            this.dataset = dataset;
          })
          .catch((e) => this.error = e);
      },
      rowFields(row) {
        const result = this.headers.map((column) => {
          return {
            value: (row[column.value] || '').toString().replace('\\n','\n'),
            link: column.link ? row[column.link] : undefined,
            align: column.align || 'left'
          };
        });
        return result;
      }
    }
  };
</script>

<style>

</style>
