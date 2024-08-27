// ~ is the settings page, so ~.js is settings specific js that wont get loaded globally

localforage.setItem('e', 'e');
shapePositions = {
	blank: '26.5px',
	plugins: '65.27px',
	performance: '103.5px',
	themes: '142px',
	proxy: '180.8px',
	ads: '219px',
	account: '278.5px',
	about: '317px',
	news: '377px'
};

document.addEventListener('click', function (event) {
	const dropdowns = document.querySelectorAll('.dropdown');

	dropdowns.forEach(function (dropdown) {
		const toggle = dropdown.querySelector('.dropdown-toggle');
		const selectedSpan = toggle.querySelector('.dropdown-selected');
		const menu = dropdown.querySelector('.dropdown-menu');
		const items = menu.querySelectorAll('li');

		if (toggle.contains(event.target)) {
			toggle.classList.toggle('active');
			menu.style.display =
				menu.style.display === 'block' ? 'none' : 'block';
		} else if (menu.contains(event.target)) {
			const selectedOption = event.target;
			if (selectedOption.tagName === 'LI') {
				const newText = selectedOption.textContent.trim();
				selectedSpan.textContent = newText;
				items.forEach(function (item) {
					item.classList.remove('hidden');
				});
				selectedOption.classList.add('hidden');
				toggle.classList.remove('active');
				menu.style.display = 'none';
				if (dropdown.classList.contains('dropdown-memory')) {
					const dropdownId = dropdown.id;
					localStorage.setItem(
						`dropdown-selected-text-${dropdownId}`,
						newText
					);
				}
			}
		} else {
			toggle.classList.remove('active');
			menu.style.display = 'none';
		}
	});
});

