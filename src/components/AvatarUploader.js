import React, { useState } from 'react';
import axios from 'axios';

export default function AvatarUploader({ user, onAvatarChange }) {
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [preview, setPreview] = useState(user.avatar || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setAvatar(e.target.value);
    setPreview(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/auth/profile/avatar',
        { avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profile picture updated!');
      onAvatarChange && onAvatarChange(res.data.avatar);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update avatar');
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <label htmlFor="avatar-url">Profile Picture URL:</label>
      <input
        id="avatar-url"
        value={avatar}
        onChange={handleChange}
        placeholder="Paste image URL"
        style={{ marginLeft: 8, width: 300 }}
      />
      <div style={{ margin: '10px 0' }}>
        <img
          src={preview}
          alt="Avatar Preview"
          style={{ width: 80, height: 80, borderRadius: '50%', border: '1px solid #ccc' }}
          onError={e => (e.target.src = 'https://ui-avatars.com/api/?name=User&background=ccc&color=fff&size=80')}
        />
      </div>
      <button onClick={handleSave} style={{ padding: '6px 16px', borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none' }}>
        Save
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
    </div>
  );
} 