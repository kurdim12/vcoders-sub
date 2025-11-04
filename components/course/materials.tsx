"use client";

import { useState, useRef } from "react";
import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Link as LinkIcon, Video, File, Loader2 } from "lucide-react";
import { QuickActionsDrawer } from "./quick-actions-drawer";
import { generateId } from "@/lib/utils";

export function CourseMaterials() {
  const { courseId } = useCourse();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const materials = useStore((state) =>
    state.materials.filter((m) => m.courseId === courseId)
  );
  const addMaterial = useStore((state) => state.addMaterial);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !courseId) return;

    setUploading(true);

    try {
      // Extract text from PDF (dynamically import)
      let textPreview = "";
      if (file.type === "application/pdf") {
        try {
          // Dynamic import to avoid server-side build issues
          const { extractTextFromPDF } = await import("@/lib/pdf-extraction");
          textPreview = await extractTextFromPDF(file);
          // Limit preview length
          textPreview = textPreview.substring(0, 500);
        } catch (error) {
          console.error("PDF extraction failed:", error);
          textPreview = "PDF uploaded (text extraction failed)";
        }
      } else if (file.type === "text/plain") {
        textPreview = await file.text();
        textPreview = textPreview.substring(0, 500);
      }

      // Create material
      const newMaterial = {
        id: generateId(),
        courseId,
        title: file.name,
        type: file.type === "application/pdf" ? "pdf" as const : "text" as const,
        source: file.name,
        textPreview: textPreview || undefined,
      };

      addMaterial(newMaterial);
      
      // Show success
      alert(`File "${file.name}" uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return FileText;
      case "url":
        return LinkIcon;
      case "video":
        return Video;
      default:
        return File;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Materials</CardTitle>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                variant="outline"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload PDF
                  </>
                )}
              </Button>
              <Button onClick={() => setDrawerOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Add Material
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {materials.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No materials yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add PDFs, links, or videos to get started
              </p>
              <div className="flex gap-2 justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload-empty"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  variant="outline"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload PDF
                    </>
                  )}
                </Button>
                <Button onClick={() => setDrawerOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Add Link
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => {
                const Icon = getIcon(material.type);
                return (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                          <CardTitle className="text-base">{material.title}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs uppercase">
                          {material.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {material.textPreview || material.source}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Add to Planner
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      <QuickActionsDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}