function showPageFromHash() {
	let hash = window.location.hash.slice(1);
	if (hash.startsWith('/')) {
		hash = hash.slice(1);
	}

	const pages = document.querySelectorAll('.scontent');
	let pageToShow = document.getElementById('blank');

	pages.forEach(page => {
		page.style.display = 'none';
	});

	if (hash) {
		const targetPage = document.getElementById(hash);
		if (targetPage) {
			pageToShow = targetPage;
			pageToShow.style.display = 'block';
		}
	} else {
		pageToShow.style.display = 'block';
	}

	const settingItems = document.querySelectorAll('.settingItem');
	let foundActive = false;

	settingItems.forEach(item => {
		if (item.dataset.id === hash) {
			shapePositions = {
				blank: '26.5px',
				plugins: '66px',
				performance: '103.5px',
				themes: '142px',
				proxy: '180px',
				ads: '217px',
				account: '277px',
				about: '315px',
				news: '375px',
				faq: '411px'
			};

			console.log(item.dataset.id);
			console.log(shapePositions);
			console.log(shapePositions[item.dataset.id]);
			item.classList.add('sideActive');
			document
				.querySelector('.settingsShape')
				.setAttribute(
					'style',
					`top: ${shapePositions[item.dataset.id]}`
				);
			console.log(item.dataset.id);
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

function setupHashChangeListener() {
	window.addEventListener('hashchange', showPageFromHash);
}

function preventDefaultLinkBehavior() {
	const settingItems = document.querySelectorAll('.settingItem');
	settingItems.forEach(item => {
		item.addEventListener('click', event => {
			event.preventDefault();
			const targetHash = item.dataset.id;
			if (targetHash) {
				window.location.hash = targetHash;
			}
		});
	});
}

setupHashChangeListener();
preventDefaultLinkBehavior();
showPageFromHash();

function setCheckboxState() {
	const launchType = localStorage.getItem('launchType');
	if (launchType === 'blob') {
		document.querySelector('.autoLaunchBlob').checked = true;
	} else if (launchType === 'aboutBlank') {
		document.querySelector('.autoLaunchAboutBlank').checked = true;
	}
}

function handleCheckboxChange() {
	document.querySelectorAll('.checkbox-blob-aboutBlank').forEach(checkbox => {
		checkbox.addEventListener('change', function () {
			if (this.checked) {
				document
					.querySelectorAll('.checkbox-blob-aboutBlank')
					.forEach(otherCheckbox => {
						if (otherCheckbox !== this) {
							otherCheckbox.checked = false;
						}
					});
				if (this.classList.contains('autoLaunchBlob')) {
					localStorage.setItem('launchType', 'blob');
					localStorage.removeItem('aboutBlank');

					const currentSiteUrl = window.location.href;

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
					}

					window.close();
					if (
						localStorage.getItem(
							'dropdown-selected-text-tabCloak'
						) === 'None (Default)'
					) {
						window.location.href = 'https://google.com';
					} else if (
						localStorage.getItem(
							'dropdown-selected-text-tabCloak'
						) === 'Google Classroom'
					) {
						window.location.href = 'https://classroom.google.com';
					} else if (
						localStorage.getItem(
							'dropdown-selected-text-tabCloak'
						) === 'Schoology'
					) {
						window.location.href = 'https://app.schoology.com/home';
					} else if (
						localStorage.getItem(
							'dropdown-selected-text-tabCloak'
						) === 'Desmos'
					) {
						window.location.href =
							'https://www.desmos.com/calculator';
					} else if (
						localStorage.getItem(
							'dropdown-selected-text-tabCloak'
						) === 'Google Drive'
					) {
						window.location.href = 'https://drive.google.com';
					} else if (
						localStorage.getItem(
							'dropdown-selected-text-tabCloak'
						) === 'Kahn Academy'
					) {
						window.location.href = 'https://www.khanacademy.org/';
					} else if (
						localStorage.getItem(
							'dropdown-selected-text-tabCloak'
						) === 'Quizlet'
					) {
						window.location.href = 'https://quizlet.com/';
					} else {
						window.location.href = 'https://google.com';
					}
				} else if (this.classList.contains('autoLaunchAboutBlank')) {
					const currentSiteUrl = window.location.href;

					localStorage.setItem('launchType', 'aboutBlank');
					localStorage.removeItem('blob');
					var win = window.open();
					var url = currentSiteUrl;
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

					window.close();
					switch (
						localStorage.getItem('dropdown-selected-text-tabCloak')
					) {
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
						case 'None (Default)':
						default:
							window.location.href = 'https://google.com';
							break;
					}
				}
			} else {
				localStorage.removeItem('launchType');
				localStorage.removeItem('blob');
				localStorage.removeItem('aboutBlank');
				window.open('/~/#/blank');
				window.close();
				const urlMap = {
					'None (Default)': 'https://google.com',
					'Google Classroom': 'https://classroom.google.com',
					Schoology: 'https://app.schoology.com/home',
					Desmos: 'https://www.desmos.com/calculator',
					'Google Drive': 'https://drive.google.com',
					'Kahn Academy': 'https://www.khanacademy.org/',
					Quizlet: 'https://quizlet.com/'
				};

				const selectedText = localStorage.getItem(
					'dropdown-selected-text-tabCloak'
				);
				const targetUrl = urlMap[selectedText] || 'https://google.com';

				if (window.parent !== window) {
					window.parent.location.href = targetUrl;
				} else {
					window.location.href = targetUrl;
				}
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
	window.close();
}

function base6xorEncrypt(text) {
	let output = '';
	for (let i = 0; i < text.length; i++) {
		let charCode = text.charCodeAt(i) ^ 2;
		let encryptedData = String.fromCharCode(charCode);
		output += encryptedData;
	}
	return window.btoa(encodeURIComponent(output));
}

function base6xorDecrypt(encryptedData) {
	let decodedData = decodeURIComponent(window.atob(encryptedData));
	let output = '';
	for (let i = 0; i < decodedData.length; i++) {
		let charCode = decodedData.charCodeAt(i) ^ 2;
		let decryptedOutput = String.fromCharCode(charCode);
		output += decryptedOutput;
	}
	return output;
}

function extractCookies() {
	let cookies = {};
	document.cookie.split(';').forEach(c => {
		let parts = c.split('=');
		cookies[parts.shift().trim()] = decodeURI(parts.join('='));
	});
	return cookies;
}

async function getIDBData(databaseName) {
	return new Promise((resolve, reject) => {
		let dbRequest = indexedDB.open(databaseName);

		dbRequest.onsuccess = event => {
			let db = event.target.result;
			let transaction = db.transaction(db.objectStoreNames, 'readonly');
			let data = {};

			transaction.oncomplete = () => {
				resolve({ name: databaseName, data });
			};

			transaction.onerror = event => {
				reject(event.target.error);
			};

			for (let storeName of db.objectStoreNames) {
				let objectStore = transaction.objectStore(storeName);
				let request = objectStore.openCursor();
				data[storeName] = [];

				request.onsuccess = event => {
					let cursor = event.target.result;
					if (cursor) {
						data[storeName].push({
							key: cursor.primaryKey,
							value: cursor.value
						});
						cursor.continue();
					}
				};

				request.onerror = event => {
					reject(event.target.error);
				};
			}
		};

		dbRequest.onerror = event => {
			reject(event.target.error);
		};
	});
}

function decodeBase64(dataUrl) {
	const base64String = dataUrl.split(',')[1];
	return window.atob(base64String);
}

function getAllIDBData() {
	return indexedDB.databases().then(databases => {
		let promises = databases.map(dbInfo => getIDBData(dbInfo.name));
		return Promise.all(promises);
	});
}

function exportData() {
	getAllIDBData()
		.then(idbData => {
			let data = {
				idbData: JSON.stringify(idbData),
				localStorageData: JSON.stringify(localStorage),
				cookies: extractCookies()
			};

			let jsonData = JSON.stringify(data);
			let encryptedData = base6xorEncrypt(jsonData);

			let blob = new Blob([encryptedData], {
				type: 'application/octet-stream'
			});

			if (window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveBlob(blob, 'data.space');
			} else {
				let a = document.createElement('a');
				a.href = URL.createObjectURL(blob);
				a.download = 'data.space';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}

			alert('Browsing Data has been correctly exported!');
		})
		.catch(err => {
			console.error('An error occurred during the export of data:', err);
		});
}

function importData() {
	let fileInput = document.getElementById('dataInput');
	let file = fileInput.files[0];
	let reader = new FileReader();

	reader.onload = e => {
		try {
			let decryptedDataJSON = base6xorDecrypt(e.target.result);
			let decryptedData = JSON.parse(decryptedDataJSON);

			let idbData = JSON.parse(decryptedData.idbData);
			let idbPromises = idbData.map(dbInfo => {
				return new Promise((resolve, reject) => {
					let dbRequest = indexedDB.open(dbInfo.name);

					dbRequest.onsuccess = event => {
						let db = event.target.result;
						let transaction = db.transaction(
							db.objectStoreNames,
							'readwrite'
						);

						transaction.oncomplete = () => {
							resolve();
						};

						transaction.onerror = event => {
							reject(event.target.error);
						};

						for (let storeName of db.objectStoreNames) {
							let objectStore =
								transaction.objectStore(storeName);
							let storeData = dbInfo.data[storeName];

							// Clear the object store
							objectStore.clear().onsuccess = () => {
								storeData.forEach(item => {
									if (item.key) {
										objectStore.put(item.value, item.key);
									} else {
										objectStore.add(item.value);
									}
								});
							};
						}
					};

					dbRequest.onerror = event => {
						reject(event.target.error);
					};
				});
			});

			localStorage.clear();
			let localStorageData = JSON.parse(decryptedData.localStorageData);
			for (let key in localStorageData) {
				localStorage.setItem(key, localStorageData[key]);
			}

			document.cookie.split(';').forEach(c => {
				document.cookie = c
					.replace(/^ +/, '')
					.replace(
						/=.*/,
						'=;expires=' + new Date().toUTCString() + ';path=/'
					);
			});

			let cookieData = decryptedData.cookies;
			for (let key in cookieData) {
				document.cookie = key + '=' + cookieData[key] + ';path=/';
			}

			Promise.all(idbPromises)
				.then(() => {
					alert('Browsing Data has been correctly imported!');
					window.location.reload();
				})
				.catch(err => {
					console.error(
						'An error occurred during the import of data:',
						err
					);
				});
		} catch (error) {
			console.error('Error during import:', error);
			alert(
				'An error occurred during the import of data. Please ensure the file is correct and try again.'
			);
		}
	};

	reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', function () {
	const dropdowns = document.querySelectorAll('.dropdown.dropdown-memory');

	dropdowns.forEach(function (dropdown) {
		const dropdownId = dropdown.id;
		const selectedText = localStorage.getItem(
			'dropdown-selected-text-' + dropdownId
		);
		if (selectedText) {
			const toggle = dropdown.querySelector('.dropdown-toggle');
			const selectedSpan = toggle.querySelector('.dropdown-selected');
			const menu = dropdown.querySelector('.dropdown-menu');
			const items = menu.querySelectorAll('li');

			selectedSpan.textContent = selectedText;

			items.forEach(function (item) {
				item.classList.remove('hidden');
				if (item.textContent.trim() === selectedText) {
					item.classList.add('hidden');
				}
			});
		}
	});

	let importButton = document.getElementById('importData');
	let exportButton = document.getElementById('exportData');

	importButton.addEventListener('click', function () {
		document.getElementById('dataInput').click();
	});
	exportButton.addEventListener('click', function () {
		exportData();
	});

	const panicKeyInput = document.querySelector('.panicKey');
	const saveButton = document.querySelector('.panicKeySave');
	const validKeys =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`.~!@#$%^&*()-_=+[{]}|;:,<.>/?';
	function panicKeySuccessPopup() {
		toast = document.querySelector('.toast');
		toast.style.display = 'block';
		(closeIcon = document.querySelector('.close')),
			(progress = document.querySelector('.progress'));

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

	if (localStorage.getItem('panicKeyBind')) {
		panicKeyInput.value = localStorage.getItem('panicKeyBind');
	}

	function panicKeyFailedPopup() {
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

	saveButton.addEventListener('click', () => {
		const keys = panicKeyInput.value.split(',').map(key => key.trim());
		let allValid = true;

		for (let key of keys) {
			if (!validKeys.includes(key) || key.length !== 1) {
				allValid = false;
				break;
			}
		}

		if (allValid) {
			//worked
			localStorage.setItem('panicKeyBind', keys.join(','));

			if (document.querySelector('.toast.active, .failtoast.active')) {
				return;
			} else {
				panicKeySuccessPopup();
			}
		} else if (panicKeyInput.value.length < 1) {
			// panickey SUCCESS LETS GO
			localStorage.setItem('panicKeyBind', '`');

			if (document.querySelector('.toast.active, .failtoast.active')) {
				return;
			} else {
				panicKeySuccessPopup();
			}
		} else {
			// failed :c
			if (document.querySelector('.toast.active, .failtoast.active')) {
				return;
			} else {
				panicKeyFailedPopup();
			}
		}
	});

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

	function savePassword() {
		const passwordInput = document.querySelector('.pPasswordInput');
		const newPassword = passwordInput.value;

		if (newPassword) {
			const key = 42;
			const encodedPassword = xorEncode(base64Encode(newPassword), key);
			localStorage.setItem('pPassword', encodedPassword);
			localStorage.setItem('passwordProtected', 'true');
			alert('Password has been set and saved.');
			passwordInput.value = '';
		} else {
			alert('Please enter a password.');
		}
	}

	const saveButton2 = document.querySelector('.pPasswordSave');
	saveButton2.addEventListener('click', savePassword);

	const pages = document.querySelectorAll('.scontent');
	pages.forEach(page => {
		page.style.display = 'none';
	});

	document.getElementById('blank').style.display = 'block';
	showPageFromHash();

	const dropdownMenus = document.querySelectorAll('.dropdown-menu');

	dropdownMenus.forEach(dropdownMenu => {
		if (dropdownMenu) {
			function updateStyles() {
				const items = dropdownMenu.querySelectorAll('li');

				if (items.length >= 2) {
					const lastItem = items[items.length - 1];
					const firstItem = items[0];
					const secondToLastItem = items[items.length - 2];
					const secondItem = items[1];

					if (secondToLastItem) {
						if (lastItem.classList.contains('hidden')) {
							secondToLastItem.classList.add(
								'second-to-last-conditional'
							);
						} else {
							secondToLastItem.classList.remove(
								'second-to-last-conditional'
							);
						}
					}

					if (secondItem) {
						if (firstItem.classList.contains('hidden')) {
							secondItem.classList.add(
								'second-to-first-conditional'
							);
						} else {
							secondItem.classList.remove(
								'second-to-first-conditional'
							);
						}
					}
				}

				if (items.length <= 2) {
					items.forEach(item => {
						item.classList.add('onlyConditional');
					});
				} else {
					items.forEach(item => {
						item.classList.remove('onlyConditional');
					});
				}
			}

			updateStyles();

			const observer = new MutationObserver(() => {
				setTimeout(updateStyles, 0);
			});

			observer.observe(dropdownMenu, {
				childList: true,
				subtree: true
			});

			dropdownMenu.querySelectorAll('li').forEach(item => {
				observer.observe(item, {
					attributes: true,
					attributeFilter: ['class']
				});
			});

			dropdownMenu.addEventListener('click', event => {
				if (event.target.tagName === 'LI') {
					// console.log('Clicked item:', event.target);
				}
			});
		}
	});

	function checkboxToggle(checkboxClass, storageKey, defaultChecked) {
		const checkbox = document.querySelector(`.checkbox.${checkboxClass}`);

		if (localStorage.getItem(storageKey) === null) {
			localStorage.setItem(storageKey, defaultChecked ? 'false' : 'true');
		}

		const isHidden = localStorage.getItem(storageKey) === 'true';
		checkbox.checked = !isHidden;

		checkbox.addEventListener('change', function () {
			localStorage.setItem(
				storageKey,
				checkbox.checked ? 'false' : 'true'
				//wow a nullish coalescent operator - not crllect
				// I know, crazy right? - crllect
			);
		});
	}

	checkboxToggle('utilBarYesNo', 'utilBarHidden', true);
	checkboxToggle('particlesYesNo', 'particlesHidden', true);
	checkboxToggle('smallIconsYesNo', 'smallIcons', true);
	checkboxToggle('adsYesNo', 'hideAds', true);
	checkboxToggle('passwordYesNo', 'passwordOff', false);

	const passwordKeyInput = document.querySelector('.passwordHotkeyInput');
	const saveButton3 = document.querySelector('.pPasswordKeybind');

	if (localStorage.getItem('passwordKeyBind')) {
		passwordKeyInput.value = localStorage.getItem('passwordKeyBind');
	}

	saveButton3.addEventListener('click', () => {
		const keys = passwordKeyInput.value.split(',').map(key => key.trim());
		let allValid = true;

		for (let key of keys) {
			if (!validKeys.includes(key) || key.length !== 1) {
				allValid = false;
				break;
			}
		}

		if (allValid) {
			localStorage.setItem('passwordKeyBind', keys.join(','));

			if (document.querySelector('.toast.active, .failtoast.active')) {
				return;
			} else {
				panicKeySuccessPopup();
			}
		} else if (passwordKeyInput.value.length < 1) {
			localStorage.setItem('passwordKeyBind', '~');

			if (document.querySelector('.toast.active, .failtoast.active')) {
				return;
			} else {
				panicKeySuccessPopup();
			}
		} else {
			if (document.querySelector('.toast.active, .failtoast.active')) {
				return;
			} else {
				panicKeySuccessPopup();
			}
		}
	});

	function savePassword() {
		const passwordInput = document.querySelector('.pPasswordInput');
		const newPassword = passwordInput.value;

		if (newPassword) {
			const key = 42;
			const encodedPassword = xorEncode(base64Encode(newPassword), key);
			localStorage.setItem('pPassword', encodedPassword);
			panicKeySuccessPopup();
			passwordInput.value = '';
		} else {
			panicKeyFailedPopup();
		}
	}

	saveButton2.addEventListener('click', savePassword);

	document.querySelector('.adsYesNo').addEventListener('change', () => {
		window.location.reload();
	});

	document
		.getElementById('resetButton')
		.addEventListener('click', function () {
			document.cookie.split(';').forEach(function (c) {
				document.cookie =
					c.trim().split('=')[0] +
					'=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
			});

			localStorage.clear();

			sessionStorage.clear();

			indexedDB.databases().then(databases => {
				databases.forEach(db => {
					indexedDB.deleteDatabase(db.name);
				});
			});

			if ('caches' in window) {
				caches.keys().then(keyList => {
					return Promise.all(
						keyList.map(key => {
							return caches.delete(key);
						})
					);
				});
			}

			if ('serviceWorker' in navigator) {
				navigator.serviceWorker
					.getRegistrations()
					.then(registrations => {
						registrations.forEach(registration => {
							registration.unregister();
						});
					});
			}

			setTimeout(() => {
				window.location.href = '/';
			}, 1000);
		});

	document.getElementById('bannerClose').addEventListener('click', () => {
		if (window.innerHeight > 787) {
			document.getElementById('banner').style.animation =
				'fade-out-top-announcement 1s';
		} else {
			document.getElementById('banner').style.animation =
				'fade-out-bottom 1s';
		}
		setTimeout(() => {
			document.getElementById('banner').remove();
		}, 1000);
	});

	async function fetchLastCommitDate() {
		try {
			const response = await fetch(
				'https://api.github.com/repos/nightproxy/space/commits'
			);
			const commits = await response.json();
			const lastCommitDate = new Date(commits[0].commit.committer.date);
			const formattedDate = lastCommitDate.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
			document.getElementById('last-updated').textContent = formattedDate;
		} catch (error) {
			console.error('Error fetching the last commit date:', error);
		}
	}

	fetchLastCommitDate();
});

// lock scroll cus yea
function preventScroll(event) {
	event.preventDefault();
	event.stopPropagation();
	return false;
}

function lockScroll() {
	window.scrollTo(0, 0);
}

window.addEventListener('scroll', lockScroll);

lockScroll();
