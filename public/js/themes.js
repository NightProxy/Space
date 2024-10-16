let selectedTheme =
	localStorage.getItem('dropdown-selected-text-themes') || 'Default';
selectedTheme = selectedTheme.replace(/ /g, '');
selectedTheme = selectedTheme.replace(/-/g, '');
selectedTheme = selectedTheme.toLowerCase();
document.body.classList.add(selectedTheme);
