document.addEventListener('click', function (event) {
	const dropdownToggle = document.querySelector('.dropdown-toggle');
	const dropdownMenu = document.querySelector('.dropdown-menu');

	if (dropdownToggle.contains(event.target)) {
		dropdownToggle.classList.toggle('active');
		dropdownMenu.style.display =
			dropdownMenu.style.display === 'block' ? 'none' : 'block';
	} else if (dropdownMenu.contains(event.target)) {
		dropdownToggle.classList.remove('active');
		dropdownMenu.style.display = 'none';
	} else {
		dropdownToggle.classList.remove('active');
		dropdownMenu.style.display = 'none';
	}
});

function showPageFromHash() {
	let hash = window.location.hash.slice(1);
	console.log('Original hash:', hash);
	if (hash.startsWith('/')) {
		hash = hash.slice(1);
	}
	console.log('Processed hash:', hash);

	const pages = document.querySelectorAll('.scontent');
	let pageToShow = document.getElementById('blank');

	// Hide all pages
	pages.forEach(page => {
		page.style.display = 'none';
	});

	if (hash) {
		// Show the target page if it exists
		const targetPage = document.getElementById(hash);
		if (targetPage) {
			pageToShow = targetPage;
			console.log('Showing page:', targetPage);
			pageToShow.style.display = 'block';
		} else {
			console.log('No page found for hash:', hash);
		}
	} else {
		console.log('No hash found, showing blank page.');
		pageToShow.style.display = 'block';
	}

	const settingItems = document.querySelectorAll('.settingItem');
	let foundActive = false;

	// Update setting items
	settingItems.forEach(item => {
		if (item.dataset.id === hash) {
			item.classList.add('sideActive');
			foundActive = true;
		} else {
			item.classList.remove('sideActive');
		}
	});

	if (!foundActive) {
		const defaultSettingItem = document.querySelector(
			'.settingItem[data-id="blank"]'
		);
		if (defaultSettingItem) {
			defaultSettingItem.classList.add('sideActive');
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const pages = document.querySelectorAll('.scontent');
	pages.forEach(page => {
		page.style.display = 'none';
	});
	document.getElementById('blank').style.display = 'block';
	showPageFromHash();
});

window.addEventListener('load', showPageFromHash);
window.addEventListener('hashchange', showPageFromHash);

function setCheckboxState() {
	const launchType = localStorage.getItem('launchType');
	if (launchType === 'blob') {
		document.querySelector('.autoLaunchBlob').checked = true;
	} else if (launchType === 'aboutBlank') {
		document.querySelector('.autoLaunchAboutBlank').checked = true;
	}
}

function handleCheckboxChange() {
	document.querySelectorAll('.checkbox').forEach(checkbox => {
		checkbox.addEventListener('change', function () {
			if (this.checked) {
				document
					.querySelectorAll('.checkbox')
					.forEach(otherCheckbox => {
						if (otherCheckbox !== this) {
							otherCheckbox.checked = false;
						}
					});

				if (this.classList.contains('autoLaunchBlob')) {
					localStorage.setItem('launchType', 'blob');
					localStorage.removeItem('aboutBlank');
				} else if (this.classList.contains('autoLaunchAboutBlank')) {
					localStorage.setItem('launchType', 'aboutBlank');
					localStorage.removeItem('blob');
				}
			} else {
				localStorage.removeItem('launchType');
				localStorage.removeItem('blob');
				localStorage.removeItem('aboutBlank');
			}
		});
	});
}

setCheckboxState();

handleCheckboxChange();

const params = new URLSearchParams(window.location.search);
if (params.get('redirect') === 'true') {
	window.location.href = '/';
}
function launchBlob() {
	const currentSiteUrl = window.location.href + '?redirect=true';

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
	} else {
		console.error('Failed to open a new window.');
	}
}
function launchAboutBlank() {
	var win = window.open();
	var url = '/';
	var iframe = win.document.createElement('iframe');
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
	window.location.href = 'https://google.com';
}
