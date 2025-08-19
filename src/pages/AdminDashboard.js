import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
	const [stats, setStats] = useState(null);
	const [recent, setRecent] = useState({ recentUsers: [], recentRecipes: [], recentPhotos: [] });
	const [q, setQ] = useState('');
	const token = localStorage.getItem('token');

	useEffect(() => {
		(async () => {
			const headers = { Authorization: `Bearer ${token}` };
			const s = await axios.get('http://localhost:5000/api/admin/stats', { headers });
			setStats(s.data);
			const r = await axios.get('http://localhost:5000/api/admin/recent', { headers });
			setRecent(r.data);
		})();
	}, [token]);

	const filt = (arr, keys) => arr.filter(item =>
		keys.some(k => String(item[k] ?? '').toLowerCase().includes(q.toLowerCase()))
	);

	const users = useMemo(() => filt(recent.recentUsers, ['username', 'email']), [recent, q]);
	const recipes = useMemo(() => filt(recent.recentRecipes, ['recipe_name', 'cuisine']), [recent, q]);
	const photos = useMemo(() => filt(recent.recentPhotos, ['recipe']), [recent, q]);

	if (!stats) return <div style={{ padding: 24 }}>Loading admin dashboard...</div>;

	return (
		<div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
			<h1>Admin Dashboard</h1>
			<div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
				<Card title="Users" value={stats.userCount} />
				<Card title="Recipes" value={stats.recipeCount} />
				<Card title="Photos" value={stats.photoCount} />
			</div>
			<div style={{ marginTop: 24 }}>
				<input placeholder="Search users/recipes/photos" value={q} onChange={e => setQ(e.target.value)} style={{ width: '100%', padding: 10 }} />
			</div>
			<Section title="Recent Users">
				<Table columns={["Username", "Email"]} rows={users.map(u => [u.username, u.email])} />
			</Section>
			<Section title="Recent Recipes">
				<Table columns={["Name", "Cuisine", "Difficulty"]} rows={recipes.map(r => [r.recipe_name, r.cuisine, r.difficulty])} />
			</Section>
			<Section title="Recent Photos">
				<Table columns={["Photo ID", "Uploader"]} rows={photos.map(p => [p._id, p.uploader?.username])} />
			</Section>
		</div>
	);
}

function Card({ title, value }) {
	return (
		<div style={{ background: '#f5f7fa', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
			<div style={{ fontSize: 14, color: '#64748b' }}>{title}</div>
			<div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
		</div>
	);
}

function Section({ title, children }) {
	return (
		<div style={{ marginTop: 24 }}>
			<h2 style={{ margin: '8px 0' }}>{title}</h2>
			{children}
		</div>
	);
}

function Table({ columns, rows }) {
	return (
		<div style={{ overflowX: 'auto' }}>
			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead>
					<tr>
						{columns.map(c => <th key={c} style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e2e8f0' }}>{c}</th>)}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr key={i}>
							{row.map((cell, j) => <td key={j} style={{ padding: 10, borderBottom: '1px solid #f1f5f9' }}>{String(cell ?? '')}</td>)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
