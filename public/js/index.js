// Typewriting effect
class TxtType {
	constructor(el, toRotate, period) {
		this.toRotate = toRotate;
		this.el = el;
		this.loopNum = 0;
		this.period = parseInt(period, 10) || 2000;
		this.txt = '';
		this.tick();
		this.isDeleting = false;
	}

	tick() {
		const i = this.loopNum % this.toRotate.length;
		const fullTxt = this.toRotate[i];

		if (this.isDeleting) {
			this.txt = fullTxt.substring(0, this.txt.length - 1);
		} else {
			this.txt = fullTxt.substring(0, this.txt.length + 1);
		}

		this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

		let delta = 200 - Math.random() * 100;

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

		setTimeout(() => this.tick(), delta);
	}
}

window.onload = function () {
	const elements = document.getElementsByClassName('typewrite');
	for (let i = 0; i < elements.length; i++) {
		const toRotate = elements[i].getAttribute('data-type');
		const period = elements[i].getAttribute('data-period');
		if (toRotate) {
			new TxtType(elements[i], JSON.parse(toRotate), period);
		}
	}

	// INJECT CSS
	const css = document.createElement('style');
	css.type = 'text/css';
	css.innerHTML = '.typewrite > .wrap { border-right: 0.06em solid #a04cff}';
	document.body.appendChild(css);
};

document.addEventListener('DOMContentLoaded', function () {
	// disabling or enabling particles
	function updateParticlesDisplay() {
		const particlesHidden = localStorage.getItem('particlesHidden');
		const particlesCanvas = document.querySelector(
			'.particles-js-canvas-el'
		);
		if (particlesCanvas) {
			particlesCanvas.style.display =
				particlesHidden === 'true' ? 'none' : 'block';
		}
	}

	if (localStorage.getItem('particlesHidden') === null) {
		localStorage.setItem('particlesHidden', 'false');
	}

	updateParticlesDisplay();

	const toggleButton = document.querySelector('.particlesYesNo');
	if (toggleButton) {
		toggleButton.addEventListener('click', () => {
			const currentState = localStorage.getItem('particlesHidden');
			const newState = currentState === 'true' ? 'false' : 'true';
			localStorage.setItem('particlesHidden', newState);
			updateParticlesDisplay();
		});
	}

	window.addEventListener('storage', event => {
		if (
			event.key === 'particlesHidden' &&
			event.newValue !== event.oldValue
		) {
			updateParticlesDisplay();
		}
	});
});

