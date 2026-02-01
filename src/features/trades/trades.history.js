import { STORAGE_KEYS } from "../../config/constants.js";

export function getTradeHistory(accountId) {
  const trades = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRADES) || "[]");
  return trades.filter(t => t.fromAccountId === accountId && t.completedAt);
}

export function getTradeStats(accountId) {
  const history = getTradeHistory(accountId);
  return {
    totalTrades: history.length,
    thisWeek: history.filter(t => {
      const d = new Date(t.completedAt);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length
  };
}
