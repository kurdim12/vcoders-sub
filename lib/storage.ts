import type { StoreSnapshot } from "./types";
import { getCurrentAccountId, getAccountStorageKey } from "./accounts";

const STORAGE_VERSION = 1;

export function loadSnapshot(accountId?: string): StoreSnapshot | null {
  // Server-side guard
  if (typeof window === "undefined") return null;
  
  try {
    // Check if localStorage is available
    if (typeof localStorage === "undefined") return null;
    
    const currentAccountId = accountId || getCurrentAccountId();
    const storageKey = getAccountStorageKey(currentAccountId);
    
    const stored = localStorage.getItem(storageKey);
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

export function saveSnapshot(snapshot: StoreSnapshot, accountId?: string): void {
  if (typeof window === "undefined") return;

  try {
    const currentAccountId = accountId || getCurrentAccountId();
    const storageKey = getAccountStorageKey(currentAccountId);
    
    const data = {
      version: STORAGE_VERSION,
      data: snapshot,
      savedAt: new Date().toISOString(),
      accountId: currentAccountId,
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save snapshot:", error);
  }
}

export function clearStorage(accountId?: string): void {
  if (typeof window === "undefined") return;
  
  const currentAccountId = accountId || getCurrentAccountId();
  const storageKey = getAccountStorageKey(currentAccountId);
  localStorage.removeItem(storageKey);
}

// Clear all account data (for reset)
export function clearAllStorage(): void {
  if (typeof window === "undefined") return;
  
  // Clear all account storage keys
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("uniagent:") && key.includes(":v1")) {
      localStorage.removeItem(key);
    }
  });
  
  // Also clear legacy storage
  localStorage.removeItem("uniagent:v1");
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

