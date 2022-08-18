
const listeners = {};

if ((process.env.VUE_APP_DOCHUB_MODE === 'plugin') && (process.env.NODE_ENV === 'production')) {
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
	}
};
