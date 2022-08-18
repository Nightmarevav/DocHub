<template>
  <div>
    <v-row align="center" class="source-selector-row">
      <v-col cols="12" class="source-selector-col">
        <catalog-selector v-model="catalogURI" />
      </v-col>
    </v-row>
    <v-row align="center" class="source-selector-row">
      <v-col v-if="sourceType === 'GIT'" cols="12" class="source-selector-col">
        <git-selector v-model="gitURI" v-bind:base-uri="catalogURI" />
      </v-col>
      <v-col v-else-if="sourceType === 'WEB'" cols="12" class="source-selector-col">
        <v-text-field
          v-model="catalogURI"
          readonly
          prepend-icon="mdi-web" />
      </v-col>
      <v-col v-else cols="12" class="source-selector-col">
        <v-text-field
          readonly
          prepend-icon="mdi-help" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import GitHelper from '../helpers/gitlab';
  import GitSelector from './GitSelector';
  import CatalogSelector from './CatalogSelector';

  export default {
    name: 'SourceSelector',
    components: {
      CatalogSelector,
      GitSelector
    },
    props: {
      value: { type: String, default: '' }
    },
    data() {
      return {
        gitURI_: null,
        catalogURI_: null
      };
    },
    computed: {
      sourceType: {
        get() {
          try {
            if (GitHelper.isGitLabURI(this.catalogURI))
              return 'GIT';
            else
              return 'WEB';
          } catch (e) {
            return 'UNKNOWN';
          }
        }
      },

      catalogURI: {
        get() {
          return this.catalogURI_;
        },

        set(value) {
          this.catalogURI_ = value;
          this.$emit('input', value);
        }
      },

      gitURI: {
        get() {
          return this.gitURI_;
        },

        set(value) {
          this.gitURI_ = value;
          this.$emit('input', value);
        }
      }
    },
    created() {
      this.catalogURI = this.value;
    }
  };
</script>

<style>

.source-selector-row {
  padding-top: 0;
  padding-bottom: 0;
}

.source-selector-col {
  padding-top: 0;
  padding-bottom: 0;
}

</style>
