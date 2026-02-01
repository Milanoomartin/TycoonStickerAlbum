import { EMOJI_PRESETS } from "../../config/constants.js";

export function parseTheme(themeObj) {
  return {
    brandTitle: themeObj?.brandTitle || "Brand",
    topHatLabel: themeObj?.topHatLabel || "Top Hat",
    showRoomLabel: themeObj?.showRoomLabel || "Show Room",
    headerTagline: themeObj?.headerTagline || "",
    defaultEmojiPool: themeObj?.defaultEmojiPool || [],
    emojiThemePrompt: themeObj?.emojiThemePrompt || ""
  };
}

export function suggestEmojis(pool, prompt) {
  // Return suggested emojis from pool or preset
  if (pool && pool.length > 0) {
    return pool;
  }
  // Return a default emoji set
  return EMOJI_PRESETS.cute;
}

export function getEmojiPoolPresets() {
  return EMOJI_PRESETS;
}
