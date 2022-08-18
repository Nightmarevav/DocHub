// import '../node_modules/@mdi/font/css/materialdesignicons.css'
import '@mdi/font/css/materialdesignicons.css';
// See icons https://fonts.google.com/icons?selected=Material+Icons
import Axios from 'axios';
import Vue from 'vue';
import VueCookie from 'vue-cookie';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import Root from './components/Root.vue';
import router from './router';

import Aspect from './components/Architecture/Aspect.vue';
import Component from './components/Architecture/Component.vue';
import Context from './components/Architecture/Context.vue';
import DocHubDoc from './components/Docs/DocHubDoc.vue';
import PlantUML from './components/Schema/PlantUML.vue';
import Radar from './components/Techradar/Main.vue';
import Technology from './components/Techradar/Technology.vue';
import Anchor from './components/Tools/Anchor.vue';
import Image from './components/Tools/Image.vue';
import GlobalMixin from './mixins/global';
import gitlab from './storage/gitlab';

import 'swagger-ui/dist/swagger-ui.css';
import 'vuetify/dist/vuetify.min.css';

import '@/assets/styles/main.css';

window.Vue = Vue;
window.Router = router;

Vue.use(Vuex);
Vue.use(Vuetify);
Vue.use(VueCookie);

Vue.prototype.$axios = Axios;
Vuex.Store.prototype.$axios = Axios;

let store = new Vuex.Store(gitlab);
window.Vuex = store;
store.dispatch('init');

Vue.component('DochubDoc', DocHubDoc);
Vue.component('DochubContext', Context);
Vue.component('DochubComponent', Component);
Vue.component('DochubAspect', Aspect);
Vue.component('DochubAnchor', Anchor);
Vue.component('DochubImage', Image);
Vue.component('DochubTechnology', Technology);
Vue.component('DochubRadar', Radar);
Vue.component('DochubPlantuml', PlantUML);

Vue.mixin(GlobalMixin);
Vue.config.ignoredElements = ['asyncapi-component'];

const vuetify = new Vuetify({
	icons: {
		iconfont: 'mdi'
	}
});

new Vue({
	router,
	render(createElement) {
		return createElement(Root);
	},
	vuetify,
	store
}).$mount('#app');
