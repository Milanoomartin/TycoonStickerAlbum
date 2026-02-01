import { getCurrentAlbum } from "../../state/store.js";
import { getAccountStickerStats, setStickerStatus, getStickerStatus } from "../../state/selectors.js";
import { STICKER_STATUS } from "../../config/constants.js";

export function getAlbumSets() {
  const album = getCurrentAlbum();
  return album?.sets || [];
}

export function toggleStickerStatus(accountId, stickerId) {
  const current = getStickerStatus(accountId, getCurrentAlbum().albumId, stickerId);
  let next = STICKER_STATUS.MISSING;
  
  if (current === STICKER_STATUS.MISSING) next = STICKER_STATUS.OWNED;
  else if (current === STICKER_STATUS.OWNED) next = STICKER_STATUS.DUPE;
  else if (current === STICKER_STATUS.DUPE) next = STICKER_STATUS.MISSING;

  setStickerStatus(accountId, getCurrentAlbum().albumId, stickerId, next);
  return next;
}

export function getAccountProgress(accountId) {
  const album = getCurrentAlbum();
  const sets = getAlbumSets();
  return getAccountStickerStats(accountId, album.albumId, sets);
}
