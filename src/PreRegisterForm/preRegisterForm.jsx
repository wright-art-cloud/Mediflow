import React, { useState } from 'react';
import { useMediflowData } from '../context/DataContext';
import './preRegisterForm.css';

export default function PreRegisterForm({ onClose, onSuccess }) {
  const { patientService, authService } = useMediflowData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const allergiesArray = allergies
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      const newUser = authService.createUser({
        email,
        password: 'temp_password_123',
        role: 'patient',
        is_active: true,
      });

      const newPatient = patientService.registerPatient({
        user_id: newUser.user_id,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        gender: gender.toLowerCase(),
        phone,
        address,
        blood_group: bloodGroup,
        allergies: allergiesArray,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
      });

      if (onSuccess) onSuccess(newPatient);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pre-register-overlay">
      <div className="pre-register-modal">
        <div className="pre-register-header">
          <h2>Patient Pre-Registration</h2>
          {onClose && (
            <button className="close-btn" onClick={onClose}>×</button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="pre-register-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-field">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Medical Information */}
          <div className="form-section">
            <h3>Medical Information</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="form-field">
                <label>Allergies (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., penicillin, pollen"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-field">
              <label>Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows="2"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Emergency Contact Name</label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Actions */}
          <div className="form-actions">
            {onClose && (
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
