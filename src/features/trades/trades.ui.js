import * as tradesLogic from "./trades.logic.js";
import * as accountsLogic from "../accounts/accounts.logic.js";
import { showModal } from "../../ui/modals.js";
import { showToast } from "../../ui/toast.js";

export function renderTradesScreen() {
  const app = document.getElementById("app");
  const accounts = accountsLogic.getAllAccounts();
  const active = accountsLogic.getActiveAccount();
  const trades = tradesLogic.getAllTrades();

  const pendingTrades = trades.filter(t => !t.completedAt && t.fromAccountId === active?.id);
  const dailyCount = tradesLogic.getDailyTradeCount(active?.id);
  const tradeFest = JSON.parse(localStorage.getItem("mogo_trade_fest") || "false");
  const dailyLimit = tradeFest ? 10 : 5;

  app.innerHTML = `
    <div class="screen-container">
      <h1>Trades</h1>
      <p>Active: <strong>${active?.name}</strong></p>
      
      <div class="trade-header">
        <p>Daily Trades: ${dailyCount} / ${dailyLimit}</p>
        <label>
          <input type="checkbox" ${tradeFest ? "checked" : ""} onchange="window.appAPI.toggleTradeFest?.()">
          Trade Fest (10 daily)
        </label>
      </div>

      <button class="btn btn-primary" onclick="window.appAPI.showNewTradeModal?.()">+ New Trade Plan</button>

      <h2>Pending Trades</h2>
      <div class="trades-list">
        ${pendingTrades.map(trade => `
          <div class="trade-item">
            <h4>${trade.stickerName || "Trade"}</h4>
            <p>${trade.fromAccountName} → ${trade.toAccountName}</p>
            <small>${new Date(trade.createdAt).toLocaleDateString()}</small>
            <div class="trade-actions">
              <button class="btn-icon" onclick="window.appAPI.completeTrade?.('${trade.id}')">✓ Complete</button>
              <button class="btn-icon" onclick="window.appAPI.deleteTrade?.('${trade.id}')">🗑️</button>
            </div>
          </div>
        `).join('') || '<p>No pending trades.</p>'}
      </div>
    </div>
  `;

  window.appAPI.toggleTradeFest = () => {
    const current = JSON.parse(localStorage.getItem("mogo_trade_fest") || "false");
    localStorage.setItem("mogo_trade_fest", JSON.stringify(!current));
    renderTradesScreen();
  };

  window.appAPI.showNewTradeModal = () => {
    const otherAccounts = accounts.filter(a => a.id !== active?.id);
    
    showModal({
      title: "New Trade Plan",
      html: `
        <label>To Account:</label>
        <select id="modal-to-account">
          ${otherAccounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
        </select>
        <label>Sticker Name:</label>
        <input id="modal-sticker-name" type="text" placeholder="Sticker Name" />
        <button class="btn btn-small" onclick="window.appAPI.loadSuggestions?.()">💡 Get Suggestions</button>
        <div id="suggestions-list"></div>
      `,
      buttons: [
        {
          text: "Create",
          onclick: () => {
            const toId = document.getElementById("modal-to-account").value;
            const stickerName = document.getElementById("modal-sticker-name").value.trim();
            if (stickerName) {
              const toAcc = accountsLogic.getAccountById(toId);
              tradesLogic.createTradePlan({
                fromAccountId: active.id,
                fromAccountName: active.name,
                toAccountId: toId,
                toAccountName: toAcc.name,
                stickerName
              });
              showToast("Trade plan created");
            }
          }
        },
        { text: "Cancel", onclick: () => {} }
      ]
    });
  };

  window.appAPI.loadSuggestions = () => {
    const toId = document.getElementById("modal-to-account").value;
    const suggestions = tradesLogic.suggestTrades(active.id, toId);
    const html = suggestions.map(s => `
      <div style="padding: 8px; background: #f0f0f0; margin: 4px 0; cursor: pointer;" onclick="document.getElementById('modal-sticker-name').value = '${s.stickerName}'">
        ${s.stickerName} (${s.setName})
      </div>
    `).join('');
    document.getElementById("suggestions-list").innerHTML = html || "<p>No suggestions.</p>";
  };

  window.appAPI.completeTrade = (tradeId) => {
    tradesLogic.completeTradePlan(tradeId);
    showToast("Trade marked complete");
    renderTradesScreen();
  };

  window.appAPI.deleteTrade = (tradeId) => {
    tradesLogic.deleteTradePlan(tradeId);
    showToast("Trade deleted");
    renderTradesScreen();
  };
}
