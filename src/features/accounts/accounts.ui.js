import * as accountsLogic from "./accounts.logic.js";
import { store } from "../../state/store.js";
import { showToast } from "../../ui/toast.js";
import { showModal } from "../../ui/modals.js";

export function renderAccountScreen() {
  const app = document.getElementById("app");
  const accounts = accountsLogic.getAllAccounts();
  const active = accountsLogic.getActiveAccount();

  app.innerHTML = `
    <div class="screen-container">
      <h1>Accounts</h1>
      <button class="btn btn-primary" onclick="window.appAPI.showAddAccountModal?.()">+ New Account</button>
      
      <div class="accounts-grid">
        ${accounts.map(acc => `
          <div class="account-card" style="border-color: ${acc.color}">
            <div class="account-header">
              <h3>${acc.name}</h3>
              <div class="account-actions">
                <button class="btn-icon" onclick="window.appAPI.selectAccount?.('${acc.id}')" title="Select">✓</button>
                <button class="btn-icon" onclick="window.appAPI.editAccountModal?.('${acc.id}')" title="Edit">✏️</button>
                <button class="btn-icon" onclick="window.appAPI.deleteAccount?.('${acc.id}')" title="Delete">🗑️</button>
              </div>
            </div>
            <p class="account-meta">Created: ${new Date(acc.createdAt).toLocaleDateString()}</p>
            ${active?.id === acc.id ? '<p class="account-active">🟢 Active</p>' : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Set up window API for buttons
  window.appAPI.showAddAccountModal = () => {
    showModal({
      title: "New Account",
      html: `
        <input id="modal-acc-name" type="text" placeholder="Account Name" />
        <input id="modal-acc-color" type="color" value="#FF6B9D" />
      `,
      buttons: [
        {
          text: "Create",
          onclick: () => {
            const name = document.getElementById("modal-acc-name").value.trim();
            const color = document.getElementById("modal-acc-color").value;
            if (name) {
              accountsLogic.createAccount(name, color);
              showToast(`Account "${name}" created!`);
            }
          }
        },
        { text: "Cancel", onclick: () => {} }
      ]
    });
  };

  window.appAPI.selectAccount = (accId) => {
    accountsLogic.setActiveAccount(accId);
    showToast("Account switched");
  };

  window.appAPI.editAccountModal = (accId) => {
    const acc = accountsLogic.getAccountById(accId);
    if (!acc) return;
    showModal({
      title: "Edit Account",
      html: `
        <input id="modal-acc-name" type="text" placeholder="Account Name" value="${acc.name}" />
        <input id="modal-acc-color" type="color" value="${acc.color}" />
      `,
      buttons: [
        {
          text: "Save",
          onclick: () => {
            const name = document.getElementById("modal-acc-name").value.trim();
            const color = document.getElementById("modal-acc-color").value;
            if (name) {
              accountsLogic.updateAccount(accId, { name, color });
              showToast("Account updated");
            }
          }
        },
        { text: "Cancel", onclick: () => {} }
      ]
    });
  };

  window.appAPI.deleteAccount = (accId) => {
    if (confirm("Delete this account? This cannot be undone.")) {
      accountsLogic.deleteAccount(accId);
      showToast("Account deleted");
    }
  };
}
