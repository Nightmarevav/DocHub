import gitlab from './gitlab';
import requests from './requests';

export default {
	urlFromProfile(profile, baseURI) {
		let result = null;
		const transport = (profile.transport || 'default').toLowerCase();
		if (transport === 'gitlab') {
			result = gitlab.makeFileURI(profile.project_id, profile.source, profile.branch, 'raw');
		} else if (transport === 'http') {
			result = profile.source;
		} else {
			const source = requests.makeURL(profile.source, baseURI || (window.origin + '/'));
			result = source.url;
		}
		return result ? result.toString() : '';
	}
};
