# Bare Client

This package implements the [TompHTTP Bare Server](https://github.com/tomphttp/specifications/blob/master/BareServer.md) as a client.

See the [V2 API documentation](./docs/V2.md).

See the [changelog](./CHANGELOG.md).

## Upgrading

A guide for updating from v1 to v2 can be found [here](./docs/V2-UPGRADE-GUIDE.md).

## Older Bare servers

Starting from v2, @tomphttp/bare-client only supports Bare servers v3+.

If you operate an outdated Bare server, we encourage you to update. If you're using an outdated Bare server, we encourage you to find an updated Bare server or host your own.

If you're too lazy to do either of the above, you can install an outdated and unsupported version of the Bare client.

```sh
npm install @tomphttp/bare-client@1
```

## Quickstart

Script tag:

```html
<script src="https://unpkg.com/@tomphttp/bare-client@placeholder/dist/bare.cjs"></script>
<script>
	console.log(bare); // { createBareClient: ..., BareClient: ... }

	bare.createBareClient('http://localhost:8080/bare/').then(async (client) => {
		const res = await client.fetch('https://api.github.com/orgs/tomphttp', {
			headers: {
				'user-agent': navigator.userAgent, // user-agent must be passed otherwise the API gives a 403
			},
		});

		console.log(await res.json()); // {login: 'tomphttp', id: 98234273, ... }
	});
</script>
```

ESM/bundler:

```sh
npm i @tomphttp/bare-client
```

```js
import { createBareClient } from '@tomphttp/bare-client';

createBareClient('http://localhost:8080/bare/'); // ...
```

See [examples/](examples/).

## Notice

`client.fetch` isn't 1:1 to JavaScript's `fetch`. It doesn't accept a `Request` as an argument due to the headers on the `Request` being "managed":

```js
const a = new Headers(); // unmanaged `Headers`
a.set('user-agent', 'test');
a.get('user-agent'); // "test"

const b = new Request(location.toString()).headers; // managed `Headers`
b.set('user-agent', 'test');
b.get('user-agent'); // null
```
