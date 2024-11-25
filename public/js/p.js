const address1 = document.getElementById('gointospace');
const address2 = document.getElementById('gointospace2');
const urlPattern = new RegExp(
	'^(https?:\\/\\/)?' +
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
		'((\\d{1,3}\\.){3}\\d{1,3}))' +
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
		'(\\?[;&a-z\\d%_.~+=-]*)?' +
		'(\\#[-a-z\\d_]*)?$',
	'i'
);

const proxySetting =
	localStorage.getItem('dropdown-selected-text-proxy') ??
	'Ultraviolet (default)';

const swConfig = {
	'Ultraviolet (default)': { file: '/@/sw.js', config: __uv$config }
};

const { file: swFile, config: swConfigSettings } = swConfig[proxySetting] ?? {
	file: '/@/sw.js',
	config: __uv$config
};

const connection = new BareMux.BareMuxConnection('/baremux/worker.js');

var defWisp =
	(location.protocol === 'https:' ? 'wss' : 'ws') +
	'://' +
	location.host +
	'/wisp/';
var wispUrl = localStorage.getItem('wisp') || defWisp;

async function setTransports() {
	const transports =
		localStorage.getItem('dropdown-selected-text-transport') || 'Libcurl';
	if (transports === 'Libcurl') {
		await connection.setTransport('/libcurl/index.mjs', [
			{ wisp: wispUrl }
		]);
	} else if (transports === 'Epoxy') {
		await connection.setTransport('/epoxy/index.mjs', [{ wisp: wispUrl }]);
	} else {
		await connection.setTransport('/libcurl/index.mjs', [
			{ wisp: wispUrl }
		]);
	}
}

function search(input) {
	input = input.trim();
	let searchTemplate;

	switch (localStorage.getItem('dropdown-selected-text-searchEngine')) {
		case 'Duck Duck Go':
			searchTemplate = 'https://duckduckgo.com/?q=%s';
			break;
		case 'Bing':
			searchTemplate = 'https://bing.com/search?q=%s';
			break;
		case 'Google (default)':
			searchTemplate = 'https://google.com/search?q=%s';
			break;
		case 'Yahoo!':
			searchTemplate = 'https://search.yahoo.com/search?p=%s';
			break;
		default:
			searchTemplate = 'https://google.com/search?q=%s';
	}

	if (urlPattern.test(input)) {
		const url = new URL(input.includes('://') ? input : `http://${input}`);
		return url.toString();
	} else {
		return searchTemplate.replace('%s', encodeURIComponent(input));
	}
}
