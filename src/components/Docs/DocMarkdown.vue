<template>
  <div class="space">
    <dochub-anchor id="" />
    <div v-if="toc" class="toc" v-html="toc" />
    <markdown
      v-if="markdown"
      class="pa-3"
      toc
      v-bind:breaks="false"
      v-bind:html="false"
      v-on:toc-rendered="tocRendered"
      v-on:rendered="rendered">
      {{ markdown }}
    </markdown>
    <final-markdown v-if="showDocument && outHTML" v-bind:template="outHTML" v-bind:base-u-r-i="url" />
    <v-progress-circular
      v-else
      v-bind:size="64"
      v-bind:width="7"
      style="left: 50%; top: 50%; position: absolute; margin-left: -32px; margin-top: -32px;"
      v-bind:value="60"
      color="primary"
      indeterminate />
  </div>
</template>

<script>
  import requests from '@/helpers/requests';
  import markdown from 'vue-markdown';
  import DocMarkdownObject from './DocHubObject';
  import DocMixin from './DocMixin';
  import mustache from 'mustache';
  
  export default {
    name: 'DocMarkdown',
    components: {
      markdown,
      finalMarkdown: {
        components: {
          'dochub-object': DocMarkdownObject
        },
        props: {
          template: { type: String, default: '' },
          baseURI: { type: String, default: '' }
        },
        created() {
          this.$options.template = `<div class="markdown-document">${this.template}</div>`;
        },
        mounted() {
          this.refactoringRefs();
        },
        methods: {
          refactoringRefs() {
            const refs = this.$el.querySelectorAll('a');
            for (let i = 0; i < refs.length; i++) {
              try {
                const href = refs[i].href;
                const url = new URL(href);
                if (
                  url.origin === document.location.origin
                  && (['architect', 'docs'].indexOf(url.pathname.split('/')[1].toLocaleLowerCase()) >= 0)
                ) {
                  refs[i].addEventListener('click', (event) => {
                    event.preventDefault();
                    this.$router.push({ path: href.substring(url.origin.length) });
                  });
                }
              } catch (e) {
                // eslint-disable-next-line no-console
                console.warn(e);
              }
            }
          }
        }
      }
    },
    mixins: [DocMixin],
    data() {
      return {
        showDocument: false,
        toc: '',
        markdown: '',
        outHTML: ''
      };
    },
    methods: {
      // eslint-disable-next-line no-unused-vars
      rendered(outHtml) {
        if (this.outHTML !== outHtml) {
          this.outHTML = outHtml
            .replace(/<img /g, '<dochub-object :baseURI="baseURI" ')
            .replace(/\{\{/g, '<span v-pre>{{</span>')
            .replace(/\}\}/g, '<span v-pre>}}</span>');
          this.showDocument = false;
          this.$nextTick(() => {
            this.showDocument = true;
            window.location.hash && setTimeout(() => window.location.href = window.location.hash, 50);
          });
          this.markdown = null;
        }
      },
      tocRendered(tocHTML) {
        this.toc = tocHTML;
      },
      refresh() {
        if (!this.url) {
          this.markdown = '';
          return;
        }
        this.outHTML = '';
        this.showDocument = false;
        this.toc = '';
        // Получаем шаблон документа
        setTimeout(() => {
          requests.request(this.url).then(({ data }) => {
            if (!data)
              this.markdown = 'Здесь пусто :(';
            else if (this.isTemplate) {
              this.markdown = mustache.render(data, this.source.dataset);
            } else
              this.markdown = data;
          })
            .catch((e) => {
              // eslint-disable-next-line no-console
              console.error(e, `Ошибка запроса [${this.url}]`, e);
            });
        }, 50);
        this.sourceRefresh();
      }
    }
  };
</script>

<style>
.dochub-object {
  margin-top: 24px;
  margin-bottom: 24px;
}
.space {
  padding: 24px;
  position: relative;
  min-height: 100vh;
}
.toc {
  margin-bottom: 24px;
}
.markdown-document pre {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.42857143;
  color: #333;
  word-break: break-all;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: auto;
}
.markdown-document code[class*="language-"], 
.markdown-document pre[class*="language-"] {
  color: black;
  font-weight: 300;
  background: none;
  text-shadow: 0 1px white;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.5;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
  padding: 0;
  font-size: 13px;
  border-radius: 0;
}
.toc-anchor {
  display: none;
}
.markdown-document code[class*="language-"]::before, pre[class*="language-"]::before,
.markdown-document code[class*="language-"]::after, pre[class*="language-"]::after
{
  content: none !important;
}
.markdown-document table {
  border: solid #ccc 1px;
}
.markdown-document table.table td {
  padding-left: 6px;
  padding-right: 6px;
}
.markdown-document table thead th * {
  color: #fff !important;
}
.markdown-document table thead th  {
  background: rgb(52, 149, 219);
  color: #fff !important;
  height: 40px;
}
.markdown-document table.table thead th {
  padding: 6px;
}
.markdown-document h1,
.markdown-document h2,
.markdown-document h3,
.markdown-document h4,
.markdown-document h5 {
  margin-top: 36px;
  margin-bottom: 18px;
  clear:both;
}
.markdown-document h1:first-child {
  margin-top: 12px;
}
.markdown-document ul,
.markdown-document ol
{
  margin-bottom: 18px;
}
</style>
