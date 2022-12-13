import Vue from 'vue';
import Router from 'vue-router';
import Doc from '../components/Docs/DocHubDoc';
import Conditions from '../components/Conditions';
import DiffViewer from '../components/DiffViewer';
import Main from '../components/Main';
import config from '../../config';
import consts from '../consts';
import Component from '../components/Architecture/Component';
import Aspect from '../components/Architecture/Aspect';
import Context from '../components/Architecture/Context';
import Radar from '../components/Techradar/Main';
import Technology from '../components/Techradar/Technology';
import Problems from '../components/Problems/Problems';
import ComponentsMindmap from '../components/Mindmap/ComponentsMindmap';
import AspectsMindmap from '../components/Mindmap/AspectsMindmap';
import gateway from '../idea/gateway';
import Empty from '../components/Controls/Empty';
import DevTool from '../components/JSONata/DevTool';

Vue.use(Router);

let middleware = (route) => {
	if (config.oauth !== false && !window.Vuex.state.isOAuthProcess && !window.Vuex.state.access_token) {
		window.location = new URL(
			`/oauth/authorize?client_id=${config.oauth.APP_ID}`
            + '&redirect_uri=' + new URL(consts.pages.OAUTH_CALLBACK_PAGE, window.location)
            + `&response_type=code&state=none&scope=${config.oauth.REQUESTED_SCOPES}`
            + '&' + Math.floor(Math.random() * 10000)
			, config.gitlab_server
		);
	}

	return route.params;
};

const rConfig = {
	scrollBehavior() {
		window.scrollTo(0, 0);
	},    
	routes: [
		{
			name: 'main',
			path: '/main',
			component: Main,
			props: middleware
		},
		{
			name: 'conditions',
			path: '/diff/:source/:target',
			component: Conditions,
			props: middleware
		},
		{
			name: 'diff',
			path: '/diff/:source/:target/:mode',
			component: DiffViewer,
			props: middleware
		},
		{
			name: 'doc',
			path: '/docs/:document',
			component: Doc,
			props: middleware
		},
		{
			name: 'architect',
			path: '/architect',
			component: ComponentsMindmap,
			props: middleware
		},
		{
			name: 'aspects',
			path: '/aspects',
			component: AspectsMindmap,
			props: middleware
		},
		{
			name: 'contexts',
			path: '/architect/contexts/:context',
			component: Context,
			props: middleware
		},
		{
			name: 'component',
			path: '/architect/components/:component',
			component: Component,
			props: middleware
		},
		{
			name: 'aspect',
			path: '/architect/aspects/:aspect',
			component: Aspect,
			props: middleware
		},
		{
			name: 'radar',
			path: '/techradar',
			component: Radar,
			props: middleware
		},
		{
			name: 'radar-section',
			path: '/techradar/:section',
			component: Radar,
			props: middleware
		},
		{
			name: 'technology',
			path: '/technology/:technology',
			component: Technology,
			props: middleware
		},
		{
			name: 'problems',
			path: '/problems/:subject',
			component: Problems,
			props: middleware
		},
		{
			name: 'problems',
			path: '/problems',
			component: Problems,
			props: middleware
		},
		{
			name: 'devtool',
			path: '/devtool',
			component: DevTool,
			props: middleware
		},
		{
			name: 'Empty',
			path: '*',
			component: Empty
		}
	]
};

if (process.env.VUE_APP_DOCHUB_MODE !== 'plugin') {
	rConfig.mode = 'history';
	rConfig.routes.push(
		{
			path: '/',
			redirect() {
				window.location = new URL('/main', window.origin);
			}
		});
	rConfig.routes.push(        
		{
			path: '/sso/gitlab/authentication',
			redirect(route) {
				const OAuthCode = Object.keys(route.query).length
					? route.query.code
					: new URLSearchParams(route.hash.substr(1)).get('code');
				if (OAuthCode) {
					window.Vuex.dispatch('onReceivedOAuthCode', OAuthCode);
					return {
						path: '/main',
						query: {},
						hash: ''
					};
				} else {
					return {
						path: '/sso/error',
						query: {},
						hash: ''
					};
				}
			}
		}
	);
} else {
	rConfig.routes.push(
		{
			path: '/url=about:blank',
			component: ComponentsMindmap
		}
	);
}

const router = new Router(rConfig);

gateway.appendListener('navigate/component', (data) => {
	router.push({ path: `/architect/components/${Object.keys(data)[0]}`});
});

gateway.appendListener('navigate/document', (data) => {
	router.push({ path: `/docs/${Object.keys(data)[0]}`});
});

gateway.appendListener('navigate/aspect', (data) => {
	router.push({ path: `/architect/aspects/${Object.keys(data)[0]}`});
});

gateway.appendListener('navigate/context', (data) => {
	router.push({ path: `/architect/contexts/${Object.keys(data)[0]}`});
});

export default router;
