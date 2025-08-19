import React, { useEffect, useState } from 'react';

export default function CookieBanner() {
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const consent = localStorage.getItem('cookieConsent');
		if (!consent) setVisible(true);
	}, []);
	if (!visible) return null;
	return (
		<div style={{
			position: 'fixed', bottom: 0, left: 0, right: 0,
			background: '#111827', color: '#fff', padding: '12px 16px',
			display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between',
			zIndex: 1000
		}}>
			<span>This site uses cookies to enhance your experience. See our <a href="/privacy" style={{ color: '#93c5fd' }}>Privacy Policy</a>.</span>
			<div style={{ display: 'flex', gap: 8 }}>
				<button onClick={() => { localStorage.setItem('cookieConsent', 'accepted'); setVisible(false); }}
					style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px' }}>Accept</button>
				<button onClick={() => { localStorage.setItem('cookieConsent', 'dismissed'); setVisible(false); }}
					style={{ background: 'transparent', color: '#fff', border: '1px solid #374151', borderRadius: 6, padding: '8px 12px' }}>Dismiss</button>
			</div>
		</div>
	);
}
