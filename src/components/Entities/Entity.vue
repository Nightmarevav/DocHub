<template>
  <doc 
    v-bind:profile-resolver="profileResolver" 
    v-bind:url-resolver="urlResolver"
    v-bind:params="entityParams" />
</template>

<script>
  import docs from '@/helpers/docs';
  import doc from '../Docs/DocHubDoc.vue';

  export default {
    name: 'Entity',    
    components: {
      doc
    },
    props: {
      entity: {
        type: String,
        default: undefined
      },
      presentation: {
        type: String,
        default: undefined
      },
      params: {
        type: Object,
        default: undefined
      }
    },
    data() {
      return {
      };
    },
    computed: {
      presProfile() {
        return this.manifest?.entities?.[this.entity]?.presentations?.[this.presentation] || {};
      },
      entityData() {
        return this.manifest?.[this.entity];
      },
      entityParams() {
        return this.params || (this.$route.params && this.$router.currentRoute.query);
      }
    },
    methods:{
      profileResolver() {
        return this.presProfile;
      },
      urlResolver() {
        const result = this.presProfile ?
          docs.urlFromProfile(this.presProfile,
                              (this.$store.state.sources.find((item) => item.path === `/entities/${this.entity}`) || {}).location
          ): '';
        return `${result}?id=${this.entity}`;
      }
    }
  };
</script>
