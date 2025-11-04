import type { StoreSnapshot } from "./types";

const STORAGE_KEY = "uniagent:v1";
const STORAGE_VERSION = 1;

export function loadSnapshot(): StoreSnapshot | null {
  // Server-side guard
  if (typeof window === "undefined") return null;
  
  try {
    // Check if localStorage is available
    if (typeof localStorage === "undefined") return null;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (parsed.version !== STORAGE_VERSION) {
      console.warn("Storage version mismatch, resetting...");
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error("Failed to load snapshot:", error);
    return null;
  }
}

export function saveSnapshot(snapshot: StoreSnapshot): void {
  if (typeof window === "undefined") return;

  try {
    const data = {
      version: STORAGE_VERSION,
      data: snapshot,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save snapshot:", error);
  }
}

export function clearStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function exportSnapshot(snapshot: StoreSnapshot): void {
  const data = {
    version: STORAGE_VERSION,
    data: snapshot,
    exportedAt: new Date().toISOString(),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `uni-agent-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importSnapshot(file: File): Promise<StoreSnapshot> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const parsed = JSON.parse(json);

        if (parsed.version !== STORAGE_VERSION) {
          reject(new Error("Incompatible backup version"));
          return;
        }

        resolve(parsed.data);
      } catch (error) {
        reject(new Error("Invalid backup file"));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

