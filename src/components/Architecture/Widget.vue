<template>
  <v-card>
    <v-card-title>
      <v-icon left>settings</v-icon>
      <span class="title">{{ profile.title }}</span>
    </v-card-title>
    <doc 
      v-bind:profile-resolver="profileResolver" 
      v-bind:url-resolver="urlResolver"
      v-bind:params="params" 
      class="widget" />
  </v-card>
</template>

<script>

  import doc from '@/components/Docs/DocHubDoc.vue';
  import docs from '@/helpers/docs';

  export default {
    name: 'Widget',
    components: {
      doc
    },
    props: {
      // Идентификатор виджета
      id: { type: String, required: true },
      // Профиль документа, который будет рендериться
      profile: { type: Object, required: true },
      // Базовый URI от которого будут вычисляться относительные пути
      baseURI: { type: String, required: true },
      // Параметры, которые будут переданы в документ
      params: { type: Object, required: true }
    },
    data() {
      return {
        currentContext: 0
      };
    },
    computed: {
    },
    methods: {
      profileResolver() {
        return this.profile;
      },
      urlResolver() {
        return this.profile ?
          docs.urlFromProfile(this.profile, this.baseURI): '';
      }
    }
  };
</script>

<style >
  .widget .space {
    padding: 16px !important;
  }
</style>
