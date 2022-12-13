import requests from './requests';
import docs from './docs';
import query from '../manifest/query';

export default function() {
	return {
		// eslint-disable-next-line no-unused-vars
		dsResolver(datasetID) {
			return null;
		},
		// Парсит поле данных в любом объекте
		//  context - Контекст данных для выполнения запросов
		//  data - данные требующие парсинга
		//	subject - объект - владелец
		//  params - параметры передающиеся в запрос
		parseSource(context, data, subject, params) {
			return new Promise((resolve, reject) => {
				// Константные данные
				if(typeof data === 'object') {
					resolve(JSON.parse(JSON.stringify(data)));
				} else if (typeof data === 'string') {
					// Inline запрос JSONata
					if (/(\s+|)\(((.*|\d|\D)+?)(\)(\s+|))$/.test(data)) {
						const exp = query.expression(data, subject, params);
						exp.onError = reject;
						resolve(exp.evaluate(context));
						// Ссылка на файл с данными
					} else if (data.slice(-5) === '.yaml' || data.slice(-5) === '.json' || (data.search(':') > 0)) {
						requests.request(data)
							.then((response) => {
								this.parseSource(context, response.data)
									.then((data) => resolve(data))
									.catch((e) => reject(e));  
							}).catch((e) => reject(e));
						// Ссылка на файл с запросом
					} else if (data.slice(-8) === '.jsonata') {
						const url = docs.urlFromProfile({source: data});
						requests.request(url).then((response) => {
							const exp = query.expression(typeof response.data === 'string' 
								? response.data 
								: JSON.stringify(response.data), params);
							exp.onError = reject;
							resolve(exp.evaluate(context), subject);
						}).catch((e) => reject(e));
						// Идентификатор источника данных
					} else {
						const dataSet = this.dsResolver(data);
						if (dataSet.subject) {
							this.getData(context, dataSet.subject)
								.then((data) => resolve(data))
								.catch((e) => reject(e));
						} else reject(`Не найден источник данных [${data}]`);
					}
				} else reject(`Ошибка истоника данных [${data}]`);
			});
		},

		// Возвращает данные по субъекту
		//  context - данные для запроса
		//  subject - субъект данных
		//  params - параметры передающиеся в запрос
		getData(context, subject, params) {
			return new Promise((resolve, reject) => {
				const exec = (origin) => {
					this.parseSource(origin, subject.source || (subject.data /* depricated */), subject, params)
						.then((data) => resolve(data))
						.catch((e) => reject(e));
				};
				if (subject.source || (subject.data /* depricated */) ) {
					if (subject.origin) {
						if(typeof subject.origin === 'string') {
							this.parseSource(context, subject.origin, subject)
								.then((data) => exec(data))
								.catch((e) => reject(e));
						} else if ((typeof subject.origin === 'object') && !Array.isArray(subject.origin)) {
							let counter = 0;
							const data = {};
							for (const key in subject.origin) {
								++counter;
								this.parseSource(context, subject.origin[key], subject).then((content) => {
									data[key] = content;
									if(!--counter) exec(data);
								}).catch((e) => reject(e));
							}
						} else reject(`Ошибка данных [${subject.source}]`);
					} else exec(context);
				} else resolve (null); // Нет данных
			});
		}
	};
}
