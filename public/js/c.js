/* This is basically the settings loader file, it loads the settings options,
so like cloaking, panic key, etc. the search engine isnt set here because
the code in index.js was already set. This isnt inside of index.js,
because index.js has uv logic, and because uv isnt imported on every page,
index.js fails to run on some pages. So c.js is its own import
*/

function isInLocalStorage(key) {
	return localStorage.getItem(key) !== null;
}

const currentLocation = window.location.href;
document.addEventListener('DOMContentLoaded', function () {
	// Cloaking
	if (
		currentLocation !== 'about:blank' ||
		!currentLocation.includes('blob:')
	) {
		const launchType = localStorage.getItem('launchType');

		if (launchType === 'blob') {
			setTimeout(() => {
				const currentSiteUrl = currentLocation + '?redirect=true';

				const htmlContent = `
		<html>
		  <head>
			<title>Space</title>
			<style>
			  body, html {
				margin: 0;
				padding: 0;
				width: 100%;
				height: 100%;
				overflow: hidden;
			  }
			  iframe {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				border: none;
			  }
			</style>
		  </head>
		  <body>
			<iframe src="${currentSiteUrl}"></iframe>
		  </body>
		</html>
	  `;

				const blob = new Blob([htmlContent], {
					type: 'text/html'
				});

				const blobUrl = URL.createObjectURL(blob);

				let newWindow = window.open(blobUrl);
				if (newWindow) {
					newWindow.onload = () => {
						newWindow.document.title = 'Space';
					};
					window.location.href = 'https://google.com';
				}
			}, 500);
		} else if (launchType === 'aboutBlank') {
			setTimeout(() => {
				const win = window.open();
				const url = currentLocation;
				const iframe = win.document.createElement('iframe');
				iframe.style.position = 'absolute';
				iframe.style.left = '0';
				iframe.style.top = '0';
				iframe.style.width = '100vw';
				iframe.style.height = '100vh';
				iframe.style.border = 'none';
				iframe.style.margin = '0';
				iframe.style.padding = '0';
				iframe.src = url;
				win.document.body.appendChild(iframe);
				win.document.body.style.overflow = 'hidden';
				if (window.parent !== window) {
					window.parent.location.href = 'https://google.com';
				} else {
					window.location.href = 'https://google.com';
				}
			}, 500);
		}
	}

	// Tab Cloaking
	const cloaks = {
		'None (Default)': {
			title: 'Space',
			favicon: '/assets/favicon.ico'
		},
		'Google Classroom': {
			title: 'Google Classroom',
			favicon: 'https://www.gstatic.com/classroom/favicon.png'
		},
		Schoology: {
			title: 'Schoology',
			favicon: 'https://www.powerschool.com/favicon.ico'
		},
		Desmos: {
			title: 'Desmos',
			favicon:
				'https://www.desmos.com/assets/img/apps/graphing/favicon.ico'
		},
		'Google Drive': {
			title: 'Google Drive',
			favicon:
				'https://ssl.gstatic.com/images/branding/product/2x/hh_drive_36dp.png'
		},
		'Khan Academy': {
			title: 'Khan Academy',
			favicon: 'https://www.khanacademy.org/favicon.ico'
		},
		Quizlet: {
			title: 'Quizlet',
			favicon:
				'https://quizlet.com/_next/static/media/q-twilight.e27821d9.png'
		}
		/*
		"Example Cloak": {
			title: "Example Title",
			favicon: "https://example.com/favicon.png"
		}
		*/
	};

	function setCloak(cloak) {
		if (cloaks[cloak]) {
			document.title = cloaks[cloak].title;
			const link =
				document.querySelector("link[rel*='icon']") ||
				document.createElement('link');
			link.type = 'image/x-icon';
			link.rel = 'shortcut icon';
			link.href = cloaks[cloak].favicon;
			document.getElementsByTagName('head')[0].appendChild(link);
		}
	}

	function checkCloakTab() {
		const cloakTab = localStorage.getItem(
			'dropdown-selected-text-tabCloak'
		);
		if (!cloakTab) {
			localStorage.setItem(
				'dropdown-selected-text-tabCloak',
				'None (Default)'
			);
		} else if (cloaks[cloakTab]) {
			setCloak(cloakTab);
		}
	}

	checkCloakTab();

	window.addEventListener('storage', function (event) {
		if (event.key === 'dropdown-selected-text-tabCloak') {
			checkCloakTab();
		}
	});

	const dummyElement = document.createElement('div');
	dummyElement.id = 'localStorageObserver';
	dummyElement.style.display = 'none';
	document.body.appendChild(dummyElement);

	function updateDummyElement() {
		dummyElement.setAttribute(
			'data-cloakTab',
			localStorage.getItem('dropdown-selected-text-tabCloak')
		);
	}

	const observer = new MutationObserver(checkCloakTab);
	observer.observe(dummyElement, { attributes: true });

	updateDummyElement();
	window.addEventListener('storage', updateDummyElement);

	const originalSetItem = localStorage.setItem;
	localStorage.setItem = function (key, value) {
		originalSetItem.apply(this, arguments);
		if (key === 'dropdown-selected-text-tabCloak') {
			updateDummyElement();
		}
	};

	// Panic Key
	if (!localStorage.getItem('panicKeyBind')) {
		localStorage.setItem('panicKeyBind', '`');
	}

	function handlePanicKey(event) {
		const panicKeyBind = localStorage.getItem('panicKeyBind');
		const panicKeys = panicKeyBind.split(',');

		if (
			panicKeys.includes(event.key) &&
			event.target.tagName !== 'INPUT' &&
			event.target.tagName !== 'TEXTAREA'
		) {
			window.location.href = 'https://google.com';
		}
	}

	document.addEventListener('keydown', handlePanicKey);

	// Password Protection
	function base64Encode(str) {
		return btoa(str);
	}

	function xorEncode(str, key) {
		let result = '';
		for (let i = 0; i < str.length; i++) {
			result += String.fromCharCode(str.charCodeAt(i) ^ key);
		}
		return result;
	}

	function checkPassword(inputPassword, storedPassword) {
		const key = 42;
		const encodedPassword = xorEncode(base64Encode(inputPassword), key);
		return encodedPassword === storedPassword;
	}

	function applyPasswordProtection() {
		if (localStorage.getItem('passwordProtected') === 'true') {
			document.body.style.pointerEvents = 'none';
			document.body.style.cursor = 'not-allowed';
			document.body.style.userSelect = 'none';

			const overlay = document.createElement('div');
			overlay.style.width = '100%';
			overlay.style.height = '100%';
			overlay.style.backgroundColor = 'transparent';
			overlay.style.backdropFilter = 'blur(6px)';
			overlay.style.position = 'absolute';
			overlay.style.zIndex = '99999999999999999';
			overlay.style.pointerEvents = 'auto';
			overlay.style.cursor = 'auto';
			overlay.style.userSelect = 'auto';

			const content = document.createElement('div');
			content.style.transform = 'translate(-50%, -50%)';
			content.style.left = '50%';
			content.style.top = '50%';
			content.style.position = 'fixed';
			content.style.zIndex = '99999999999999999';

			const heading = document.createElement('h1');
			heading.style.textAlign = 'center';
			heading.style.marginBottom = '5px';
			heading.style.fontFamily = "'DM Sans'";
			heading.style.fontWeight = '200';
			heading.style.letterSpacing = '4px';
			heading.textContent = 'Password';
			heading.style.zIndex = '99999999999999999';

			const pgroup = document.createElement('div');
			pgroup.className = 'pgroup';

			const svg = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'svg'
			);
			svg.setAttribute('stroke', 'currentColor');
			svg.setAttribute('stroke-width', '1.5');
			svg.setAttribute('viewBox', '0 0 24 24');
			svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			svg.classList.add('picon');

			const path = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'path'
			);
			path.setAttribute(
				'd',
				'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'
			);
			path.setAttribute('stroke-linejoin', 'round');
			path.setAttribute('stroke-linecap', 'round');
			svg.appendChild(path);

			const input = document.createElement('input');
			input.className = 'password';
			input.type = 'password';
			input.placeholder = 'Password';

			input.addEventListener('input', function () {
				const storedPassword = localStorage.getItem('pPassword');
				if (checkPassword(input.value, storedPassword)) {
					overlay.remove();
					document.body.style.pointerEvents = '';
					document.body.style.cursor = '';
					document.body.style.userSelect = '';
					localStorage.setItem('passwordProtected', 'false');
					protectionOpen = false; // Reset protection state
				}
			});

			pgroup.appendChild(svg);
			pgroup.appendChild(input);

			content.appendChild(heading);
			content.appendChild(pgroup);
			overlay.appendChild(content);
			document.body.prepend(overlay);
		}
	}

	// add logic here later maybe
	if (localStorage.getItem('passwordProtected') === 'true') {
		// applyPasswordProtection();
	}
});
