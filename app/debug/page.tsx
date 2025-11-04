"use client";

export default function DebugPage() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '32px', color: '#333' }}>Debug Page</h1>
      <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>If you see this, Next.js is working!</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/auth/signin" style={{ color: '#0066cc', textDecoration: 'underline' }}>Go to Sign In</a>
      </div>
    </div>
  );
}

