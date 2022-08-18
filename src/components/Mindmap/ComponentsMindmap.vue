<template>
  <plantuml v-bind:uml="uml" style="min-height:100%" />
</template>

<script>

  import PlantUML from '../Schema/PlantUML';
  import query from '../../manifest/query';
  import jsonata from 'jsonata';

  export default {
    name: 'ComponentsMindMap',
    components: {
      'plantuml' : PlantUML
    },
    props: {
      root: { type: String, default: '' }, // Корневой идентификатор
      links: {
        type: String,
        default: 'smart',
        validator: value => [
          'smart',
          'component',
          'context'
        ].indexOf(value) >= 0
      }
    },
    data() {
      return {
      };
    },
    computed: {
      uml() {
        const asis = this.manifest;
        const nodes = jsonata(query.archMindMapComponents(this.root)).evaluate(asis);
        const namespaces = asis.namespaces || {};
        const contexts = asis.contexts || {};
        const components = asis.components || {};
        let uml = '@startwbs\n* Архитектура\n';
        let prevStruct = [];
        nodes && nodes.map((node) => {
          uml += '**';
          let nsid = '';
          const makeTitle = (id, title) => {
            if ((['smart', 'context'].indexOf(this.links) >= 0) && contexts[id]) {
              return ` [[/architect/contexts/${id} ${title}]]\n`;
            } else if ((['smart', 'component'].indexOf(this.links) >= 0) && components[id]) {
              return ` [[/architect/components/${id} ${title}]]\n`;
            } else {
              return ` ${title}\n`;
            }
          };
          const struct = node.id.split('.');
          for (let i = 0; i < struct.length; i++) {
            if (prevStruct[i] === struct[i]) uml += '*';
            else if (i === struct.length - 1) {
              uml += makeTitle(node.id, node.title);
            } else {
              const id = `${nsid}${struct[i]}`;
              uml += makeTitle(id, (components[id] || namespaces[id] || {}).title || '...');
              for (let f = 0; f <= i + 2; f++) uml += '*';
            }
            nsid += `${struct[i]}.`;
          }
          prevStruct = struct;
        });
        uml += '@endwbs\n';
        // eslint-disable-next-line no-console
        console.info(uml);
        return uml;
      }
    },
    mounted() {
    },
    methods: {
    }
  };
</script>

<style scoped>


</style>
