import { STORAGE_KEYS } from "../config/constants.js";

const CURRENT_SCHEMA_VERSION = 1;
const SCHEMA_VERSION_KEY = "mogo_schema_version";

export function migrate() {
  const currentVersion = parseInt(localStorage.getItem(SCHEMA_VERSION_KEY) || "0", 10);

  if (currentVersion < CURRENT_SCHEMA_VERSION) {
    // Perform any needed migrations here
    // v1: Initial schema (no changes needed from v0 placeholder)
    localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION.toString());
    console.log("✅ Storage migrated to schema v" + CURRENT_SCHEMA_VERSION);
  }
}

export function loadState(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load state:", e);
    return null;
  }
}

export function saveState(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save state:", e);
  }
}

export function backupState() {
  const backup = {
    exportDate: new Date().toISOString(),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    data: {
      accounts: JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || "[]"),
      stickers: JSON.parse(localStorage.getItem(STORAGE_KEYS.STICKERS) || "{}"),
      showroom: JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOWROOM) || "[]"),
      trades: JSON.parse(localStorage.getItem(STORAGE_KEYS.TRADES) || "[]"),
      vault: JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULT) || "{}"),
      settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || "{}"),
      activeAlbum: JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_ALBUM) || '{"activeAlbum": "demo"}')
    }
  };

  // Trigger download
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mogo-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function restoreState(backupObj) {
  try {
    const { data } = backupObj;
    Object.entries(data).forEach(([key, value]) => {
      const storageKey = STORAGE_KEYS[key.toUpperCase()] || `mogo_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(value));
    });
    console.log("✅ State restored successfully");
    return true;
  } catch (e) {
    console.error("Failed to restore state:", e);
    return false;
  }
}

export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  localStorage.removeItem(SCHEMA_VERSION_KEY);
  console.log("✅ All data cleared");
}
