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
                    <v-list-item-content>
                      <v-list-item-subtitle v-text="item.title" />
                      <v-list-item-title>
                        <a v-if="isURL(item.content)" v-bind:href="item.content" target="_blank">{{ item.content }}</a>
                        <template v-else>{{ item.content }}</template>
                      </v-list-item-title>
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

            <widget 
              v-for="widget in widgets.left"
              v-bind:id="widget.id"
              v-bind:key="widget.id"
              class="card-item"
              xs12
              md12
              v-bind:profile="widget.profile"
              v-bind:base-u-r-i="widget.baseURI"
              v-bind:params="widget.params" />
          </v-container>
        </v-layout>
      </v-flex>
      <v-flex xs12 md7 d-flex>
        <tab-contexts 
          v-if="contexts.length"
          style="width: 100%"
          v-bind:default-context="defaultContext"
          v-bind:contexts="contexts"
          d-flex />  

        <widget
          v-for="widget in widgets.right"
          v-bind:id="widget.id" 
          v-bind:key="widget.id"
          xs12
          md7
          class="card-item"
          v-bind:profile="widget.profile"
          v-bind:base-u-r-i="widget.baseURI"
          v-bind:params="widget.params" />
      </v-flex>
      <v-flex xs12 md12 d-flex>
        <widget
          v-for="widget in widgets.fill"
          v-bind:id="widget.id" 
          v-bind:key="widget.id"
          xs12
          md12
          class="card-item"
          style="margin-top: 12px; "
          v-bind:profile="widget.profile"
          v-bind:base-u-r-i="widget.baseURI"
          v-bind:params="widget.params" />
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
  import requests from '@/helpers/requests';
  import env from '@/helpers/env';
  import Widget from './Widget.vue';

  export default {
    name: 'Aspect',
    components: {
      Docs,
      AspectsMindmap,
      TabContexts,
      Empty,
      SrcLocations,
      Widget
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

        if (env.isPlugin()) {
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
      defaultContext() {
        const contextId = query.expression(query.defaultContextForAspect(this.aspect)).evaluate(this.manifest);

        return contextId ? this.contexts.find(i => i.id === contextId) : null;
      },
      contexts() {
        return query.expression(query.contextsForAspects(this.aspect)).evaluate(this.manifest) || [];
      },
      summary() {
        return (query.expression(query.summaryForAspect(this.aspect))
          .evaluate(this.manifest) || []);
      },
      // Генерируем данные о фиджетах
      widgets() {
        const result = {
          left: [],   // Виджеты с прижатием налево
          right: [],  // Виджеты с прижатием направо
          fill: []    // Виджеты во всю ширину
        };
        const widgets = (query.expression(query.widgetsForAspect()).evaluate(this.manifest) || {});
        for (const id in widgets) {
          const wiget = widgets[id];
          const profile = {
            id,
            profile: widgets[id],
            baseURI: (this.$store.state.sources.find((item) => item.path === `/entities/aspects/widgets/${id}`) || {}).location,
            params: {
              aspect: this.aspect
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
