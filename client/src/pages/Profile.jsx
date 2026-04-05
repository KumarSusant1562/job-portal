import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    location: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getUserProfile();
      setProfile(response.data.data);
      setFormData({
        name: response.data.data.name,
        bio: response.data.data.bio || '',
        phone: response.data.data.phone || '',
        location: response.data.data.location || '',
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('bio', formData.bio);
      data.append('phone', formData.phone);
      data.append('location', formData.location);

      if (profilePicture) {
        data.append('profilePicture', profilePicture);
      }

      const response = await userAPI.updateUserProfile(data);
      setProfile(response.data.data);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      setProfilePicture(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="error">Profile not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-picture-section">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile" className="profile-picture-lg" />
            ) : (
              <div className="profile-picture-placeholder">👤</div>
            )}
          </div>

          <div className="profile-basic">
            <h1>{profile.name}</h1>
            <p className="role-badge">{profile.role === 'recruiter' ? '🏢 Recruiter' : '💼 Job Seeker'}</p>
            <p className="email">{profile.email}</p>
          </div>

          {!editing && (
            <button className="edit-btn" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {editing ? (
          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="4"></textarea>
            </div>

            <div className="form-group">
              <label>Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {profilePicture && <p className="file-selected">✓ {profilePicture.name}</p>}
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                💾 Save Changes
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditing(false);
                  setProfilePicture(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-row">
              <span className="label">📍 Location:</span>
              <span className="value">{profile.location || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="label">📞 Phone:</span>
              <span className="value">{profile.phone || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="label">📝 Bio:</span>
              <span className="value bio-text">{profile.bio || 'No bio added yet'}</span>
            </div>
            <div className="detail-row">
              <span className="label">📅 Member Since:</span>
              <span className="value">{new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
