<template>
  <box>
    <v-card>
      <v-card-title v-if="(source.dataset || []).length > 10">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск"
          single-line
          hide-details />
      </v-card-title>
      <v-data-table
        v-bind:headers="headers"
        v-bind:items="source.dataset || []"
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
                <d-c-link v-bind:href="field.link">{{ field.value }}</d-c-link>
              </template>
              <template v-else>{{ field.value }}</template>
            </td>
          </tr>  
        </template>
        <template #no-data>
          <v-alert v-bind:value="true" icon="warning">
            Данных нет :(
          </v-alert>
        </template>  
      </v-data-table>
    </v-card>
  </box>
</template>

<script>

  import DCLink from '../Controls/DCLink.vue';
  import DocMixin from './DocMixin';

  export default {
    name: 'DocTable',
    components: { 
      DCLink 
    },
    mixins: [DocMixin],
    props: {
      document: { type: String, default: '' }
    },
    data() {
      return {
        search: ''
      };
    },
    computed: {
      headers() {
        return this.profile.headers || [];
      },
      perPage() {
        return this.profile['per-page'];
      },
      isTemplate() {
        return true;
      }
    },
    methods: {
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

<style scoped>
table {
  max-width: 100%;
}
td {
  white-space: pre-wrap
}
</style>
