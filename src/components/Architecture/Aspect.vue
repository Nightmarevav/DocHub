<template>
  <v-container grid-list-xl fluid>
    <empty v-if="isEmpty" />
    <v-layout v-else wrap>
      <v-flex xs12 md5 d-flex>
        <v-layout wrap>
          <v-container grid-list-xl fluid>
            <v-card>
              <v-card-title>
                <v-icon left>settings</v-icon>
                <span class="title">Сводка</span>
              </v-card-title>
              <v-card-text class="headline font-weight-bold">
                <v-list>
                  <v-list-item v-for="(item) in summary" v-bind:key="item.title" v-bind:link="!!item.link">
                    <v-list-item-content v-on:click="goToLink(item.link)">
                      <v-list-item-subtitle v-text="item.title" />
                      <v-list-item-title v-html="item.content" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
            <docs v-bind:subject="aspect" />
            <v-card v-if="components.length" class="card-item" xs12 md12>
              <v-card-title>
                <v-icon left>settings</v-icon>
                <span class="title">Встречается в компонентах</span>
              </v-card-title>
              <v-card-text class="headline font-weight-bold">
                <ul style="font-size: 16px">
                  <li v-for="(component) in components" v-bind:key="component.id">
                    <router-link v-bind:to="`/architect/components/${component.id}`">
                      {{ component.title.replace(/\n/g, ' ') }}
                    </router-link>
                  </li>
                </ul>
              </v-card-text>
            </v-card>
            <v-card class="card-item" xs12 md12>
              <v-card-title>
                <v-icon left>description</v-icon>
                <span class="title">Иерархия</span>
              </v-card-title>
              <v-card-text class="headline font-weight-bold">
                <aspects-mindmap v-bind:root="aspect" style="width: 100%" />
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
          d-flex />  
      </v-flex>
    </v-layout>
    <div style="display: none" v-html="focusStyle" />
  </v-container>
</template>

<script>

  import query from '../../manifest/query';
  import Docs from './tabs/Docs.vue';
  import AspectsMindmap from '@/components/Mindmap/AspectsMindmap';
  import TabContexts from './tabs/TabContext.vue';
  import Empty from '../Controls/Empty.vue';
  import SrcLocations from './tabs/SrcLocations.vue';

  export default {
    name: 'Aspect',
    components: {
      Docs,
      AspectsMindmap,
      TabContexts,
      Empty,
      SrcLocations
    },
    props: {
      aspect: { type: String, default: '' }
    },
    data() {
      return {};
    },
    computed: {
      isEmpty() {
        return !((this.manifest || {}).aspects || {})[this.aspect];
      },
      focusStyle() {
        return `
        <style>
          a[href$="${this.aspect}"] text {
            font-size: 14px;
            fill: #f00;
            font-weight: 600;
            text-decoration-line: underline;
          }
        </style>
      `;
      },
      srcLocations() {
        let result = query.expression(query.locationsForAspect(this.aspect))
          .evaluate(this.$store.state.sources) || [];

        if (process.env.VUE_APP_DOCHUB_MODE === 'plugin') {
          result = result.map((item) => ({
            title: item.title.slice(19),
            link: `${item.link}?entity=aspect&id=${this.aspect}`
          }));
        }

        return result;
      },
      components() {
        return query.expression(query.componentsForAspects(this.aspect)).evaluate(this.manifest) || [];
      },
      contexts() {
        return query.expression(query.contextsForAspects(this.aspect)).evaluate(this.manifest) || [];
      },
      summary() {
        return (query.expression(query.summaryForAspect(this.aspect))
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
  margin-top: 12px;
}
</style>
