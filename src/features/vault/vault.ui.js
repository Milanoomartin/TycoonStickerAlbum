import * as vaultLogic from "./vault.logic.js";
import * as accountsLogic from "../accounts/accounts.logic.js";
import { showModal } from "../../ui/modals.js";
import { showToast } from "../../ui/toast.js";

export function renderVaultScreen() {
  const app = document.getElementById("app");
  const active = accountsLogic.getActiveAccount();
  const stats = vaultLogic.getVaultStats(active?.id);
  const burnResult = vaultLogic.burnDupes(active?.id);

  app.innerHTML = `
    <div class="screen-container">
      <h1>Vault</h1>
      <p>Active: <strong>${active?.name}</strong></p>
      
      <div class="vault-stats">
        <div class="stat-box">
          <h3>${stats.totalStars}</h3>
          <p>Total Stars</p>
        </div>
        <div class="stat-box">
          <h3>${stats.dupeStars}</h3>
          <p>Dupe Stars (Burnable)</p>
        </div>
        <div class="stat-box">
          <h3>${burnResult.startsReward}</h3>
          <p>Stars from Burn</p>
        </div>
      </div>

      <div class="vault-actions">
        <button class="btn btn-primary" onclick="window.appAPI.burnDupes?.()">🔥 Burn Dupes</button>
        <button class="btn btn-primary" onclick="window.appAPI.simulateOpening?.()">🎰 Simulate Opening</button>
      </div>

      <div id="simulation-results"></div>
    </div>
  `;

  window.appAPI.burnDupes = () => {
    showModal({
      title: "Burn Dupes?",
      html: `<p>You'll burn ${burnResult.starsBurned} stars and get ${burnResult.startsReward} stars back.</p>`,
      buttons: [
        { text: "Confirm", onclick: () => showToast(`Burned ${burnResult.starsBurned} stars!`) },
        { text: "Cancel", onclick: () => {} }
      ]
    });
  };

  window.appAPI.simulateOpening = () => {
    const result = vaultLogic.simulateVaultOpening(active?.id, 10);
    const html = result.map(r => `<div>${r.stickerName} (${r.stars}⭐)</div>`).join('');
    document.getElementById("simulation-results").innerHTML = `<div class="sim-results"><h3>Opened 10:</h3>${html}</div>`;
  };
}
