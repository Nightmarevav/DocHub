import datasets from './datasets';

// Выполняет валидаторы и накладывает исключения
export default function(manifest, success, reject) {
	const validators = (manifest['rules'] || {})['validators'] || {};

	for (const id in validators) {
		const provider = datasets();
		provider.dsResolver = (id) => {
			return {
				subject: (this.manifest.rules.validators || {})[id],
				baseURI: (this.$store.state.sources.find((item) => item.path === `/rules/validators/${id}`) || {}).location
			};
		};

		provider.getData(manifest, validators[id])
			.then((items) => {
				success({
					id,
					title: validators[id].title || id,
					items
				});
			}).catch((error) => {
				reject(
					{
						id,
						error
					}
				);
			});
	}
}
