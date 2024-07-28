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
	if (isInLocalStorage('tabCloak')) {
		console.log('not done yet');
	}

	// Panic Key
	if (!localStorage.getItem('panicKeyBind')) {
		localStorage.setItem('panicKeyBind', '`');
	}

	function handlePanicKey(event) {
		const panicKeyBind = localStorage.getItem('panicKeyBind');

		if (
			event.key === panicKeyBind &&
			event.target.tagName !== 'INPUT' &&
			event.target.tagName !== 'TEXTAREA'
		) {
			window.location.href = 'https://google.com';
		}
	}

	document.addEventListener('keydown', handlePanicKey);
});
