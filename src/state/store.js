import { STORAGE_KEYS } from "../config/constants.js";

const listeners = [];
let state = {};

export const store = {
  subscribe(fn) {
    listeners.push(fn);
  },
  set(newState) {
    state = { ...state, ...newState };
    localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
    listeners.forEach(fn => fn(state));
  },
  getState() {
    return { ...state };
  }
};

export function init(initialState = {}) {
  state = initialState;
}

let currentAlbum = null;
let currentTheme = null;

export async function handleAlbumSwitch(albumId) {
  try {
    let targetAlbum = albumId;

    if (!targetAlbum) {
      const pointer = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_ALBUM) || '{"activeAlbum": "demo"}');
      targetAlbum = pointer.activeAlbum;
    }

    // Load album JSON
    const albumRes = await fetch(`src/data/albums/album_${targetAlbum}.json`);
    if (!albumRes.ok) throw new Error(`Album ${targetAlbum} not found`);
    
    const album = await albumRes.json();
    currentAlbum = album;
    currentTheme = album.theme;

    // Update storage
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ALBUM, JSON.stringify({ activeAlbum: targetAlbum }));
    localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, JSON.stringify(currentTheme));

    // Notify listeners
    store.set({ activeAlbum: album, activeAlbumTheme: currentTheme });

    return album;
  } catch (e) {
    console.error("Album switch failed:", e);
    // Fallback to demo album
    if (albumId !== "demo") {
      return handleAlbumSwitch("demo");
    }
  }
}

export function getCurrentAlbum() {
  return currentAlbum;
}

export function getCurrentTheme() {
  return currentTheme;
}
