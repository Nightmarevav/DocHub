<template>
  <div class="dochub-object" v-bind:style="{float:srcStruct.float}">
    <dochub-doc v-if="isDocument" v-bind:document="srcStruct.subject" v-bind:alt="srcStruct.alt" v-bind:inline="inline" />
    <dochub-context v-else-if="isContext" v-bind:context="srcStruct.subject" v-bind:alt="srcStruct.alt" v-bind:inline="inline" />
    <dochub-aspect v-else-if="isAspect" v-bind:aspect="srcStruct.subject" v-bind:alt="srcStruct.alt" v-bind:inline="inline" />
    <dochub-component v-else-if="isComponent" v-bind:component="srcStruct.subject" v-bind:alt="srcStruct.alt" v-bind:inline="inline" />
    <dochub-technology v-else-if="isTechnology" v-bind:technology="srcStruct.subject" v-bind:alt="srcStruct.alt" v-bind:inline="inline" />
    <dochub-radar v-else-if="isRadar" v-bind:section="srcStruct.subject" v-bind:alt="srcStruct.alt" v-bind:inline="inline" />
    <dochub-anchor v-else-if="isAnchor" v-bind:id="srcStruct.subject" v-bind:name="srcStruct.subject" v-bind:inline="inline" />
    <dochub-image v-else-if="isImage" v-bind:src="src" v-bind:alt="srcStruct.alt" v-bind:base-u-r-i="baseURI" v-bind:inline="inline" />
    <dochub-entity v-else-if="isEntity" v-bind:entity="srcStruct.subject" v-bind:presentation="srcStruct.presentation" v-bind:params="srcStruct.params" v-bind:inline="inline" />
    <div v-else>
      Что-то пошло не так :(
      <br>
      {{ srcStruct }}
    </div>
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
      baseURI: { type: String, default: '' },
      // Признак того, что объект встроен в другой объект
      inline: { type: Boolean, default: false }
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
      isEntity() {
        return this.srcStruct.type.toLowerCase() === 'entity';
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
            const url = new URL(this.src.replace('@', '/'), requests.getSourceRoot());
            const path = url.pathname.split('/');
            result.type = path[1];
            result.subject = path[2];
            result.presentation = path[3];
            result.params = Object.fromEntries(url.searchParams);
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
