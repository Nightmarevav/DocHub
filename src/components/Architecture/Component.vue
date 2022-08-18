<template>
  <v-container grid-list-xl fluid>
    <div style="display: none" v-html="focusStyle" />
    <empty v-if="isEmpty" />
    <v-layout v-else wrap>
      <v-flex xs12 md5 d-flex>
        <v-layout wrap>
          <v-container grid-list-xl fluid>
            <v-card class="card-item" xs12 md12>
              <v-card-title>
                <v-icon left>settings</v-icon>
                <span class="title">Сводка</span>
              </v-card-title>

              <v-card-text class="headline font-weight-bold">
                <v-list>
                  <v-list-item v-for="(item) in summary" v-bind:key="item.title" v-bind:link="!!item.link">
                    <v-list-item-content v-on:click="goToLink(item.link)">
                      <v-list-item-subtitle v-text="item.title" />
                      
                      <v-list-item-title>
                        <v-icon v-if="item.required && !item.content" left color="red">error</v-icon>
                        <a v-else-if="item.onclick" v-on:click="item.onclick">{{ item.content }}</a>
                        <span v-else>{{ item.content }}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <docs v-bind:subject="component" />

            <v-card class="card-item" xs12 md12 style="margin-top: 12px">
              <v-card-title>
                <v-icon left>description</v-icon>
                <span class="title">Иерархия</span>
              </v-card-title>
              <v-card-text class="headline font-weight-bold">
                <components-mindmap v-bind:root="component" links="component" />
              </v-card-text>
            </v-card>

            <src-locations v-bind:locations="srcLocations" />
          </v-container>
        </v-layout>
      </v-flex>

      <v-flex xs12 md7 d-flex>
        <tab-contexts 
          v-if="contexts.length"
          style="width: 100%"
          v-bind:contexts="contexts"
          v-bind:manifest="manifest"
          d-flex />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  import query from '@/manifest/query';
  import ComponentsMindmap from '@/components/Mindmap/ComponentsMindmap';
  import TabContexts from './tabs/TabContext.vue';
  import Empty from '../Controls/Empty.vue';
  import SrcLocations from './tabs/SrcLocations.vue';
  import Docs from './tabs/Docs.vue';

  export default {
    name: 'ArchComponent',
    components: {
      Docs,
      ComponentsMindmap,
      TabContexts,
      Empty,
      SrcLocations
    },
    props: {
      component: { type: String, default: '' }
    },
    data() {
      return {
        currentContext: 0
      };
    },
    computed: {
      isEmpty() {
        return !((this.manifest || {}).components || {})[this.component];
      },
      focusStyle() {
        return `
        <style>
          a[href$="${this.component}"] text {
            font-size: 14px;
            fill: #f00;
            font-weight: 600;
            text-decoration-line: underline;
          }
        </style>
      `;
      },
      contexts() {
        return [{
          id: this.component,
          title: 'SELF',
          type: 'component'
        }].concat(query.expression(query.contextsForComponent(this.component))
          .evaluate(this.manifest) || []);
      },
      srcLocations() {
        let result = query.expression(query.locationsForComponent(this.component))
          .evaluate(this.$store.state.sources) || [];

        if (process.env.VUE_APP_DOCHUB_MODE === 'plugin') {
          result = result.map((item) => ({
            title: item.title.slice(19),
            link: `${item.link}?entity=component&id=${this.component}`
          }));
        }

        return result;
      },
      summary() {
        return (query.expression(query.summaryForComponent(this.component))
          .evaluate(this.manifest) || []);
      }
    },
    methods: {
      goToLink() {

      }
    }
  };
</script>

<style scoped>
  .card-item {
    width: 100%;
  }
</style>
