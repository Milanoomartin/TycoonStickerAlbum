import { STORAGE_KEYS } from "../../config/constants.js";
import { getStickerStatus } from "../../state/selectors.js";
import { getCurrentAlbum } from "../../state/store.js";

export function getVaultStats(accountId) {
  const album = getCurrentAlbum();
  let totalStars = 0;
  let dupeStars = 0;

  album.sets?.forEach(set => {
    set.stickers?.forEach(sticker => {
      const status = getStickerStatus(accountId, album.albumId, sticker.stickerId);
      if (status === "dupe") {
        dupeStars += sticker.stars;
      }
      if (status === "owned" || status === "dupe") {
        totalStars += sticker.stars;
      }
    });
  });

  return { totalStars, dupeStars };
}

export function burnDupes(accountId) {
  const stats = getVaultStats(accountId);
  return {
    starsBurned: stats.dupeStars,
    startsReward: Math.floor(stats.dupeStars / 10)
  };
}

export function simulateVaultOpening(accountId, numOpens = 1) {
  const album = getCurrentAlbum();
  const openings = [];

  for (let i = 0; i < numOpens; i++) {
    const randomSet = album.sets[Math.floor(Math.random() * album.sets.length)];
    const randomSticker = randomSet.stickers[Math.floor(Math.random() * randomSet.stickers.length)];
    openings.push({
      stickerId: randomSticker.stickerId,
      stickerName: randomSticker.name,
      stars: randomSticker.stars
    });
  }

  return openings;
}
