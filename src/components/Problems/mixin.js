export default {
	computed: {
		problems() {
			return this.$store.state.problems || [];
		},
		exceptions() {
			return (this.manifest.rules || {}).exceptions || {};
		}
	}
};
