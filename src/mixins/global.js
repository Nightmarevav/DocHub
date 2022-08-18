import manifest_parser from '../manifest/manifest_parser';

export default {
	computed: {
		manifest() {
			return this.$store.state.manifest[manifest_parser.MODE_AS_IS] || {};
		}
	}
};
