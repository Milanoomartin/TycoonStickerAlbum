import { getCurrentAlbum } from "../../../state/store.js";

export function generateAlbumJson(albumInput, themeInput, setsInput) {
  const album = {
    albumId: albumInput.albumId.toLowerCase().replace(/\s+/g, "_"),
    albumName: albumInput.albumName,
    seasonName: albumInput.seasonName,
    versionLabel: albumInput.versionLabel || "v1.0",
    theme: {
      brandTitle: themeInput.brandTitle || albumInput.albumName,
      topHatLabel: themeInput.topHatLabel || "Top Hat",
      showRoomLabel: themeInput.showRoomLabel || "Show Room",
      headerTagline: themeInput.headerTagline || "",
      defaultEmojiPool: parseEmojiPool(themeInput.emojiPool),
      emojiThemePrompt: themeInput.emojiThemePrompt || ""
    },
    sets: setsInput
  };
  return album;
}

export function validateAlbum(albumObj) {
  const errors = [];

  if (!albumObj.albumId) errors.push("Album ID is required");
  if (!albumObj.albumName) errors.push("Album Name is required");
  if (!albumObj.sets || albumObj.sets.length === 0) errors.push("At least one set is required");

  albumObj.sets?.forEach((set, idx) => {
    if (!set.setNumber) errors.push(`Set ${idx + 1}: setNumber is required`);
    if (!set.setName) errors.push(`Set ${idx + 1}: setName is required`);
    if (!set.stickers || set.stickers.length === 0) {
      errors.push(`Set ${idx + 1}: at least one sticker is required`);
    }

    set.stickers?.forEach((sticker, sIdx) => {
      if (!sticker.stickerId) errors.push(`Set ${idx + 1} Sticker ${sIdx + 1}: stickerId is required`);
      if (!sticker.name) errors.push(`Set ${idx + 1} Sticker ${sIdx + 1}: name is required`);
      if (typeof sticker.stars !== "number" || sticker.stars < 1 || sticker.stars > 5) {
        errors.push(`Set ${idx + 1} Sticker ${sIdx + 1}: stars must be 1-5`);
      }
    });
  });

  return errors;
}

export function parseEmojiPool(emojiString) {
  if (!emojiString) return [];
  return emojiString.match(/[\p{Emoji}]/gu) || [];
}

export function generateAutoIds(sets) {
  return sets.map((set, setIdx) => ({
    ...set,
    stickers: set.stickers.map((sticker, sIdx) => ({
      ...sticker,
      stickerId: sticker.stickerId || `${set.setNumber}-${sIdx + 1}`
    }))
  }));
}
