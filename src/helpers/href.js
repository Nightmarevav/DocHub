import requests from './requests';
import env from './env';

// Работа с ссылками
export default {
	// Обрабатывает клик по ссылке
	onClickRef(event) {
		event.preventDefault();
		if (event.shiftKey) return false;
		const ref = event.currentTarget.href.baseVal || event.currentTarget.href;
		if (!ref.length) return false;
		try {
			if (requests.isExtarnalURI(ref)) {
				window.open(ref, 'blank_');
			} else {
				const url = new URL(ref, window.location);
				window.Router.push({ path: url.pathname, query: Object.fromEntries(url.searchParams)});
			}
		} catch (e) {
			if (env.isPlugin()) {
				window.Router.push({ path: ref.split('#')[1]});
			}
		}
      
		return false;
	},

	// Обрабатывает элемент для сормирование корректных ссылок в нем
	elProcessing(el) {
		const refs = el.querySelectorAll('[href]');
		for (let i = 0; i < refs.length; i++) {
			refs[i].onclick = this.onClickRef;
		}
	}
};
