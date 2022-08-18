<template>
  <img v-bind:src="data">
</template>

<script>


  import requests from '../../helpers/requests';

  export default {
    name: 'Image',
    props: {
      src: { type: String, default: '' },
      baseURI: { type: String, default: '' }
    },
    data() {
      return {
        data: null
      };
    },
    mounted() {
      this.reloadImage();
    },
    methods: {
      reloadImage() {
        requests.request(this.src, this.baseURI, {responseType: 'arraybuffer'})
          .then((response) => {
            this.data = URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type']}));
          });
      }
    }
  };
</script>

<style scoped>
</style>