if (window.location.pathname === '/&') {
	// UV INPUT FORM
	const address1 = document.getElementById('gointospace');
	const address2 = document.getElementById('gointospace2');

	const proxySetting = localStorage.getItem('proxy') ?? 'uv'; // Using nullish coalescing operator for default value

	const swConfig = {
		uv: { file: '/!/sw.js', config: __uv$config }
	};

	const { file: swFile, config: swConfigSettings } = swConfig[
		proxySetting
	] ?? {
		file: '/uv',
		config: __uv$config
	};

	const urlPattern = new RegExp(
		'^(https?:\\/\\/)?' +
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
			'((\\d{1,3}\\.){3}\\d{1,3}))' +
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
			'(\\?[;&a-z\\d%_.~+=-]*)?' +
			'(\\#[-a-z\\d_]*)?$',
		'i'
	);

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
			const url = new URL(
				input.includes('://') ? input : `http://${input}`
			);
			return url.toString();
		} else {
			return searchTemplate.replace('%s', encodeURIComponent(input));
		}
	}

	function executeSearch(query) {
		const encodedUrl =
			swConfigSettings.prefix + __uv$config.encodeUrl(search(query));
		localStorage.setItem('input', query);
		localStorage.setItem('output', encodedUrl);
		document.querySelectorAll('.spinnerParent')[0].style.display = 'block';
		document.querySelectorAll('.spinner')[0].style.display = 'block';
		document.getElementById('gointospace').style.display = 'none';
		document.querySelectorAll('.search-header__icon')[0].style.display =
			'none';
		const iframe = document.getElementById('intospace');
		iframe.src = encodedUrl;
		iframe.style.display = 'block';

		if (iframe.src) {
			document.querySelector('.shortcuts').style.display = 'none';
		}

		document.querySelectorAll('input').forEach(input => input.blur());
		iframe.addEventListener(
			'load',
			function () {
				document.getElementById('gointospace2').style.paddingLeft =
					'40px';
			},
			{ once: true }
		);

		// make check for uv error
		iframe.addEventListener('load', function () {
			const iframeDocument =
				iframe.contentDocument || iframe.contentWindow.document;
			const errorList = iframeDocument.querySelectorAll('ul li');
			if (
				errorList &&
				Array.from(errorList).some(
					li =>
						li.textContent.trim() ===
						'Checking your internet connection'
				)
			) {
				iframe.src = '/500';
			}

			startURLMonitoring();
		});
	}

	function startURLMonitoring() {
		const iframe = document.getElementById('intospace');
		let lastUrl = iframe.contentWindow.location.href;

		const checkIframeURL = () => {
			try {
				const currentUrl = iframe.contentWindow.location.href;
				if (currentUrl !== lastUrl) {
					// console.log('url changed to:', currentUrl);
					lastUrl = currentUrl;
					updateGointospace2(currentUrl);
				}
			} catch (e) {
				console.log('Error getting iframe url:', e);
			}
		};

		setInterval(checkIframeURL, 250);
	}

	function updateGointospace2(url) {
		let cleanedUrl = __uv$config.decodeUrl(url.split('/!/space/').pop());
		let isSecure = cleanedUrl.startsWith('https://');

		cleanedUrl = cleanedUrl.replace(/^https?:\/\//, '');

		address2.value = cleanedUrl;

		let webSecurityIcon = document.querySelector('.webSecurityIcon');
		if (isSecure) {
			webSecurityIcon.id = 'secure';
			webSecurityIcon.innerHTML =
				'<span class="material-icons" style="font-size: 20px !important; height: 16px !important; width: 16px !important; padding: 0 !important; background-color: transparent !important;">lock</span>';
		} else {
			webSecurityIcon.id = 'notSecure';
			webSecurityIcon.innerHTML =
				'<span class="material-icons" style="font-size: 20px !important; height: 16px !important; width: 16px !important; padding: 0 !important; background-color: transparent !important;">lock_open</span>';
		}
	}

	address2.addEventListener('click', function () {
		let currentValue = this.value;

		if (
			!currentValue.startsWith('http://') &&
			!currentValue.startsWith('https://') &&
			intospace.src
		) {
			this.value = 'https://' + currentValue;
		}

		this.select();
	});

	address2.addEventListener('blur', function () {
		let currentValue = this.value;

		if (
			currentValue.startsWith('http://') ||
			currentValue.startsWith('https://')
		) {
			this.value = currentValue.replace(/^https?:\/\//, '');
		}
	});

	const refreshButton = document.querySelector('.refreshButton');
	const homeButton = document.querySelector('.homeButton');
	const fullscreenButton = document.querySelector('.fullscreenButton');

	refreshButton.addEventListener('click', function () {
		iframe.contentWindow.location.reload();
	});

	homeButton.addEventListener('click', function () {
		window.location.href = '/&';
	});

	fullscreenButton.addEventListener('click', () => {
		if (document.fullscreenElement) {
			document.exitFullscreen?.() ||
				document.mozCancelFullScreen?.() ||
				document.webkitExitFullscreen?.() ||
				document.msExitFullscreen?.();
		} else {
			const requestFullscreen = element => {
				element.requestFullscreen?.() ||
					element.mozRequestFullScreen?.() ||
					element.webkitRequestFullscreen?.() ||
					element.msRequestFullscreen?.();
			};

			if (!iframe.src || iframe.src === 'about:blank') {
				requestFullscreen(document.documentElement);
			} else {
				requestFullscreen(iframe);
			}
		}
	});

	document.addEventListener('fullscreenchange', () => {
		if (!document.fullscreenElement) {
			fullscreenButton.innerText = 'fullscreen';
		} else {
			fullscreenButton.innerText = 'fullscreen_exit';
		}
	});

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register(swFile, { scope: swConfigSettings.prefix })
			.then(async registration => {
				// console.log('ServiceWorker registration successful with scope: ', registration.scope);
				if (address1) {
					address1.addEventListener('keydown', function (event) {
						if (event.key === 'Enter') {
							event.preventDefault();
							let query = address1.value;
							executeSearch(query);
						}
					});
				}
				if (address2) {
					address2.addEventListener('keydown', function (event) {
						if (event.key === 'Enter') {
							event.preventDefault();
							let query = address2.value;
							executeSearch(query);
						}
					});
				}
			})
			.catch(error => {
				console.error('ServiceWorker registration failed:', error);
			});
	}

	// Make it so that if the user goes to /&?q= it searches it, I think it works
	window.onload = function () {
		const urlParams = new URLSearchParams(window.location.search);
		const queryParam = urlParams.get('q');
		if (queryParam) {
			Promise.all([
				fetch('/json/g.json').then(response => response.json()),
				fetch('/json/a.json').then(response => response.json()),
				fetch('/json/shortcuts.json').then(response => response.json())
			])
				.then(([gData, aData, shortcutsData]) => {
					const data = [...gData, ...aData, ...shortcutsData];
					const item = data.find(
						d => d.name.toLowerCase() === queryParam.toLowerCase()
					);
					if (item) {
						executeSearch(item.url);
					} else {
						console.error('Param not found in json file :(');
					}
				})
				.catch(error => console.error('Error fetching json:', error));
		}

		if (queryParam) {
			document.querySelector('.utilityBar').style.display = 'none';
			document.getElementById('intospace').style.height = '100vh';
			document.getElementById('intospace').style.top = '0';
		} else {
			if (localStorage.getItem('utilBarHidden') === 'true') {
				document.querySelector('.utilityBar').style.display = 'none';
			} else {
				document.querySelector('.utilityBar').style.display = 'block';
			}
			document.getElementById('intospace').style.height =
				'calc(100% - 3.633em)';
			document.getElementById('intospace').style.top = '3.65em';
		}
	};

	const iframe = document.getElementById('intospace');
	const observer = new MutationObserver(function (mutationsList) {
		mutationsList.forEach(function (mutation) {
			if (
				mutation.type === 'attributes' &&
				mutation.attributeName === 'src'
			) {
				iframe.addEventListener(
					'load',
					function () {
						const initialUrl = iframe.contentWindow.location.href;
						updateGointospace2(initialUrl);
						startURLMonitoring();
					},
					{ once: true }
				);
			}
		});
	});
	if (iframe) {
		observer.observe(iframe, {
			attributes: true,
			attributeFilter: ['src']
		});
	}
}
