// Typewriting effect
var TxtType = function (el, toRotate, period) {
	this.toRotate = toRotate;
	this.el = el;
	this.loopNum = 0;
	this.period = parseInt(period, 10) || 2000;
	this.txt = '';
	this.tick();
	this.isDeleting = false;
};

TxtType.prototype.tick = function () {
	var i = this.loopNum % this.toRotate.length;
	var fullTxt = this.toRotate[i];

	if (this.isDeleting) {
		this.txt = fullTxt.substring(0, this.txt.length - 1);
	} else {
		this.txt = fullTxt.substring(0, this.txt.length + 1);
	}

	this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

	var that = this;
	var delta = 200 - Math.random() * 100;

	if (this.isDeleting) {
		delta /= 2;
	}

	if (!this.isDeleting && this.txt === fullTxt) {
		delta = this.period;
		this.isDeleting = true;
	} else if (this.isDeleting && this.txt === '') {
		this.isDeleting = false;
		this.loopNum++;
		delta = 500;
	}

	setTimeout(function () {
		that.tick();
	}, delta);
};

window.onload = function () {
	var elements = document.getElementsByClassName('typewrite');
	for (var i = 0; i < elements.length; i++) {
		var toRotate = elements[i].getAttribute('data-type');
		var period = elements[i].getAttribute('data-period');
		if (toRotate) {
			new TxtType(elements[i], JSON.parse(toRotate), period);
		}
	}
	// INJECT CSS
	var css = document.createElement('style');
	css.type = 'text/css';
	css.innerHTML = '.typewrite > .wrap { border-right: 0.06em solid #a04cff}';
	document.body.appendChild(css);

	// Handle url params, go see if q is there etc.
	const urlParams = new URLSearchParams(window.location.search);
	const queryParam = urlParams.get('q');
	if (queryParam) {
		Promise.all([
			fetch('/json/g.json').then(response => response.json()),
			fetch('/json/a.json').then(response => response.json()),
			fetch('/json/shortcuts.json').then(response => response.json())
		])
			.then(([gData, shortcutsData]) => {
				const data = [...gData, ...shortcutsData];
				const item = data.find(
					d => d.name.toLowerCase() === queryParam.toLowerCase()
				);
				if (item) {
					executeSearch(item.url);
				} else {
					console.error('No matching name found in JSON data.');
				}
			})
			.catch(error => console.error('Error fetching JSON:', error));
	}
};

// UV INPUT FORM
const address = document.getElementById('gointospace');

const proxySetting = localStorage.getItem('proxy') ?? 'uv'; // Using nullish coalescing operator for default value

const swConfig = {
	uv: { file: '/!/sw.js', config: __uv$config }
};

const { file: swFile, config: swConfigSettings } = swConfig[proxySetting] ?? {
	file: '/uv',
	config: __uv$config
};

// Search function definition
function search(input) {
	input = input.trim();
	const searchTemplate =
		localStorage.getItem('search') || 'https://google.com/search?q=%s';

	try {
		return new URL(input).toString();
	} catch (err) {
		try {
			const url = new URL(`http://${input}`);
			if (url.hostname.includes('.')) {
				return url.toString();
			}
			throw new Error('Invalid hostname');
		} catch (err) {
			return searchTemplate.replace('%s', encodeURIComponent(input));
		}
	}
}

// Make it so that if the user goes to /&?q= it searches it, I think it works
function executeSearch(query) {
	const encodedUrl =
		swConfigSettings.prefix + __uv$config.encodeUrl(search(query));
	localStorage.setItem('input', query);
	localStorage.setItem('output', encodedUrl);
	document.querySelectorAll('.spinnerParent')[0].style.display = 'block';
	document.querySelectorAll('.spinner')[0].style.display = 'block';
	document.getElementById('gointospace').style.display = 'none';
	document.querySelectorAll('.search-header__icon')[0].style.display = 'none';
	const iframe = document.getElementById('intospace');
	iframe.src = encodedUrl;
	iframe.style.display = 'block';

	if (iframe.src && window.location.pathname === '/&') {
		document.querySelector('.shortcuts').style.display = 'none';
	}

	// make check for uv error
	iframe.addEventListener('load', function () {
		const iframeDocument =
			iframe.contentDocument || iframe.contentWindow.document;
		const title = iframeDocument.title;
		const errorHeader = iframeDocument.querySelector('h1');

		if (
			title === 'Error' &&
			errorHeader &&
			errorHeader.textContent.trim() === 'This site can’t be reached'
		) {
			iframe.src = '/500';
		}
	});
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register(swFile, { scope: swConfigSettings.prefix })
		.then(async registration => {
			console.log(
				'ServiceWorker registration successful with scope: ',
				registration.scope
			);
			document
				.getElementById('gointospace')
				.addEventListener('keydown', function (event) {
					if (event.key === 'Enter') {
						event.preventDefault();
						let query =
							document.getElementById('gointospace').value;
						executeSearch(query);
					}
				});
		})
		.catch(error => {
			console.error('ServiceWorker registration failed:', error);
		});
}
