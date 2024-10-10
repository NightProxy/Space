// c.js stands for config.js. These are global configs that should be loaded on every page

localforage.setItem('e', 'e');

// fancy animation
function setupObserver(selector) {
	const observer = new MutationObserver(function (mutationsList) {
		mutationsList.forEach(function (mutation) {
			if (mutation.type === 'childList') {
				const contentElements = document.querySelectorAll(selector);
				if (contentElements.length > 0) {
					contentElements.forEach((contentElement, index) => {
						let animationDelay;

						if (pathname.includes('~')) {
							animationDelay = (index * 0.1).toFixed(2);
						} else if (pathname === '/g' || pathname === '/a') {
							animationDelay = (index * 0.04).toFixed(2);
						} else if (pathname === '/&') {
							animationDelay = (index * 0.05).toFixed(2);
						} else {
							animationDelay = (index * 0.1).toFixed(2);
						}

						contentElement.style.animationDelay = `${animationDelay}s`;
						contentElement.addEventListener('animationend', () => {
							contentElement.classList.add('no-animation2');
						});
					});
				}
			}
		});
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});

	function handleURLChange() {
		const contentElements = document.querySelectorAll(selector);
		contentElements.forEach(contentElement => {
			contentElement.classList.remove('no-animation2');
		});
	}

	window.addEventListener('popstate', handleURLChange);
	window.addEventListener('hashchange', handleURLChange);
	handleURLChange();
}

function initializeObservers() {
	setupObserver('.settingsection1');
	setupObserver('.settingsection2');
	setupObserver('.settingsection3');
	setupObserver('.settingsection4');
	setupObserver('.settingsection5');
	setupObserver('.settingsection6');
	setupObserver('.settingsection7');
	setupObserver('.settingsection8');
	setupObserver('.settingsection9');
	setupObserver('.settingsection10');
	setupObserver('.settingsection11');
}

const pathname = window.location.pathname;

if (pathname.includes('~')) {
	const ul = document.querySelector('.sideSnav');
	if (ul) {
		const lis = ul.querySelectorAll('li');
		ul.style.opacity = '1';
		lis.forEach((li, index) => {
			li.style.transitionDelay = `${index * 0.1}s`;
			setTimeout(() => {
				li.style.transform = 'rotateX(0)';
			}, 0);
		});
		setTimeout(function () {
			lis.forEach((li, index) => {
				li.setAttribute('style', 'transform: rotateX(0)');
			});
		}, 1000);
	}

	initializeObservers();
} else if (pathname === '/g') {
	setupObserver('.gameImage');
} else if (pathname === '/a') {
	setupObserver('.appImage');
} else if (pathname === '/&') {
	setupObserver('.shortcut');
	setupObserver('.shortcutBigimg');
}

function isInLocalStorage(key) {
	return localStorage.getItem(key) !== null;
}

