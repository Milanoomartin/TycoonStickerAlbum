import { STORAGE_KEYS } from "./constants.js";

export async function loadDefaults() {
  // Load default showroom items if not present
  if (!localStorage.getItem(STORAGE_KEYS.SHOWROOM)) {
    try {
      const res = await fetch("assets/defaultShowroomItems.json");
      const items = await res.json();
      localStorage.setItem(STORAGE_KEYS.SHOWROOM, JSON.stringify(items));
    } catch (e) {
      console.warn("Could not load default showroom items:", e);
      localStorage.setItem(STORAGE_KEYS.SHOWROOM, JSON.stringify([]));
    }
  }

  // Load default settings if not present
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    const defaults = {
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      cursorEmoji: false,
      floatingEquipped: false
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaults));
  }

  // Load accounts if not present
  if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([]));
  }

  // Load active album pointer
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_ALBUM)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ALBUM, JSON.stringify({ activeAlbum: "demo" }));
  }
}

export const DEFAULT_EMOJI_FALLBACK = "🎪";
export const DEFAULT_SHOW_ROOM_LABEL = "Show Room";
export const DEFAULT_TOP_HAT_LABEL = "Top Hat";
