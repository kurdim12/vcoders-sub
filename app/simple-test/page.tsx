export default function SimpleTestPage() {
  return (
    <html>
      <head>
        <title>Test Page</title>
      </head>
      <body style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>If you see this, the server is working!</h1>
        <p>This is a basic HTML page without React.</p>
        <p>Try: <a href="/auth/signin">Sign In Page</a></p>
      </body>
    </html>
  );
}

