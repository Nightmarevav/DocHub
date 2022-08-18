<template>
  <plantuml v-bind:uml="uml" style="min-height:100%" />
</template>

<script>

  import PlantUML from '../Schema/PlantUML';
  import query from '../../manifest/query';

  export default {
    name: 'AspectsMindMap',
    components: {
      'plantuml' : PlantUML
    },
    props: {
      root: { type: String, default: '' } // Корневой идентификатор
    },
    data() {
      return {
      };
    },
    computed: {
      uml() {
        const asis = this.manifest;
        const nodes = query.expression(query.archMindMapAspects(this.root)).evaluate(asis);
        let uml = '@startwbs\n* Аспекты\n';

        const appendNode = (before, current, title) => {
          let deep = '**';
          let isPrefix = true;
          const beforeStruct = before.split('.');
          const curentStruct = current.split('.');
          for (let i = 0; i < curentStruct.length; i++) {
            isPrefix = isPrefix && (beforeStruct[i] === curentStruct[i]);
            if (!isPrefix) {
              if (i === curentStruct.length - 1) {
                uml += `${deep} [[/architect/aspects/${current} ${title}]]`;
              } else {
                const aspectID = curentStruct.slice(0, i + 1).join('.');
                const aspect = asis.aspects && asis.aspects[aspectID];
                const title = (aspect && aspect.title) || curentStruct[i];
                uml += `${deep} [[/architect/aspects/${aspectID} ${title}]]\n`;
              }
            }
            deep += '*';
          }
          uml += '\n';
        };

        let before = '';
        nodes && nodes.map((node) => {
          appendNode(before, node.id, node.title);
          before = node.id;
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
