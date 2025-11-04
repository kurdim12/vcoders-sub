"use client";

export default function TestPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-4xl font-bold">UNI-Agent</h1>
        <p className="text-muted-foreground">If you see this, the app is working!</p>
        <a href="/auth/signin" className="text-primary underline">Go to Sign In</a>
      </div>
    </div>
  );
}

