import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/authService';
import { handleApiError } from '../utils/errorUtils';
import './Profile.css';

function Profile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password2: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await authAPI.updateProfile(profileData);
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.new_password !== passwordData.new_password2) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authAPI.changePassword(passwordData);
      setSuccess('Password changed successfully!');
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password2: '',
      });
      setIsChangingPassword(false);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      username: user.username || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || '',
    });
    setError('');
    setSuccess('');
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      old_password: '',
      new_password: '',
      new_password2: '',
    });
    setError('');
    setSuccess('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setImageLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadResponse = await authAPI.uploadProfileImage(formData);
      console.log('Upload response:', uploadResponse);
      
      // Simply update the profile_image in the current user object
      const updatedUser = { ...user, profile_image: uploadResponse.profile_image };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Profile image uploaded successfully!');
      
      // Reset file input
      if (e.target) {
        e.target.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(handleApiError(err));
    } finally {
      setImageLoading(false);
    }
  };

  const handleImageDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile image?')) {
      return;
    }

    setImageLoading(true);
    setError('');
    setSuccess('');

    try {
      await authAPI.deleteProfileImage();
      console.log('Delete successful');
      
      // Update user object to remove profile_image
      const updatedUser = { ...user, profile_image: null };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Profile image deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      setError(handleApiError(err));
    } finally {
      setImageLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-content">
        {/* Profile Image Section */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Profile Picture</h2>
          </div>
          <div className="profile-image-section">
            <div className="profile-image-container">
              {user.profile_image ? (
                <img 
                  src={user.profile_image} 
                  alt="Profile" 
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  <span>{user.first_name?.[0]}{user.last_name?.[0]}</span>
                </div>
              )}
            </div>
            <div className="profile-image-actions">
              <label className={`btn-upload ${imageLoading ? 'disabled' : ''}`}>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleImageUpload}
                  disabled={imageLoading}
                  style={{ display: 'none' }}
                />
                {imageLoading ? 'Uploading...' : 'Upload Image'}
              </label>
              {user.profile_image && (
                <button
                  className="btn-delete"
                  onClick={handleImageDelete}
                  disabled={imageLoading}
                >
                  Delete Image
                </button>
              )}
              <p className="image-help-text">
                Max size: 5MB. Formats: JPEG, PNG, WebP
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Profile Information</h2>
            {!isEditing && (
              <button 
                className="btn-edit" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={profileData.first_name}
                    onChange={handleProfileChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Last Name *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={profileData.last_name}
                    onChange={handleProfileChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={profileData.phone_number}
                  onChange={handleProfileChange}
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Username:</span>
                <span className="info-value">{user.username}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Full Name:</span>
                <span className="info-value">
                  {user.first_name} {user.last_name}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">
                  {user.phone_number || 'Not provided'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Verified:</span>
                <span className={`info-value ${user.email_verified ? 'verified' : 'unverified'}`}>
                  {user.email_verified ? '✓ Verified' : '✗ Not verified'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Member Since:</span>
                <span className="info-value">
                  {new Date(user.date_joined).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Security</h2>
            {!isChangingPassword && (
              <button
                className="btn-edit"
                onClick={() => setIsChangingPassword(true)}
              >
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <form onSubmit={handlePasswordUpdate} className="profile-form">
              <div className="form-group">
                <label htmlFor="old_password">Current Password *</label>
                <input
                  type="password"
                  id="old_password"
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handlePasswordChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="new_password">New Password *</label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="new_password2">Confirm New Password *</label>
                <input
                  type="password"
                  id="new_password2"
                  name="new_password2"
                  value={passwordData.new_password2}
                  onChange={handlePasswordChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancelPasswordChange}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          ) : (
            <div className="security-info">
              <p>🔒 Keep your account secure by using a strong password.</p>
              <p>Last password change: Not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
