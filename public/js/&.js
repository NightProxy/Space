// & is the name of the proxy page, so &.js is the js for the proxy page minus the actual proxy code, because thats long enough to cause readability issues

let encodedUrl = '';
async function executeSearch(query) {
	encodedUrl = swConfigSettings.prefix + __uv$config.encodeUrl(search(query));
	localStorage.setItem('input', query);
	localStorage.setItem('output', encodedUrl);
	document.querySelectorAll('.spinnerParent')[0].style.display = 'block';
	document.querySelectorAll('.spinner')[0].style.display = 'block';
	document.getElementById('gointospace').style.display = 'none';
	const iframe = document.getElementById('intospace');
	await registerSW();
	iframe.src = encodedUrl;
	await registerSW().then(async () => {
		await setTransports();
		setTimeout(() => {
			iframe.src = iframe.src;
		}, 100);
	});
	iframe.style.display = 'block';

	if (iframe.src) {
		document.querySelector('.shortcuts').style.display = 'none';
		document.querySelector('.shortcutsBig').style.display = 'none';
	}

	document.querySelectorAll('input').forEach(input => input.blur());

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

let historyArray = JSON.parse(localStorage.getItem('historyArray')) || [];
let currentIndex = parseInt(localStorage.getItem('currentIndex')) || -1;

if (historyArray.length > 0) {
	currentIndex = historyArray.length;
	saveHistory();
}

function saveHistory() {
	localStorage.setItem('historyArray', JSON.stringify(historyArray));
	localStorage.setItem('currentIndex', currentIndex.toString());
}

function startURLMonitoring() {
	const iframe = document.getElementById('intospace');
	let lastUrl = iframe.contentWindow.location.href;

	const checkIframeURL = () => {
		try {
			const currentUrl = iframe.contentWindow.location.href;
			if (currentUrl !== lastUrl) {
				lastUrl = currentUrl;

				if (historyArray[currentIndex] !== currentUrl) {
					// if the user navigates while in history, it clears the history after
					historyArray = historyArray.slice(0, currentIndex + 1);
					historyArray.push(currentUrl);
					currentIndex++;
					saveHistory();
				}

				devToggle = false;
				erudaScriptLoaded = false;
				erudaScriptInjecting = false;
				console.log('Iframe navigation detected, Eruda toggle reset.');

				updateGointospace2(currentUrl);
				updateButtonStates();
			}
		} catch (e) {
			console.log('Error getting iframe url:', e);
		}
	};

	setInterval(checkIframeURL, 250);
}

function updateGointospace2(url) {
	document.querySelectorAll('.search-header__icon')[0].style.display = 'none';

	let cleanedUrl = __uv$config.decodeUrl(
		url.split(swConfigSettings.prefix).pop()
	);

	let isSecure = cleanedUrl.startsWith('https://');

	cleanedUrl = cleanedUrl.replace(/^https?:\/\//, '');

	if (cleanedUrl === 'a`owt8bnalk') {
		address2.value = 'Loading...';
	} else if (__uv$config.decodeUrl(cleanedUrl).endsWith('/500')) {
		address2.value = 'Internal Server Error! Did you load a broken link?';
	} else {
		address2.value = cleanedUrl;
	}

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
		intospace.src &&
		currentValue != 'Internal Server Error! Did you load a broken link?' &&
		currentValue != 'Loading...'
	) {
		let isSecure = __uv$config
			.decodeUrl(
				iframe.contentWindow.location.href
					.split(swConfigSettings.prefix)
					.pop()
			)
			.startsWith('https://');
		if (isSecure) {
			this.value = 'https://' + currentValue;
		} else {
			this.value = 'http://' + currentValue;
		}
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
const backButton = document.querySelector('.backButton');
const forwardButton = document.querySelector('.forwardButton');

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

backButton.addEventListener('click', function () {
	if (currentIndex > 0) {
		currentIndex--;
		iframe.src = historyArray[currentIndex];
		iframe.style.display = 'block';
		setTimeout(() => {
			document.getElementById('gointospace2').style.paddingLeft = '40px';
		}, 250);
		updateButtonStates();
		saveHistory();
	}
});

forwardButton.addEventListener('click', function () {
	if (currentIndex < historyArray.length - 1) {
		currentIndex++;
		iframe.src = historyArray[currentIndex];
		iframe.style.display = 'block';
		setTimeout(() => {
			document.getElementById('gointospace2').style.paddingLeft = '40px';
		}, 250);
		updateButtonStates();
		saveHistory();
	}
});

function updateButtonStates() {
	if (currentIndex > 0) {
		backButton.style.opacity = '1';
		backButton.style.cursor = 'pointer';
	} else {
		backButton.style.opacity = '0.5';
		backButton.style.cursor = 'default';
	}

	if (currentIndex < historyArray.length - 1) {
		forwardButton.style.opacity = '1';
		forwardButton.style.cursor = 'pointer';
	} else {
		forwardButton.style.opacity = '0.5';
		forwardButton.style.cursor = 'default';
	}
}
async function registerSW() {
	if ('serviceWorker' in navigator) {
		await setTransports();
		await navigator.serviceWorker
			.register(swFile, { scope: swConfigSettings.prefix })
			.catch(error => {
				console.error('ServiceWorker registration failed:', error);
			});
	}
}
// register event listeners for shit
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
// Make it so that if the user goes to /&?q= it searches it
document.addEventListener('DOMContentLoaded', function () {
	const urlParams = new URLSearchParams(window.location.search);
	const queryParam = urlParams.get('q');
	if (queryParam) {
		Promise.all([
			fetch('/json/g.json').then(response => response.json()),
			fetch('/json/a.json').then(response => response.json()),
			fetch('/json/s.json').then(response => response.json())
		])
			.then(([gData, aData, shortcutsData]) => {
				let data = [];
				let source = '';

				if (
					gData.some(
						d => d.name.toLowerCase() === queryParam.toLowerCase()
					)
				) {
					data = gData;
					source = 'g';
				} else if (
					aData.some(
						d => d.name.toLowerCase() === queryParam.toLowerCase()
					)
				) {
					data = aData;
					source = 'a';
				} else if (
					shortcutsData.some(
						d => d.name.toLowerCase() === queryParam.toLowerCase()
					)
				) {
					data = shortcutsData;
					source = 'shortcuts';
				}

				const item = data.find(
					d => d.name.toLowerCase() === queryParam.toLowerCase()
				);

				if (item) {
					if (source === 'g') {
						document.querySelector('.gPage').id = 'navactive';
					} else if (source === 'a') {
						document.querySelector('.aPage').id = 'navactive';
					} else {
						document.querySelector('.pPage').id = 'navactive';
					}
					executeSearch(item.url);
				} else {
					console.error('Param not found in json file :(');
				}
			})
			.catch(error => console.error('Error fetching json:', error));
		document.querySelector('.utilityBar').style.display = 'none';
		document.getElementById('intospace').style.height = '100vh';
		document.getElementById('intospace').style.top = '0';
	} else {
		if (localStorage.getItem('utilBarHidden') === 'true') {
			document.querySelector('.utilityBar').style.display = 'none';
			document.getElementById('intospace').style.height = '100%';
		} else {
			document.querySelector('.utilityBar').style.display = 'block';
			document.getElementById('intospace').style.height =
				'calc(100% - 3.633em)';
		}

		document.querySelector('.pPage').id = 'navactive';
	}
	startURLMonitoring();
	updateButtonStates();
	if (localStorage.getItem('smallIcons') === 'false') {
		switch (localStorage.getItem('dropdown-selected-text-searchEngine')) {
			case 'Duck Duck Go':
				document.querySelector('.searchEngineIcon').src =
					'/assets/imgs/b/ddg.webp';
				document.querySelector('.searchEngineIcon').style.transform =
					'scale(1.35)';
				break;
			case 'Bing':
				document.querySelector('.searchEngineIcon').src =
					'/assets/imgs/b/bing.webp';
				document.querySelector('.searchEngineIcon').style.transform =
					'scale(1.65)';
				break;
			case 'Google (default)':
				document.querySelector('.searchEngineIcon').src =
					'/assets/imgs/b/google.webp';
				document.querySelector('.searchEngineIcon').style.transform =
					'scale(1.2)';
				break;
			case 'Yahoo!':
				document.querySelector('.searchEngineIcon').src =
					'/assets/imgs/b/yahoo.webp';
				document.querySelector('.searchEngineIcon').style.transform =
					'scale(1.5)';
				break;
			default:
				document.querySelector('.searchEngineIcon').src =
					'/assets/imgs/b/google.webp';
				document.querySelector('.searchEngineIcon').style.transform =
					'scale(1.2)';
		}
	}
});

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

let devToggle = false;
let erudaScriptLoaded = false;
let erudaScriptInjecting = false;

function injectErudaScript(iframeDocument) {
	return new Promise((resolve, reject) => {
		if (erudaScriptLoaded) {
			resolve();
			return;
		}

		if (erudaScriptInjecting) {
			console.warn('Eruda script is already being injected.');
			resolve();
			return;
		}

		erudaScriptInjecting = true;

		const script = iframeDocument.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://cdn.jsdelivr.net/npm/eruda';
		script.onload = () => {
			erudaScriptLoaded = true;
			erudaScriptInjecting = false;
			resolve();
		};
		script.onerror = event => {
			erudaScriptInjecting = false;
			reject(new Error('Failed to load Eruda script:', event));
		};
		iframeDocument.body.appendChild(script);
	});
}

function injectShowScript(iframeDocument) {
	return new Promise(resolve => {
		const script = iframeDocument.createElement('script');
		script.type = 'text/javascript';
		script.textContent = `
			eruda.init({
				defaults: {
					displaySize: 50,
					transparency: 0.9,
					theme: 'Material Palenight'
				}
			});
			eruda.show();
			document.currentScript.remove();
		`;
		iframeDocument.body.appendChild(script);
		resolve();
	});
}

function injectHideScript(iframeDocument) {
	return new Promise(resolve => {
		const script = iframeDocument.createElement('script');
		script.type = 'text/javascript';
		script.textContent = `
			eruda.hide();
			document.currentScript.remove();
		`;
		iframeDocument.body.appendChild(script);
		resolve();
	});
}

function inspectelement() {
	const iframe = document.getElementById('intospace');
	if (!iframe || !iframe.contentWindow) {
		console.error(
			"Iframe not found or inaccessible. \\(°□°)/ (This shouldn't happen btw)"
		);
		return;
	}

	const iframeDocument = iframe.contentWindow.document;

	const forbiddenSrcs = ['about:blank', null, 'a%60owt8bnalk', 'a`owt8bnalk'];
	if (iframe.contentWindow.location.href.includes(forbiddenSrcs)) {
		console.warn('Iframe src is forbidden, skipping.');
		return;
	}

	if (iframe.contentWindow.document.readyState == 'loading') {
		console.warn(
			'Iframe has not finished loading, skipping Eruda injection. Be patient, jesus fuck.'
		);
		return;
	}

	injectErudaScript(iframeDocument)
		.then(() => {
			if (!devToggle) {
				injectShowScript(iframeDocument);
			} else {
				injectHideScript(iframeDocument);
			}

			devToggle = !devToggle;
		})
		.catch(error => {
			console.error('Error injecting Eruda script:', error);
		});

	iframe.contentWindow.addEventListener('unload', () => {
		devToggle = false;
		erudaScriptLoaded = false;
		erudaScriptInjecting = false;
		console.log('Iframe navigation detected, Eruda toggle reset.');
	});
}
