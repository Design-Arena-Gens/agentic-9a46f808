'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider.jsx';
import { apiClient } from '../../lib/api.js';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    specialization: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { ...form };
      if (form.role !== 'doctor') {
        delete payload.specialization;
      }
      const { user, token } = await apiClient.post('/api/auth/register', payload);
      login(user, token);
      router.push(`/dashboard/${user.role}`);
    } catch (err) {
      setError('Unable to register with the provided details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 540,
          background: 'white',
          padding: '3rem',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px rgba(15, 23, 42, 0.12)',
          display: 'grid',
          gap: '1rem',
        }}
      >
        <h2>Create your account</h2>
        <p style={{ color: '#64748b' }}>Sign up as a patient or doctor.</p>
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
          }}>
            {error}
          </div>
        )}
        <div className="form-grid two-column">
          <div className="input-group">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              minLength={6}
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          {form.role === 'doctor' && (
            <div className="input-group">
              <label htmlFor="specialization">Specialization</label>
              <input
                id="specialization"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create account'}
        </button>
        <p style={{ fontSize: '0.9rem' }}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
