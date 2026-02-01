import { STORAGE_KEYS } from "../../config/constants.js";
import { store } from "../../state/store.js";

export function getAllAccounts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || "[]");
}

export function getAccountById(accountId) {
  return getAllAccounts().find(a => a.id === accountId);
}

export function createAccount(name, color = "#FF6B9D") {
  const accounts = getAllAccounts();
  const id = `acc_${Date.now()}`;
  const account = { id, name, color, createdAt: new Date().toISOString() };
  accounts.push(account);
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  store.set({ accounts });
  return account;
}

export function updateAccount(accountId, updates) {
  const accounts = getAllAccounts();
  const idx = accounts.findIndex(a => a.id === accountId);
  if (idx !== -1) {
    accounts[idx] = { ...accounts[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    store.set({ accounts });
  }
}

export function deleteAccount(accountId) {
  const accounts = getAllAccounts().filter(a => a.id !== accountId);
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  store.set({ accounts });
}

export function setActiveAccount(accountId) {
  localStorage.setItem("mogo_active_account", accountId);
  store.set({ activeAccountId: accountId });
}

export function getActiveAccount() {
  const id = localStorage.getItem("mogo_active_account");
  if (id) return getAccountById(id);
  const accounts = getAllAccounts();
  return accounts.length > 0 ? accounts[0] : null;
}
