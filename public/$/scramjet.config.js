// this is my custom file for my setup. however it doesn't directly interfere with the actual config variable, so the init is still needed.

self.__scramjet$config = {
    prefix: "/$/space/",
    codec: "xor",
    files: {
        wasm: "/$/scramjet.wasm.js",
        worker: "/$/scramjet.worker.js",
        client: "/$/scramjet.client.js",
        shared: "/$/scramjet.shared.js",
        sync: "/$/scramjet.sync.js"
    },
    siteFlags: {
	},
    codec: {
        encode: `if (!url) return url;
          let result = "";
          for (let i = 0; i < url.length; i++) {
            result += i % 2 ? String.fromCharCode(url.charCodeAt(i) ^ 2) : url[i];
          }
          return encodeURIComponent(result);
          `,
        decode: `if (!url) return url;
          const [input, ...search] = url.split("?");
          let result = "";
          const decoded = decodeURIComponent(input);
          for (let i = 0; i < decoded.length; i++) {
            result +=
              i % 2 ? String.fromCharCode(decoded.charCodeAt(i) ^ 2) : decoded[i];
          }
          return result + (search.length ? "?" + search.join("?") : "");
        `,
      },
};