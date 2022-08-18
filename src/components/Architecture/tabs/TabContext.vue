<template>
  <v-card 
    style="
      overflow: hidden;
      position: relative;
      min-height: 600px;
    ">
    <v-card-title>
      <v-icon left>link</v-icon>
      <span class="title">Контексты</span>
    </v-card-title>
    <v-select
      v-model="context"
      v-bind:items="contexts"
      item-text="title"
      item-value="id"
      return-object
      class="d-flex"
      cols="12"
      sm="12"
      style="margin: 0 12px 0px 12px" />
    <v-card-text 
      class="headline font-weight-bold"
      style="
        position: absolute;
        top: 108px;
        left: 0;
        bottom: 0;
        right: 0;
      ">
      <schema v-bind:schema="schema" style="min-height:100%" />
    </v-card-text>
  </v-card>
</template>

<script>

  import Schema from '../../Schema/Schema';
  import query from '../../../manifest/query';

  export default {
    name: 'TabContexts',
    components: {
      Schema
    },
    props: {
      contexts: { type: Array, default: () => ([]) }
    },
    data() {
      return {
        seleted : null,
        currentContext: 0
      };
    },
    computed: {
      schema() {
        if (!this.context) return null;

        const expression = query.expression(
          this.context.type === 'component' ? 
            query.component(this.context.id) :
            query.context(this.context.id)
        );

        return expression.evaluate(this.manifest);
      },
      context: {
        get() {
          return this.seleted ? this.seleted : (this.contexts[0]);
        },
        set(value) {
          this.seleted = value;
        }
      }
    },
    watch: {
      contexts() {
        this.seleted = null;
      }
    },
    methods: {
      goToLink() {

      }
    }
  };
</script>
