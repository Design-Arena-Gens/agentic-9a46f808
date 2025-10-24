import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div
        style={{
          maxWidth: '480px',
          background: 'white',
          padding: '3rem',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px rgba(15, 23, 42, 0.12)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>EHR Demo</h1>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Secure, role-based electronic health record platform for patients, doctors,
          and administrators.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link className="primary-btn" href="/login">
            Login
          </Link>
          <Link
            className="primary-btn"
            href="/register"
            style={{ background: '#0f172a' }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
