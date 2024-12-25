import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		alias: {
			"@/*": "./path/to/libnpm install mode-watcher/*",
		},
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			pages: 'dist',     // Указывает, куда помещать HTML-файлы
			assets: 'dist',    // Указывает, куда помещать статические файлы
			fallback: '200.html'
		}),
		paths: {
			base: '', // Убедитесь, что базовый путь пуст
		},
		prerender: {
			entries: [] // Запрещаем предварительный рендеринг
		}
	}
};

export default config;
