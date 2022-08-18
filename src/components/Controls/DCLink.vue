<template>
  <a v-bind:href="href" v-bind:target="target || '_blank'" v-on:click="onClick">
    <slot />
  </a>
</template>

<script>

  export default {
    name: 'DCLink',
    props: {
      href: { type: String, default: '' },
      target: { type: String, default: '' }
    },
    data() {
      return {};
    },
    methods: {
      onClick(event) {
        const struct = (this.href || '').split(':/');
        if (struct[0] === 'plugin') {
          const url = new URL(this.href);
          window.$PAPI.goto(`plugin:${url.pathname}`, url.searchParams.get('entity'), url.searchParams.get('id'));
          event.preventDefault();
          return false;
        } else if ((this.href || '').split(':/').length == 1) {
          event.preventDefault();
          this.$router.push({ path: this.href});
          return false;
        }
        return true;
      }
    }
  };
</script>

<style scoped>


</style>
