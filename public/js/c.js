function isInLocalStorage(key) {
	return localStorage.getItem(key) !== null;
}

const currentLocation = window.location.href;
document.addEventListener('DOMContentLoaded', function () {
	if (
		currentLocation !== 'about:blank' ||
		!currentLocation.includes('blob:')
	) {
		const launchType = localStorage.getItem('launchType');

		if (launchType === 'blob') {
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
			} else {
				console.error('Failed to open a new window.');
			}
		} else if (launchType === 'aboutBlank') {
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
			window.location.href = 'https://google.com';
		}
	}
});
