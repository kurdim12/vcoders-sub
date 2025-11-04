import { NextRequest, NextResponse } from "next/server";
import { isCloudMode } from "@/lib/config";
import { uploadFile, getSignedUrl } from "@/lib/supabase";

// Upload file to Supabase Storage (cloud mode only)
export async function POST(request: NextRequest) {
  if (!isCloudMode()) {
    return NextResponse.json(
      { error: "File upload is only available in cloud mode" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const path = formData.get("path") as string;

    if (!file || !path) {
      return NextResponse.json(
        { error: "File and path are required" },
        { status: 400 }
      );
    }

    const data = await uploadFile(file, path);
    const signedUrl = await getSignedUrl(path);

    return NextResponse.json({ success: true, path: data.path, url: signedUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// Get signed URL for a file (cloud mode only)
export async function GET(request: NextRequest) {
  if (!isCloudMode()) {
    return NextResponse.json(
      { error: "Signed URLs are only available in cloud mode" },
      { status: 400 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { error: "Path is required" },
        { status: 400 }
      );
    }

    const signedUrl = await getSignedUrl(path);
    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Get signed URL error:", error);
    return NextResponse.json(
      { error: "Failed to get signed URL" },
      { status: 500 }
    );
  }
}

