import axios  from  'axios';
import gitlab from './gitlab';
import config from '../../config';
import YAML from 'yaml';


// Add a request interceptor

axios.interceptors.request.use(function(params) {
	if (config.gitlab_server && ((new URL(params.url)).host === (new URL(config.gitlab_server)).host)) {
		if (!params.headers) params.headers = {};
		// eslint-disable-next-line no-undef
		params.headers['Authorization'] = `Bearer ${config.porsonalToken || Vuex.state.access_token}`;
	}
	return params;
}, function(error) {
	return Promise.reject(error);
});

axios.interceptors.response.use(function(response) {
	if (response.config.responseHook) 
		response = response.config.responseHook(response);
	if (typeof response.data === 'string') {
		if (!response.config.raw) {
			const url = response.config.url.split('?')[0].toLowerCase();
			if ((url.indexOf('.json/raw') >= 0) || (url.slice(-5) === '.json'))
				response.data = JSON.parse(response.data);
			else if ((url.indexOf('.yaml/raw') >= 0) || (url.slice(-5) === '.yaml'))
				response.data = YAML.parse(response.data);
		}
	}
	return response;
}, function(error) {
	// Do something with request error
	return Promise.reject(error);
});

if(window.$PAPI) {
	window.$PAPI.middleware = function(response) {
		let type = response.contentType;
		switch(type) {
		case 'yaml': response.data = YAML.parse(response.data); break;
		case 'json': response.data = JSON.parse(response.data); break;
		case 'jpg': 
			type = 'jpeg'; 
		// eslint-disable-next-line no-fallthrough
		case 'jpeg':
		case 'png':
		case 'svg':
			if (type === 'svg') type = 'svg+xml';
			response.data = Buffer.from(response.data, 'base64');
			response.headers = Object.assign(response.headers || {}, {
				'content-type': `image/${type}`
			});
			break;
		}
		return response;
	};
}

export default {
	axios,
	isURL(url) {
		// eslint-disable-next-line no-useless-escape
		return url && url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.?[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);
	},
	isExtarnalURI(uri) {
		return (uri.slice(0, window.origin.length) !== window.origin) && this.isURL(uri);
	},
	getSourceRoot(){
		if(window.$IDE_PLUGIN) {
			return 'plugin:/idea/source/';
		} else 
			return window.origin + '/';
	},
	getGitLabProjectID(uri) {
		let result = undefined;
		// Анализируем URI
		try {
			let url = new URL(uri);
			// Если ссылка на gitlab
			if (url.protocol === 'gitlab:') {
				let segments = url.pathname.split('@');
				if (segments.length === 2) {
					let gilab_params = segments[0].split(':');
					if (gilab_params.length === 2)
						result = gilab_params[0];
				}
			}
		} catch (e) {
			return undefined;
		}
		return result;
	},
	makeURIByBaseURI(uri, baseURI) {
		let result;
		// Анализируем URI
		try {
			// Если URI ссылка на прямой ресурс, оставляем его как есть
			new URL(uri);
			result = uri;
		} catch (e) {
			// Если возникла ошибка, считаем путь относительным
			if (!baseURI) {
				throw `Error in base URI ${uri}! Base URI is empty.`;
			}
			if ((new URL(baseURI)).protocol === 'gitlab:') {
				const segments = baseURI.split('@');
				if (segments.length !== 2) {
					// Не указаны идентификатор проекта и бранч GitLab
					throw `Error in URI ${baseURI}! Not found divider '@'`;
				}
				const base = segments[1].split('/');
				if (uri.substring(0, 1) === '/') {
					result = `${segments[0]}@${uri.substring(1)}`;
				} else {
					result = `${segments[0]}@${base.slice(0, base.length - 1).join('/')}${base.length > 1 ? '/' : ''}${uri}`;
				}
			} else {
				let slices = baseURI.split('/');
				result = this.makeURL(slices.slice(0, slices.length - 1).join('/') + '/' + uri).url;
			}
		}
		return result.toString();
	},

	makeURL(uri, baseURI) {
		let result;
		// Анализируем URI
		try {
			let url = new URL(uri);
			// Если ссылка на gitlab
			if (url.protocol === 'gitlab:') {
				let segments = url.pathname.split('@');
				if (segments.length !== 2) {
					// Не указаны идентификатор проекта и бранч GitLab
					throw `Error in URI ${uri}! Not found divider '@'`;
				} else {
					let gilab_params = segments[0].split(':');
					if (gilab_params.length !== 2) {
						// Неверно указаны идентификатор проекта и бранч GitLab
						throw `Error in URI ${uri}! Incorrect project id and branch`;
					}

					result = {
						type: 'gitlab',
						projectID: gilab_params[0],
						url: gitlab.makeFileURI(
							gilab_params[0], // Application ID
							segments[1], // Путь к файлу
							gilab_params[1], // Бранч
							'raw'
						)
					};
				}
				// В ином случае считаем, что ничего делать не нужно
			} else {
				result = {
					type: 'web',
					url
				};
			}
		} catch (e) {
			// Если возникла ошибка, считаем путь относительным
			if (!baseURI) {
				throw `Error in base URI ${uri}! Base URI is empty.`;
			}
			result = this.makeURL(baseURI);
			let slices = result.url.toString().split('/');
			if (result.type === 'gitlab') {
				const subSlices = slices[slices.length - 2].split('%2F');
				subSlices[subSlices.length - 1] = uri.replace(/\//g, '%2F');
				slices[slices.length - 2] = subSlices.join('%2F');
			} else {
				slices[slices.length - 1] = uri;
			}
			result.url = new URL(slices.join('/'));
		}
		return result;
	},

	// axios_params - параметры передавамые в axios 
	// 		responseHook - содержит функцию обработыки ответа перед работой interceptors
	//		raw - если true возвращает ответ без обработки
	request(uri, baseURI, axios_params) {
		let params = Object.assign({}, axios_params);
		params.source = this.makeURL(uri, baseURI);
		params.url = params.source.url.toString();
		if (window.$IDE_PLUGIN && params.url.split(':')[0] === 'plugin') {
			return window.$PAPI.request(params);
		} else {
			return axios(params);
		}
	}
};
