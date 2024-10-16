// Handles loading and rendering resources from the json files, hence json-loader.js

localforage.setItem('e', 'e');

document.addEventListener('DOMContentLoaded', () => {
	if (window.location.pathname === '/g') {
		fetch('/json/g.json')
			.then(response => response.json())
			.then(data => {
				const gameContainer = document.querySelector('.gameContain');

				data.sort((a, b) => a.name.localeCompare(b.name));

				data.forEach(game => {
					const gameLink = document.createElement('a');
					gameLink.href = `/&?q=${encodeURIComponent(game.name)}`;
					gameLink.className = 'gameAnchor';

					if (game.categories && game.name) {
						game.categories.forEach(category => {
							gameLink.id =
								(gameLink.id ? gameLink.id + ' ' : '') +
								category;
						});

						let gameNameClass = game.name
							.toLowerCase()
							.replace(/\s+/g, '-')
							.replace(/[^a-z0-9]/g, '-');
						gameLink.className += ' ' + gameNameClass;
					}

					const gameImage = document.createElement('img');
					gameImage.src = game.img;
					gameImage.alt = game.name;
					gameImage.title = game.name;
					gameImage.className = 'gameImage';

					gameImage.onerror = () => {
						gameImage.src = '/assets/default.png';
					};

					gameLink.appendChild(gameImage);
					gameContainer.appendChild(gameLink);
				});

				const gameSearchInput =
					document.querySelector('.gameSearchInput');
				gameSearchInput.addEventListener('input', () => {
					const gameImages = document.querySelectorAll('.gameImage');
					gameImages.forEach(image => {
						image.classList.add('no-animation');
					});

					const searchQuery = gameSearchInput.value
						.toLowerCase()
						.replace(/\s+/g, '-')
						.replace(/[^a-z0-9]/g, '-');

					const gameLinks =
						document.querySelectorAll('.gameContain a');
					gameLinks.forEach(link => {
						if (link.className.includes(searchQuery)) {
							link.style.display = '';
						} else {
							link.style.display = 'none';
						}
					});
				});

				document
					.querySelector('.randomBtn')
					.addEventListener('click', () => {
						const gameAnchors = Array.from(
							document.querySelectorAll('.gameAnchor')
						);
						const visibleGameAnchors = gameAnchors.filter(
							anchor => anchor.style.display !== 'none'
						);

						if (visibleGameAnchors.length > 0) {
							const randomIndex = Math.floor(
								Math.random() * visibleGameAnchors.length
							);
							visibleGameAnchors[randomIndex].click();
						} else {
							// console.log('No visible games to select.');
						}
					});
			})
			.catch(error => console.error('Error loading game :( ', error));
		const scrollToTopBtn = document.querySelector('.scrolltop');

		window.addEventListener('scroll', function () {
			if (window.scrollY === 0) {
				scrollToTopBtn.style.opacity = '0';
			} else {
				scrollToTopBtn.style.opacity = '1';
			}
		});

		scrollToTopBtn.addEventListener('click', function () {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		});
	}

	if (
		window.location.pathname === '/&' &&
		localStorage.getItem('smallIcons') === 'true'
	) {
		fetch('/json/s.json')
			.then(response => response.json())
			.then(data => {
				const shortcuts = document.querySelector('.shortcuts');

				data.forEach(shortcut => {
					const shortcutLink = document.createElement('a');

					if (shortcut.name.toLowerCase() === 'settings') {
						shortcutLink.href = '/~/#/proxy';
					} else {
						shortcutLink.href = `/&?q=${encodeURIComponent(shortcut.name)}`;
					}

					const shortcutImage = document.createElement('img');
					shortcutImage.src = shortcut.img;
					shortcutImage.alt = shortcut.name;
					shortcutImage.title = shortcut.name;
					shortcutImage.classList.add('shortcut');

					shortcutImage.style.width = '28px';
					shortcutImage.style.height = '28px';
					shortcutImage.style.padding = '11px';
					shortcutImage.style.objectFit = 'cover';
					shortcutImage.style.transition = '0.2s';

					document.querySelector('.searchEngineIcon').style.display =
						'none';
					document.querySelector(
						'.gointospaceSearchButton'
					).style.cssText =
						'transform: translate(-11px, 3px); user-select: none; cursor: default;';
					document.getElementById('formintospace').style.transform =
						'translateY(150px)';

					if (shortcut.style) {
						shortcutImage.style.cssText += shortcut.style;
					}

					if (shortcut.bg) {
						shortcutImage.style.backgroundColor = shortcut.bg;
					}

					shortcutImage.onerror = () => {
						shortcutImage.src = '/assets/default.png';
					};

					shortcutLink.appendChild(shortcutImage);
					shortcuts.appendChild(shortcutLink);
				});
			})
			.catch(error => console.error('Error loading shortcut :( ', error));
	} else if (
		window.location.pathname === '/&' &&
		(localStorage.getItem('smallIcons') === 'false' ||
			!localStorage.getItem('smallIcons'))
	) {
		fetch('/json/sb.json')
			.then(response => response.json())
			.then(data => {
				const shortcuts = document.querySelector('.shortcutsBig');

				data.forEach(shortcut => {
					const shortcutLink = document.createElement('a');

					if (shortcut.name.toLowerCase() === 'settings') {
						shortcutLink.href = '/~/#/proxy';
					} else {
						shortcutLink.href = `/&?q=${encodeURIComponent(shortcut.name)}`;
					}

					const shortcutImage = document.createElement('img');
					shortcutImage.src = shortcut.img;
					shortcutImage.alt = shortcut.name;
					shortcutImage.title = shortcut.name;
					shortcutLink.classList.add('shortcutBig');
					shortcutImage.classList.add('shortcutBigimg');

					shortcutImage.style.width = '170px';
					shortcutImage.style.height = '90px';
					shortcutImage.style.padding = '0';
					shortcutImage.style.transition = '0.2s';

					document.getElementById('gointospace').style.cssText =
						'width: 500px; text-align: left; padding: 15px; margin-right: -0.5rem; padding-left: 49.5px;';
					document.querySelector(
						'.gointospaceSearchButton'
					).style.cssText =
						'transform: translate(-34px, 3px); user-select: none; cursor: default;';

					shortcutImage.onerror = () => {
						shortcutImage.src = '/assets/default.png';
					};

					shortcutLink.appendChild(shortcutImage);
					shortcuts.appendChild(shortcutLink);
				});
			})
			.catch(error => console.error('Error loading shortcut :( ', error));
	}

	if (window.location.pathname === '/a') {
		fetch('/json/a.json')
			.then(response => response.json())
			.then(data => {
				const appsContainer = document.querySelector('.appsContainer');

				data.sort((a, b) => a.name.localeCompare(b.name));

				data.forEach(app => {
					const appLink = document.createElement('a');
					appLink.href = `/&?q=${encodeURIComponent(app.name)}`;

					if (app.categories && app.name) {
						app.categories.forEach(category => {
							appLink.id =
								(appLink.id ? appLink.id + ' ' : '') + category;
						});

						let appNameClass = app.name
							.toLowerCase()
							.replace(/\s+/g, '-')
							.replace(/[^a-z0-9]/g, '-');
						appLink.className = appNameClass;
					}

					const appImage = document.createElement('img');
					appImage.src = app.img;
					appImage.alt = app.name;
					appImage.title = app.name;
					appImage.className = 'appImage';

					appImage.onerror = () => {
						appImage.src = '/assets/default.png';
					};

					appLink.appendChild(appImage);
					appsContainer.appendChild(appLink);
				});

				const appsSearchInput =
					document.querySelector('.appsSearchInput');
				appsSearchInput.addEventListener('input', () => {
					const appsImages = document.querySelectorAll('.appImage');
					appsImages.forEach(image => {
						image.classList.add('no-animation');
					});

					const searchQuery = appsSearchInput.value
						.toLowerCase()
						.replace(/\s+/g, '-')
						.replace(/[^a-z0-9]/g, '-');

					const appLinks =
						document.querySelectorAll('.appsContainer a');
					appLinks.forEach(link => {
						if (link.className.includes(searchQuery)) {
							link.style.display = '';
						} else {
							link.style.display = 'none';
						}
					});
				});
			})
			.catch(error => console.error('Error loading app :( ', error));

		const scrollToTopBtn = document.querySelector('.scrolltop');

		window.addEventListener('scroll', function () {
			if (window.scrollY === 0) {
				scrollToTopBtn.style.opacity = '0';
			} else {
				scrollToTopBtn.style.opacity = '1';
			}
		});

		scrollToTopBtn.addEventListener('click', function () {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		});
	}
});
