import datasets from './datasets';

// Выполняет валидаторы и накладывает исключения
export default function(manifest, success, reject) {
	const validators = (manifest['rules'] || {})['validators'] || {};

	for (const id in validators) {
		const provider = datasets();
		provider.dsResolver = (id) => {
			return {
				subject: Object.assign({_id: id}, (this.manifest.datasets || {})[id])
			};
		};

		provider.getData(manifest, Object.assign({_id: id}, validators[id]))
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
						title: validators[id].title || id,
						error,
						items: [
							{
								uid: id,
								title: 'Критическая ошибка валидатора!',
								correction: 'Исправьте ошибку в запросе валидатора',
								description: error.message
							}
						]
					}
				);
			});
	}
}