const currentLocation = window.location.href;
document.addEventListener('DOMContentLoaded', function () {
	// Cloaking
	if (
		currentLocation !== 'about:blank' ||
		window.parent.location.href !== 'about:blank' ||
		!currentLocation.includes('blob:')
	) {
		const launchType = localStorage.getItem('launchType');

		if (launchType === 'blob') {
			setTimeout(() => {
				if (window === window.top) {
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
		  <script>
    let CLF_config = {
        app_id: "163a312a-7cde-41ab-a80c-cb4cf281efdf",
        data: {
            user_id: '123456', // required
            user_email: 'user@email.com', // required
            user_name: 'User Name', // optional
            custom_data: {
                'JobRole': 'CEO', // optional
                'Plan': 'Pro', // optional
                'teamMates': '4', // optional
                'MonthlySpend': '50 USD' // optional
            }
        }
    };
</script>
<script async src="https://widget.changelogfy.com/index.js"></script>
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

					const tabCloak = localStorage.getItem(
						'dropdown-selected-text-tabCloak'
					);

					switch (tabCloak) {
						case 'None (Default)':
							window.location.href = 'https://google.com';
							break;
						case 'Google Classroom':
							window.location.href =
								'https://classroom.google.com';
							break;
						case 'Schoology':
							window.location.href =
								'https://app.schoology.com/home';
							break;
						case 'Desmos':
							window.location.href =
								'https://www.desmos.com/calculator';
							break;
						case 'Google Drive':
							window.location.href = 'https://drive.google.com';
							break;
						case 'Kahn Academy':
							window.location.href =
								'https://www.khanacademy.org/';
							break;
						case 'Quizlet':
							window.location.href = 'https://quizlet.com/';
							break;
						default:
							window.location.href = 'https://google.com';
							break;
					}
				}
				}
			}, 500);
		} else if (launchType === 'aboutBlank') {
			setTimeout(() => {
				  if (window === window.top) {
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
				const selectedTab =
					localStorage.getItem('dropdown-selected-text-tabCloak') ||
					'None (Default)';

				const urlMap = {
					'None (Default)': 'https://google.com',
					'Google Classroom': 'https://classroom.google.com',
					Schoology: 'https://app.schoology.com/home',
					Desmos: 'https://www.desmos.com/calculator',
					'Google Drive': 'https://drive.google.com',
					'Kahn Academy': 'https://www.khanacademy.org/',
					Quizlet: 'https://quizlet.com/'
				};

				const redirectTo = urlMap[selectedTab] || 'https://google.com';

				if (window.parent !== window) {
					window.parent.location.href = redirectTo;
				} else {
					window.location.href = redirectTo;
				}
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
	};

	function setCloak(cloak) {
		if (cloaks[cloak]) {
			document.title = cloaks[cloak].title;
			window.parent.document.title = cloaks[cloak].title;

			let link =
				document.querySelector("link[rel*='icon']") ||
				document.createElement('link');
			link.type = 'image/x-icon';
			link.rel = 'shortcut icon';
			link.href = cloaks[cloak].favicon;
			document.getElementsByTagName('head')[0].appendChild(link);

			let parentLink =
				window.parent.document.querySelector("link[rel*='icon']") ||
				window.parent.document.createElement('link');
			parentLink.type = 'image/x-icon';
			parentLink.rel = 'shortcut icon';
			parentLink.href = cloaks[cloak].favicon;
			window.parent.document
				.getElementsByTagName('head')[0]
				.appendChild(parentLink);
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
			const selectedText = localStorage.getItem(
				'dropdown-selected-text-tabCloak'
			);

			switch (selectedText) {
				case 'None (Default)':
					window.location.href = 'https://google.com';
					break;
				case 'Google Classroom':
					window.location.href = 'https://classroom.google.com';
					break;
				case 'Schoology':
					window.location.href = 'https://app.schoology.com/home';
					break;
				case 'Desmos':
					window.location.href = 'https://www.desmos.com/calculator';
					break;
				case 'Google Drive':
					window.location.href = 'https://drive.google.com';
					break;
				case 'Kahn Academy':
					window.location.href = 'https://www.khanacademy.org/';
					break;
				case 'Quizlet':
					window.location.href = 'https://quizlet.com/';
					break;
				default:
					window.location.href = 'https://google.com';
					break;
			}
		}
	}

	document.addEventListener('keydown', handlePanicKey);

	// Password Protection Keybind
	if (!localStorage.getItem('passwordKeyBind')) {
		localStorage.setItem('passwordKeyBind', '~');
	}

	function handlePasswordKey(event) {
		const passwordKeyBind = localStorage.getItem('passwordKeyBind');
		const passwordKeys = passwordKeyBind.split(',');

		if (
			passwordKeys.includes(event.key) &&
			event.target.tagName !== 'INPUT' &&
			event.target.tagName !== 'TEXTAREA' &&
			localStorage.getItem('passwordOff') === 'false' &&
			localStorage.getItem('pPassword')
		) {
			applyPasswordProtection();
		}
	}

	document.addEventListener('keydown', handlePasswordKey);
	if (!localStorage.getItem('isPasswordScreenOpen')) {
		localStorage.setItem('isPasswordScreenOpen', 'false');
	}

	if (localStorage.getItem('isPasswordScreenOpen') !== 'false') {
		setTimeout(applyPasswordProtection, 500);
	}

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
		if (
			localStorage.getItem('passwordOff') === 'false' &&
			!document.querySelector('.passwordOverlay')
		) {
			document.body.style.pointerEvents = 'none';
			document.body.style.cursor = 'not-allowed';
			document.body.style.userSelect = 'none';

			const overlay = document.createElement('div');
			overlay.className = 'passwordOverlay';
			overlay.style.width = '100%';
			overlay.style.height = '100%';
			overlay.style.animation = 'fade-in-top 0.3s ease';
			overlay.style.transition = 'all 0.3s ease';
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

			localStorage.setItem('isPasswordScreenOpen', 'true');

			input.addEventListener('keydown', function (e) {
				const storedPassword = localStorage.getItem('pPassword');
				if (e.key === 'Enter') {
					if (checkPassword(input.value, storedPassword)) {
						overlay.style.animation = 'fade-out-bottom 0.3s';
						setTimeout(() => {
							overlay.remove();
						}, 300);
						document.body.style.pointerEvents = '';
						document.body.style.cursor = '';
						document.body.style.userSelect = '';
						localStorage.setItem('isPasswordScreenOpen', 'false');
						protectionOpen = false;
						document.getElementById('text-1').textContent =
							'Failed';
						document.getElementById('text-2').textContent =
							'Something went wrong. Please try again.';
					} else {
						document.getElementById('text-1').textContent =
							'Password is wrong';
						document.getElementById('text-2').textContent =
							'Incorrect password. Please try again.';
						incorrectPassword();
					}
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

	function incorrectPassword() {
		toast = document.querySelector('.failtoast');
		(closeIcon = document.querySelector('.failclose')),
			(progress = document.querySelector('.failprogress'));

		let timer1, timer2;
		toast.classList.add('active');
		progress.classList.add('active');

		timer1 = setTimeout(() => {
			toast.classList.remove('active');
		}, 5000);

		timer2 = setTimeout(() => {
			progress.classList.remove('active');
		}, 5300);

		closeIcon.addEventListener('click', () => {
			toast.classList.remove('active');

			setTimeout(() => {
				progress.classList.remove('active');
			}, 300);

			clearTimeout(timer1);
			clearTimeout(timer2);
		});

		panicKeyInput.value = localStorage.getItem('panicKeyBind');
	}

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

	setTimeout(() => {
		checkCloakTab();
	}, 500);
});
