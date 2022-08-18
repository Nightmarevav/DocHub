<template>
  <div
    v-if="url"
    v-bind:id="id">
    {{ error }}
  </div>
</template>

<script>
  import SwaggerUI from 'swagger-ui';
  // import config from "../../../config";
  import docs from '../../helpers/docs';
  import requests from '../../helpers/requests';

  export default {
    name: 'Swagger',
    props: {
      document: { type: String, default: '' }
    },
    data() {
      return {
        id : `swagger-${Date.now()}-${Math.round(Math.random() * 10000)}`,
        data: null,
        error: ''
      };
    },
    computed: {
      url() {
        // eslint-disable-next-line vue/no-async-in-computed-properties
        setTimeout(() => this.requestData(), 50);
        const profile = this.manifest.docs ? this.manifest.docs[this.document] : null;
        return profile ?
          docs.urlFromProfile(profile,
                              (this.$store.state.sources.find((item) => item.path === `/docs/${this.document}`) || {}).location
          )
          : '';
      }
    },
    methods: {
      requestData() {
        requests.request(this.url)
          .then((response) => {
            this.data = response.data;
            this.swaggerRender();
          }).catch((e) => {
            this.error = e;
          });
      },

      swaggerRender() {
        if (this.url) {
          SwaggerUI({
            dom_id: `#${this.id}`,
            spec: this.data
          });
        }
      }
    }
  };
</script>

<style>

.swagger-ui .info {
  display: none;
}

.swagger-ui .info {
  border-radius: 3px;
}

.swagger-ui .info .title {
  margin-left: 24px;
  margin-top: 24px;
  display: block;
  font-size: 24px !important;
  color: #fff;
}

.swagger-ui .info .url {
  margin-left: 24px;
  margin-top: 8px;
  display: block;
  font-size: 16px !important;
  color: #fff;
}

.swagger-ui .scheme-container {
  margin: 0;
  padding: 0 0 0 30px;
  background: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}


.swagger-ui .info .main {
  background: #3495db;
}
</style>
