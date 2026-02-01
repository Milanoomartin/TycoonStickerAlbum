export const APP_ROUTES = [
  { path: "/", name: "Stickers", icon: "🌟" },
  { path: "/trades", name: "Trades", icon: "🔄" },
  { path: "/vault", name: "Vault", icon: "🏆" },
  { path: "/showroom", name: "Show Room", icon: "🎪" },
  { path: "/accounts", name: "Accounts", icon: "👤" },
  { path: "/album-generator", name: "Album Generator", icon: "⚙️" },
  { path: "/settings", name: "Settings", icon: "⚡" }
];

export const STORAGE_KEYS = {
  APP_STATE: "mogo_app_state",
  ACCOUNTS: "mogo_accounts",
  STICKERS: "mogo_stickers",
  SHOWROOM: "mogo_showroom",
  TRADES: "mogo_trades",
  VAULT: "mogo_vault",
  SETTINGS: "mogo_settings",
  ACTIVE_ALBUM: "mogo_active_album",
  CURRENT_THEME: "mogo_current_theme"
};

export const STICKER_STATUS = {
  MISSING: "missing",
  OWNED: "owned",
  DUPE: "dupe"
};

export const ANIMATION_TYPES = [
  "bounce",
  "spin",
  "pulse",
  "slide",
  "fade",
  "wiggle",
  "rotate"
];

export const TRIGGER_RULES = [
  "hover",
  "always"
];

export const REDUCED_MOTION_MEDIA = "(prefers-reduced-motion: reduce)";

export const EMOJI_PRESETS = {
  cute: ["😊", "😻", "🐻", "🦋", "🌸", "🎀", "💕", "⭐", "🍓", "🎪"],
  luxury: ["💎", "👑", "🏆", "✨", "🌹", "🥂", "🎩", "💍", "🦢", "🌟"],
  spooky: ["👻", "🦇", "🕷️", "🕸️", "💀", "🎃", "🔮", "⚡", "🌙", "😱"],
  jungle: ["🐯", "🦁", "🐵", "🌴", "🌿", "🦚", "🐍", "🥥", "🌺", "🍃"],
  ocean: ["🐙", "🦈", "🐠", "🐚", "🌊", "⛵", "🐚", "🪸", "🧜", "💙"],
  space: ["🚀", "🛸", "👽", "⭐", "🌌", "🪐", "🌠", "👾", "🔭", "🌕"],
  holiday: ["🎄", "🎅", "🎁", "⛄", "🔔", "🕯️", "🎉", "❄️", "🌟", "☃️"]
};

export const TRADE_FEST_DAILY_LIMIT = 10;
export const DEFAULT_DAILY_LIMIT = 5;
