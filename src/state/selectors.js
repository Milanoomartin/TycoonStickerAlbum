import { STORAGE_KEYS, STICKER_STATUS } from "../config/constants.js";

export function getStickerStatus(accountId, albumId, stickerId) {
  const stickerData = JSON.parse(localStorage.getItem(STORAGE_KEYS.STICKERS) || "{}");
  const key = `${accountId}:${albumId}:${stickerId}`;
  return stickerData[key] || STICKER_STATUS.MISSING;
}

export function setStickerStatus(accountId, albumId, stickerId, status) {
  const stickerData = JSON.parse(localStorage.getItem(STORAGE_KEYS.STICKERS) || "{}");
  const key = `${accountId}:${albumId}:${stickerId}`;
  stickerData[key] = status;
  localStorage.setItem(STORAGE_KEYS.STICKERS, JSON.stringify(stickerData));
}

export function getAccountStickerStats(accountId, albumId, sets) {
  let owned = 0, dupe = 0, missing = 0;
  
  sets.forEach(set => {
    set.stickers?.forEach(sticker => {
      const status = getStickerStatus(accountId, albumId, sticker.stickerId);
      if (status === STICKER_STATUS.OWNED) owned++;
      else if (status === STICKER_STATUS.DUPE) dupe++;
      else missing++;
    });
  });

  return { owned, dupe, missing, total: owned + dupe + missing };
}

export function getCompletionPercent(owned, total) {
  return total === 0 ? 0 : Math.round((owned / total) * 100);
}
