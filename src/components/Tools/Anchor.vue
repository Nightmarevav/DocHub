<template>
  <a v-bind:id="id" dochub-anchor />
</template>

<script>
/*
let anchorWinner = {
  offsetTop: 0,
  id: ''
};

let anchorTimer = null;

window.addEventListener('scroll', () => {
  let anchors = document.querySelectorAll('[dochub-anchor]');
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];
    const topBorder = window.pageYOffset + 40;
    if (anchor.offsetTop < topBorder) {
      anchorWinner = anchor;
    }
    if (anchorTimer) clearTimeout(anchorTimer);
    anchorTimer = setTimeout(() => {
      const anchorID = anchorWinner.id;
      if (anchorID !== window.location.hash.substr(1)) {
        anchorWinner.id = '';
        window.location.hash = `#${anchorID}`;
        anchorWinner.id = anchorID;
      }
      clearTimeout(anchorTimer);
      anchorTimer = null;
    }, 10);
  }
});
*/

  export default {
    name: 'Anchor',
    props: {
      id: { type: String, default: '' }
    },
    data() {
      return {
      };
    },
    mounted() {
    },
    methods: {
    }
  };
</script>

<style scoped>
</style>
