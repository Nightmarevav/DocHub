<template>
  <div>
    <doc
      v-if="!isParmasInvalid" 
      v-bind:profile-resolver="profileResolver" 
      v-bind:url-resolver="urlResolver"
      v-bind:params="entityParams" />
    <v-alert v-else type="error" v-bind:value="true" style="white-space: pre-wrap;">
      Сущность: {{ entity }}<br>
      Представление: {{ presentation }}<br>
      {{ isParmasInvalid.name }}:<br>
      {{ isParmasInvalid.error }}
    </v-alert>      
  </div>
</template>

<script>
  import docs from '@/helpers/docs';
  import doc from '../Docs/DocHubDoc.vue';
  import ajv from 'ajv';
  const ajv_localize = require('ajv-i18n/localize/ru');

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
      // Валидируем входящие параметры, если контракт на параметры определен
      isParmasInvalid() {
        const schema = this.presProfile.params;
        if (schema) {
          try {
            const rules = new ajv({ allErrors: true });
            const validator = rules.compile(schema);
            if (validator(this.entityParams)) return false;
            ajv_localize(validator.errors);
            return {
              name: 'Ошибка валидации параметров',
              error: JSON.stringify(validator.errors, null, 4)
            };
          } catch (e) {
            return {
              name: 'Ошибка описания схемы',
              error: e
            };
          }
        } else return false;
      },
      // Получаем профиль представления
      presProfile() {
        return this.manifest?.entities?.[this.entity]?.presentations?.[this.presentation] || {};
      },
      // Формируем параметры для документа
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
