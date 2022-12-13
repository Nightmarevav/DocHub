
import env from '@/helpers/env';
const listeners = {};

if (env.isPlugin() && (env.isProduction())) {
	setInterval(() => {
		window.$PAPI.messagePull().then((message) => {
			if (message) {
				for (const action in message.data) {
					(listeners[action] || []).forEach((listener) => {
						listener(message.data[action]);
					});
				}
			}
		});
	}, 300);
}

export default {
	appendListener(action, listener) {
		const arr = listeners[action] = (listeners[action] || []);
		arr.push(listener);
	},
	removeListener(action, listener) {
		const arr = listeners[action] = (listeners[action] || []);
		const index = arr.indexOf(listener);
		if (index >=0 ) arr.splice(index, 1);
	}
};
