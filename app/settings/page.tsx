"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useTheme } from "next-themes";
import { Download, Upload, RotateCcw, Sun, Moon, User, Globe, Database, Cloud, WifiOff } from "lucide-react";
import { importSnapshot } from "@/lib/storage";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const user = useStore((state) => state.users[0]);
  const { exportData, importData, resetData, settings, toggleDarkMode, setLanguage } = useStore();
  
  // Get current mode (default to demo) - read from environment if available
  const aioMode: "demo" | "cloud" | "offline" = (typeof window !== 'undefined' && (window as any).__AIO_MODE__) || "demo";
  
  const modeConfig = {
    demo: { icon: Database, label: "Demo (No Database)", color: "text-blue-500" },
    cloud: { icon: Cloud, label: "Cloud (Supabase)", color: "text-green-500" },
    offline: { icon: WifiOff, label: "Offline (Mock)", color: "text-gray-500" },
  };
  
  const currentMode = modeConfig[aioMode as keyof typeof modeConfig] || modeConfig.demo;
  const ModeIcon = currentMode.icon;

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const snapshot = await importSnapshot(file);
          importData(snapshot);
          alert("Data imported successfully!");
          window.location.reload();
        } catch (error) {
          alert("Failed to import data: " + (error as Error).message);
        }
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all data? This will restore the demo data and cannot be undone."
      )
    ) {
      resetData();
      alert("Data reset successfully!");
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and application preferences
          </p>
        </div>

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
            <CardDescription>
              Your personal information (stored locally)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={user?.name || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="flex items-center gap-2">
                <Input id="role" value={user?.role || ""} readOnly className="flex-1" />
                <Badge variant="secondary" className="capitalize">
                  {user?.role}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Profile editing is disabled in the demo version
            </p>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="flex-1"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="flex-1"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                  className="flex-1"
                >
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language & Region
            </CardTitle>
            <CardDescription>Set your preferred language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <div className="flex gap-2">
                <Button
                  variant={settings.language === "en" ? "default" : "outline"}
                  onClick={() => setLanguage("en")}
                  className="flex-1"
                >
                  English
                </Button>
                <Button
                  variant={settings.language === "ar" ? "default" : "outline"}
                  onClick={() => setLanguage("ar")}
                  className="flex-1"
                >
                  العربية (Demo)
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Full i18n support would be implemented in production
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export, import, or reset your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Export Data</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Download all your data as a JSON file for backup
                  </p>
                  <Button variant="outline" size="sm" onClick={exportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export JSON
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Upload className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Import Data</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Restore data from a previously exported JSON file
                  </p>
                  <Button variant="outline" size="sm" onClick={handleImport}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import JSON
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-destructive mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Reset to Demo Data</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Clear all data and restore the original demo dataset
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleReset}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Demo
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> All data is stored locally in your browser.
                There is no cloud sync in this demo version. Export your data
                regularly to prevent loss.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ModeIcon className={`w-5 h-5 ${currentMode.color}`} />
              Current Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Mode:</span>
              <Badge variant="secondary" className="text-sm">
                {currentMode.label}
              </Badge>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
              {aioMode === "demo" && (
                <>
                  <p className="font-medium">Demo Mode Features:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ localStorage persistence</li>
                    <li>✓ Export/Import JSON</li>
                    <li>✓ Client-side RAG (TF-IDF)</li>
                    <li>✓ Real or mock AI responses</li>
                    <li>✗ No multi-device sync</li>
                  </ul>
                </>
              )}
              
              {aioMode === "cloud" && (
                <>
                  <p className="font-medium">Cloud Mode Features:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ Supabase PostgreSQL database</li>
                    <li>✓ pgvector semantic search</li>
                    <li>✓ File uploads to Supabase Storage</li>
                    <li>✓ Multi-device sync</li>
                    <li>✓ NextAuth authentication</li>
                  </ul>
                </>
              )}
              
              {aioMode === "offline" && (
                <>
                  <p className="font-medium">Offline Mode Features:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ No network calls</li>
                    <li>✓ Deterministic AI responses</li>
                    <li>✓ localStorage persistence</li>
                    <li>✓ Works without internet</li>
                    <li>✗ No real AI processing</li>
                  </ul>
                </>
              )}
            </div>
            
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>To switch modes:</strong> Set <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">AIO_MODE=demo|cloud|offline</code> in your <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env.local</code> file and restart the server.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About UNI-Agent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-medium">1.0.0 (AIO Edition)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Storage:</span>
              <span className="font-medium">
                {aioMode === "cloud" ? "Supabase PostgreSQL" : "localStorage (Browser)"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Backend:</span>
              <span className="font-medium">
                {aioMode === "cloud" ? "Supabase" : "Client-only"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AI Provider:</span>
              <span className="font-medium">
                {aioMode === "offline" ? "Mock (Offline)" : "OpenAI-compatible"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

