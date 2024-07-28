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
