"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { generateId } from "@/lib/utils";
import { Upload, Link as LinkIcon, FileText, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function ResourcesPage() {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const resources = useStore((state) => state.resources);
  const courses = useStore((state) => state.courses);
  const addResource = useStore((state) => state.addResource);
  const updateResource = useStore((state) => state.updateResource);

  const handleAddUrl = async () => {
    if (!url.trim()) return;

    const newResource = {
      id: generateId(),
      userId: "user-1",
      title: url,
      type: "url" as const,
      source: url,
      status: "processing" as const,
    };

    addResource(newResource);
    setUrl("");
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      updateResource(newResource.id, { status: "ready", title: `Resource from ${new URL(url).hostname}` });
      setIsProcessing(false);
    }, 1500);
  };

  const handleFileUpload = () => {
    alert("File upload is a client-side demo feature. In production, files would be processed in the browser using pdf.js or similar libraries.");
  };

  const statusIcons = {
    processing: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
    ready: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
  };

  const statusColors = {
    processing: "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
    ready: "border-green-500 bg-green-50 dark:bg-green-950/20",
    error: "border-red-500 bg-red-50 dark:bg-red-950/20",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">
            Upload and manage your study materials
          </p>
        </div>

        {/* Add Resources */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Add URL
              </CardTitle>
              <CardDescription>
                Add a web resource (article, video, documentation)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddUrl();
                }}
              />
              <Button
                onClick={handleAddUrl}
                disabled={!url.trim() || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Add Resource
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload File
              </CardTitle>
              <CardDescription>
                Upload PDF, DOCX, or text files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleFileUpload}
                variant="outline"
                className="w-full h-32 border-dashed"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm">Click to upload or drag and drop</span>
                  <span className="text-xs text-muted-foreground">
                    PDF, DOCX, PPTX, TXT (Max 10MB)
                  </span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resources Library */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Library</CardTitle>
            <CardDescription>
              All your uploaded and saved resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resources.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No resources yet</p>
                <p className="text-sm text-muted-foreground">
                  Add URLs or upload files to get started
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => {
                  const course = courses.find((c) => c.id === resource.courseId);

                  return (
                    <Card
                      key={resource.id}
                      className={statusColors[resource.status]}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {resource.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {resource.source}
                            </p>
                          </div>
                          {statusIcons[resource.status]}
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs uppercase">
                            {resource.type}
                          </Badge>
                          {course && (
                            <Badge variant="secondary" className="text-xs">
                              {course.code}
                            </Badge>
                          )}
                        </div>

                        {resource.status === "ready" && (
                          <Button size="sm" variant="outline" className="w-full">
                            View Resource
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{resources.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {resources.filter((r) => r.status === "processing").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {resources.filter((r) => r.status === "ready").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {resources.filter((r) => r.status === "error").length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

