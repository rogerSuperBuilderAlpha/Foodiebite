// Minimal service worker registration (register if found)
export function register() {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/service-worker.js').catch(() => {});
		});
	}
}

export function unregister() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(reg => reg.unregister()));
	}
}
