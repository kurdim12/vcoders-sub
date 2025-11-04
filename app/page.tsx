"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign in after a short delay
    const timer = setTimeout(() => {
      router.push("/auth/signin");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ 
      margin: 0, 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '32px', color: '#333', marginBottom: '20px' }}>UNI-Agent</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>Academic AI Assistant</p>
      <p style={{ marginBottom: '10px' }}>
        <a href="/auth/signin" style={{ color: '#0066cc', textDecoration: 'underline' }}>
          Go to Sign In Page →
        </a>
      </p>
      <p style={{ marginBottom: '10px' }}>
        <a href="/courses" style={{ color: '#0066cc', textDecoration: 'underline' }}>
          Go to Courses →
        </a>
      </p>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#999' }}>
        Redirecting to sign in...
      </p>
    </div>
  );
}
