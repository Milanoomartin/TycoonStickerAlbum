import { STORAGE_KEYS } from "../../config/constants.js";
import { store } from "../../state/store.js";

export function getAllShowroomItems() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOWROOM) || "[]");
}

export function addShowroomItem(item) {
  const items = getAllShowroomItems();
  const id = item.id || `showroom_${Date.now()}`;
  const newItem = {
    id,
    name: item.name,
    emoji: item.emoji,
    imageSrc: item.imageSrc, // base64 or URL
    animationType: item.animationType,
    triggerRule: item.triggerRule,
    soundUrl: item.soundUrl,
    createdAt: new Date().toISOString()
  };
  items.push(newItem);
  localStorage.setItem(STORAGE_KEYS.SHOWROOM, JSON.stringify(items));
  return newItem;
}

export function updateShowroomItem(itemId, updates) {
  const items = getAllShowroomItems();
  const idx = items.findIndex(i => i.id === itemId);
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.SHOWROOM, JSON.stringify(items));
  }
}

export function deleteShowroomItem(itemId) {
  const items = getAllShowroomItems().filter(i => i.id !== itemId);
  localStorage.setItem(STORAGE_KEYS.SHOWROOM, JSON.stringify(items));
  // If deleted item is equipped, unequip it
  const equipped = getEquippedItem();
  if (equipped?.id === itemId) {
    setEquippedItem(null);
  }
}

export function getEquippedItem() {
  const itemId = localStorage.getItem("mogo_equipped_item");
  if (!itemId) return null;
  return getAllShowroomItems().find(i => i.id === itemId);
}

export function setEquippedItem(itemId) {
  if (itemId) {
    localStorage.setItem("mogo_equipped_item", itemId);
  } else {
    localStorage.removeItem("mogo_equipped_item");
  }
  store.set({ equippedItem: itemId });
}
