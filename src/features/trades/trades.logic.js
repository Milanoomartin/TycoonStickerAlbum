import { STORAGE_KEYS } from "../../config/constants.js";
import { getStickerStatus } from "../../state/selectors.js";
import { getCurrentAlbum } from "../../state/store.js";

export function getAllTrades() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRADES) || "[]");
}

export function createTradePlan(tradeData) {
  const trades = getAllTrades();
  const id = `trade_${Date.now()}`;
  const plan = {
    id,
    ...tradeData,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
  trades.push(plan);
  localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
  return plan;
}

export function completeTradePlan(tradeId) {
  const trades = getAllTrades();
  const idx = trades.findIndex(t => t.id === tradeId);
  if (idx !== -1) {
    trades[idx].completedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
  }
}

export function deleteTradePlan(tradeId) {
  const trades = getAllTrades().filter(t => t.id !== tradeId);
  localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
}

export function getDailyTradeCount(accountId) {
  const trades = getAllTrades();
  const today = new Date().toDateString();
  return trades.filter(t => {
    const createdDate = new Date(t.createdAt).toDateString();
    return createdDate === today && t.fromAccountId === accountId && !t.completedAt;
  }).length;
}

export function suggestTrades(fromAccountId, toAccountId) {
  const album = getCurrentAlbum();
  const suggestions = [];

  album.sets?.forEach(set => {
    set.stickers?.forEach(sticker => {
      const fromStatus = getStickerStatus(fromAccountId, album.albumId, sticker.stickerId);
      const toStatus = getStickerStatus(toAccountId, album.albumId, sticker.stickerId);

      // Suggest if sender has dupe and receiver is missing
      if (fromStatus === "dupe" && toStatus === "missing") {
        suggestions.push({
          stickerId: sticker.stickerId,
          stickerName: sticker.name,
          setName: set.setName
        });
      }
    });
  });

  return suggestions;
}
