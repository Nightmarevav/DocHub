<script>
  import errConstants from '@/constants/errConstants.json';

  export default {
    functional: true,
    render(createElement, context) {
      return createElement('section', {
        style: {
          color: 'red',
          textAlign: 'center'
        }
      }, [
        createElement('h1', errConstants.LOAD_ERROR),
        createElement('p', context.data.error)
      ]);
    }
  };
</script>
