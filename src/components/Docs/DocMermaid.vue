<template>
  <box>
    <div v-html="svg" />
  </box>
</template>

<script>
  import mermaid from 'mermaid';
  import requests from '@/helpers/requests';
  import DocMixin from './DocMixin';
  import mustache from 'mustache';
  import href from '../../helpers/href';

  /*
  mermaid.initialize({
    startOnLoad:true
  });  
  */
  
  export default {
    name: 'DocMermaid',
    mixins: [DocMixin],
    data() {
      return {
        svg: null
      };
    },
    mounted() {

    },
    methods: {
      refresh() {
        // Получаем шаблон документа
        setTimeout(() => {
          requests.request(this.url).then(({ data }) => {
            let source = this.isTemplate 
              ? mustache.render(data, this.source.dataset) 
              : data;
            const cb = (svgGraph) => {
              // Генерируем ссылки т.к. Mermaid для C4 Model отказывается это делать сам
              // eslint-disable-next-line no-useless-escape
              this.svg = svgGraph.replace(/\!\[([^\]]*)\]\(([^\)]*)\)/g, (match, text, url)=> {
                return `<a href="${encodeURI(url)}">${text}<a>`;
              }) 
                + `<!-- ${Date.now()} -->`; // Без соли не работает ререндеринг тех же данных

              this.$nextTick(() => href.elProcessing(this.$el));
            };
            mermaid.render('buffer', source, cb);
          }).catch((e) => this.error = e);
        }, 50);
        this.sourceRefresh();
      }
    }
  };
</script>

<style>
</style>
