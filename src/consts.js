export default {
	plugin: {
		ROOT_MANIFEST: 'plugin:/idea/source/$root'
	},
	pages: {
		OAUTH_CALLBACK_PAGE: '/sso/gitlab/authentication',
		MAIN_PAGE: '/main'
	},
	transports: {
		HTTP: 'http',
		GITLAB: 'gitlab'
	}
};

