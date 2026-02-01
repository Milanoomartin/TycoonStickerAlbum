import * as stickersLogic from "./stickers.logic.js";
import * as accountsLogic from "../accounts/accounts.logic.js";
import { getCompletionPercent, getStickerStatus } from "../../state/selectors.js";
import { getCurrentAlbum } from "../../state/store.js";
import { STICKER_STATUS } from "../../config/constants.js";

export function renderStickerScreen() {
  const app = document.getElementById("app");
  const album = getCurrentAlbum();
  const accounts = accountsLogic.getAllAccounts();
  const activeAccount = accountsLogic.getActiveAccount();
  const sets = stickersLogic.getAlbumSets();

  if (!activeAccount) {
    app.innerHTML = '<div class="screen-container"><p>No accounts. Create one in Accounts.</p></div>';
    return;
  }

  const progress = stickersLogic.getAccountProgress(activeAccount.id);
  const percent = getCompletionPercent(progress.owned + progress.dupe, progress.total);

  let html = `
    <div class="screen-container">
      <h1>${album?.theme?.brandTitle || "Album"} - ${album?.albumName || "Unknown"}</h1>
      <p>Active: <strong>${activeAccount.name}</strong></p>
      
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
      <p class="progress-text">${progress.owned} Owned • ${progress.dupe} Dupes • ${progress.missing} Missing (${percent}%)</p>

      <div class="import-export">
        <button class="btn btn-small" onclick="window.appAPI.exportStickers?.('csv')">📥 CSV Export</button>
        <button class="btn btn-small" onclick="window.appAPI.exportStickers?.('json')">📥 JSON Export</button>
        <button class="btn btn-small" onclick="document.getElementById('import-file').click()">📤 Import CSV</button>
        <input id="import-file" type="file" accept=".csv" style="display:none" onchange="window.appAPI.importCSV?.(event)" />
      </div>

      <div class="sets-container">
  `;

  sets.forEach((set, setIdx) => {
    html += `
      <div class="set-card">
        <h2>Set ${set.setNumber}: ${set.setName}</h2>
        <div class="stickers-grid">
    `;
    
    set.stickers?.forEach(sticker => {
      const status = getStickerStatus(activeAccount.id, album.albumId, sticker.stickerId);
      const statusClass = status === STICKER_STATUS.OWNED ? "owned" : status === STICKER_STATUS.DUPE ? "dupe" : "missing";
      const flagsHtml = `
        ${sticker.isGold ? '<span class="flag gold">🏅 Gold</span>' : ''}
        ${sticker.isPrestige ? '<span class="flag prestige">👑 Prestige</span>' : ''}
        ${sticker.isBlitzEligibleDefault ? '<span class="flag blitz">⚡ Blitz</span>' : ''}
      `.trim();

      html += `
        <div class="sticker-card ${statusClass}" onclick="window.appAPI.toggleSticker?.('${sticker.stickerId}')">
          <div class="sticker-name">${sticker.name}</div>
          <div class="sticker-stars">${'⭐'.repeat(sticker.stars)}</div>
          <div class="sticker-flags">${flagsHtml}</div>
          <div class="sticker-status">${statusClass.toUpperCase()}</div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  app.innerHTML = html;

  window.appAPI.toggleSticker = (stickerId) => {
    stickersLogic.toggleStickerStatus(activeAccount.id, stickerId);
    renderStickerScreen(); // Re-render to update UI
  };

  window.appAPI.exportStickers = (format) => {
    import("./stickers.importExport.js").then(mod => {
      mod.exportStickers(format, activeAccount.id, album.albumId, sets);
    });
  };

  window.appAPI.importCSV = (event) => {
    import("./stickers.importExport.js").then(mod => {
      mod.importCSV(event, activeAccount.id, album.albumId);
      setTimeout(() => renderStickerScreen(), 500);
    });
  };
}
