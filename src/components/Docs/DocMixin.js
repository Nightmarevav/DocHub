import datasets from '../../helpers/datasets';
import docs from '@/helpers/docs';

const SOURCE_PENGING = 'pending';
const SOURCE_READY = 'ready';
const SOURCE_ERROR = 'error';

export default {
	methods: {
		sourceRefresh() {
			this.source.status = SOURCE_PENGING;
			this.source.dataset = null;
			if (this.profile.source) {
				this.source.provider.getData(this.manifest, Object.assign({'_id': this.document}, this.profile))
					.then((dataset) => {
						this.source.dataset = dataset;
						this.source.status = SOURCE_READY;
					})
					.catch((e) => {
						this.source.error = e;
						this.source.status = SOURCE_ERROR;
					});
			} else this.source.dataset = {};
		}
	},
	computed: {
		isTemplate() {
			return this.profile.template;
		},
		profile() {
			return this.manifest?.docs?.[this.document] || {};
		},
		url() {
			return this.profile ?
				docs.urlFromProfile(this.profile,
					(this.$store.state.sources.find((item) => item.path === `/docs/${this.document}`) || {}).location
				): '';
		}
	},
	props: {
		document: { type: String, default: '' }
	},
	data() {
		const provider = datasets();
		provider.dsResolver = (id) => {
			return {
				subject: Object.assign({'_id': id}, (this.manifest.docs || {})[id]),
				baseURI: (this.$store.state.sources.find((item) => item.path === `/docs/${id}`) || {}).location
			};
		};
		return {
			source: {
				provider,
				status: SOURCE_READY,
				error: null,
				dataset: null
			}
		};
	},
	watch: {
		url() { this.refresh(); }
	},
	mounted() {
		this.refresh();
	}
};
