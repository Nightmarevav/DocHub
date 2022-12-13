<template>
  <v-container grid-list-xl fluid>
    <div style="display: none" v-html="focusStyle" />
    <empty v-if="isEmpty" />
    <template v-else>
      <v-layout wrap>
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
                          <a v-else-if="isURL(item.content)" v-bind:href="item.content" target="_blank">{{ item.content }}</a>
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

              <widget 
                v-for="widget in widgets.left"
                v-bind:id="widget.id"
                v-bind:key="widget.id"
                class="card-item"
                style="margin-top: 12px"
                xs12
                md12
                v-bind:profile="widget.profile"
                v-bind:base-u-r-i="widget.baseURI"
                v-bind:params="widget.params" />
            </v-container>
          </v-layout>
        </v-flex>

        <v-flex xs12 md7 d-flex>
          <v-layout wrap>
            <tab-contexts 
              v-if="contexts.length"
              style="width: 100%"
              v-bind:contexts="contexts"
              v-bind:manifest="manifest"
              d-flex />

            <widget
              v-for="widget in widgets.right"
              v-bind:id="widget.id" 
              v-bind:key="widget.id"
              xs12
              md7
              class="card-item"
              style="margin-top: 12px"
              v-bind:profile="widget.profile"
              v-bind:base-u-r-i="widget.baseURI"
              v-bind:params="widget.params" />
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout v-if="widgets.fill.length" wrap style="height: auto">
        <widget
          v-for="widget in widgets.fill"
          v-bind:id="widget.id" 
          v-bind:key="widget.id"
          xs12
          md12
          class="card-item"
          style="margin-top: 12px"
          v-bind:profile="widget.profile"
          v-bind:base-u-r-i="widget.baseURI"
          v-bind:params="widget.params" />
      </v-layout>
    </template>
  </v-container>
</template>

<script>

  import query from '@/manifest/query';
  import ComponentsMindmap from '@/components/Mindmap/ComponentsMindmap';
  import TabContexts from './tabs/TabContext.vue';
  import Empty from '../Controls/Empty.vue';
  import SrcLocations from './tabs/SrcLocations.vue';
  import Docs from './tabs/Docs.vue';
  import requests from '@/helpers/requests';
  import env from '@/helpers/env';
  import Widget from './Widget.vue';

  export default {
    name: 'ArchComponent',
    components: {
      Docs,
      ComponentsMindmap,
      TabContexts,
      Empty,
      SrcLocations,
      Widget
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

        if (env.isPlugin()) {
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
      },
      // Генерируем данные о фиджетах
      widgets() {
        const result = {
          left: [],   // Виджеты с прижатием налево
          right: [],  // Виджеты с прижатием направо
          fill: []    // Виджеты во всю ширину
        };
        const widgets = (query.expression(query.widgetsForComponent()).evaluate(this.manifest) || {});
        for (const id in widgets) {
          const wiget = widgets[id];
          const profile = {
            id,
            profile: widgets[id],
            baseURI: (this.$store.state.sources.find((item) => item.path === `/entities/components/widgets/${id}`) || {}).location,
            params: {
              component: this.component
            }
          };
          switch(wiget.align) {
            case '<': result.left.push(profile); break;
            case '>': result.right.push(profile); break;
            default: result.fill.push(profile); break;
          }
        }
        return result;
      }
    },
    methods: {
      isURL(str) {
        return requests.isURL(str);
      },
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
