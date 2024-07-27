document.addEventListener('DOMContentLoaded', () => {
	if (window.location.pathname === '/g') {
		fetch('g.json')
			.then(response => response.json())
			.then(data => {
				const gameContainer = document.querySelector('.gameContain');

				data.sort((a, b) => a.name.localeCompare(b.name));

				data.forEach(game => {
					const gameLink = document.createElement('a');
					gameLink.href = `/&?q=${encodeURIComponent(game.name)}`;
					const gameImage = document.createElement('img');
					gameImage.src = game.img;
					gameImage.alt = game.name;
					gameImage.title = game.name;
					gameImage.className = 'gameImage';

					gameImage.onerror = () => {
						gameImage.src = '/default.png';
					};

					gameLink.appendChild(gameImage);
					gameContainer.appendChild(gameLink);
				});
			})
			.catch(error => console.error('Error loading game :( ', error));
	}

	if (window.location.pathname === '/&') {
		fetch('shortcuts.json')
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

					if (shortcut.style) {
						shortcutImage.style.cssText += shortcut.style;
					}

					if (shortcut.bg) {
						shortcutImage.style.backgroundColor = shortcut.bg;
					}

					shortcutImage.onerror = () => {
						shortcutImage.src = '/default.png';
					};

					shortcutLink.appendChild(shortcutImage);
					shortcuts.appendChild(shortcutLink);
				});
			})
			.catch(error => console.error('Error loading shortcut :( ', error));
	}
});
