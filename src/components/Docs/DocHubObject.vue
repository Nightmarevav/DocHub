<template>
  <div class="dochub-object" v-bind:style="{float:srcStruct.float}">
    <dochub-doc v-if="isDocument" v-bind:document="srcStruct.subject" v-bind:alt="srcStruct.alt" />
    <dochub-context v-else-if="isContext" v-bind:context="srcStruct.subject" v-bind:alt="srcStruct.alt" />
    <dochub-aspect v-else-if="isAspect" v-bind:aspect="srcStruct.subject" v-bind:alt="srcStruct.alt" />
    <dochub-component v-else-if="isComponent" v-bind:component="srcStruct.subject" v-bind:alt="srcStruct.alt" />
    <dochub-technology v-else-if="isTechnology" v-bind:technology="srcStruct.subject" v-bind:alt="srcStruct.alt" />
    <dochub-radar v-else-if="isRadar" v-bind:section="srcStruct.subject" v-bind:alt="srcStruct.alt" />
    <dochub-anchor v-else-if="isAnchor" v-bind:id="srcStruct.subject" v-bind:name="srcStruct.subject" />
    <dochub-image v-else v-bind:src="src" v-bind:alt="srcStruct.alt" v-bind:base-u-r-i="baseURI" />
  </div>
</template>

<script>

  import requests from '../../helpers/requests';

  export default {
    name: 'DocHubObject',
    props: {
      src: { type: String, default: '' },
      alt: { type: String, default: '' },
      type: { type: String, default: '' },
      subject: { type: String, default: '' },
      baseURI: { type: String, default: '' }
    },
    data() {
      return {};
    },
    computed: {
      isDocument() {
        return this.srcStruct.type.toLowerCase() === 'document';
      },
      isContext() {
        return this.srcStruct.type.toLowerCase() === 'context';
      },
      isAspect() {
        return this.srcStruct.type.toLowerCase() === 'aspect';
      },
      isComponent() {
        return this.srcStruct.type.toLowerCase() === 'component';
      },
      isTechnology() {
        return this.srcStruct.type.toLowerCase() === 'technology';
      },
      isRadar() {
        return this.srcStruct.type.toLowerCase() === 'radar';
      },
      isAnchor() {
        return this.srcStruct.type.toLowerCase() === 'anchor';
      },
      isImage() {
        return this.srcStruct.type.toLowerCase() === 'image';
      },
      // Параметры отображения встраиваемого объекта
      srcStruct() {
        const result = {
          type: this.type || 'image',
          subject: this.subject || this.src,
          params: {},
          float: 'none'
        };
        try {
          if (this.src.substr(0, 1) === '@') {
            const uri = new URL(this.src.replace('@', '/'), requests.getSourceRoot());
            const path = uri.pathname.split('/');
            result.type = path[1];
            result.subject = path[2];
            result.params = uri.searchParams;
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(e);
        }

        // Определяем форматирование объекта
        const alt = this.alt || '';
        switch(alt.substr(0,1)) {
          case '<':
            result.float = 'left';
            result.alt = alt.substr(1);
            break;
          case '>':
            result.float = 'right';
            result.alt = alt.substr(1);
            break;
        }

        return result;
      }
    }
  };
</script>

<style>

</style>
