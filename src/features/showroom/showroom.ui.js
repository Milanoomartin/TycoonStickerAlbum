import * as showroomLogic from "./showroom.logic.js";
import { showModal } from "../../ui/modals.js";
import { showToast } from "../../ui/toast.js";
import { playShowroomSound } from "./showroom.audio.js";

export function renderShowroomScreen() {
  const app = document.getElementById("app");
  const items = showroomLogic.getAllShowroomItems();
  const equipped = showroomLogic.getEquippedItem();

  app.innerHTML = `
    <div class="screen-container">
      <h1>Show Room</h1>
      ${equipped ? `<p>Equipped: <strong>${equipped.name}</strong> ${equipped.emoji}</p>` : '<p>No item equipped.</p>'}
      
      <button class="btn btn-primary" onclick="window.appAPI.showAddItemModal?.()">+ Add Item</button>

      <div class="showroom-grid">
        ${items.map(item => `
          <div class="showroom-item" id="showroom-${item.id}" onmouseover="window.appAPI.hoverItem?.('${item.id}')">
            <div class="item-preview">
              ${item.imageSrc ? `<img src="${item.imageSrc}" alt="${item.name}" style="max-width: 100px;" />` : `<div style="font-size: 3em;">${item.emoji}</div>`}
            </div>
            <h4>${item.name}</h4>
            <p class="item-emoji">${item.emoji}</p>
            <p class="item-animation">${item.animationType}</p>
            <div class="item-actions">
              <button class="btn-icon" onclick="window.appAPI.equipItem?.('${item.id}')" title="Equip">👕</button>
              <button class="btn-icon" onclick="window.appAPI.editItemModal?.('${item.id}')" title="Edit">✏️</button>
              <button class="btn-icon" onclick="window.appAPI.deleteItem?.('${item.id}')" title="Delete">🗑️</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  window.appAPI.hoverItem = (itemId) => {
    const item = showroomLogic.getAllShowroomItems().find(i => i.id === itemId);
    if (item?.soundUrl) {
      playShowroomSound(item.soundUrl);
    }
    // Trigger animation CSS class
    const el = document.getElementById(`showroom-${itemId}`);
    if (el) {
      el.classList.add(`animate-${item.animationType}`);
      setTimeout(() => el.classList.remove(`animate-${item.animationType}`), 500);
    }
  };

  window.appAPI.equipItem = (itemId) => {
    showroomLogic.setEquippedItem(itemId);
    showToast("Item equipped!");
    renderShowroomScreen();
  };

  window.appAPI.editItemModal = (itemId) => {
    const item = showroomLogic.getAllShowroomItems().find(i => i.id === itemId);
    if (!item) return;

    showModal({
      title: "Edit Item",
      html: `
        <input id="modal-item-name" type="text" placeholder="Name" value="${item.name}" />
        <input id="modal-item-emoji" type="text" placeholder="Emoji" value="${item.emoji}" maxlength="5" />
        <select id="modal-item-anim">
          <option value="bounce" ${item.animationType === "bounce" ? "selected" : ""}>Bounce</option>
          <option value="spin" ${item.animationType === "spin" ? "selected" : ""}>Spin</option>
          <option value="pulse" ${item.animationType === "pulse" ? "selected" : ""}>Pulse</option>
        </select>
        <input id="modal-item-sound" type="url" placeholder="Sound URL" value="${item.soundUrl || ''}" />
      `,
      buttons: [
        {
          text: "Save",
          onclick: () => {
            showroomLogic.updateShowroomItem(itemId, {
              name: document.getElementById("modal-item-name").value,
              emoji: document.getElementById("modal-item-emoji").value,
              animationType: document.getElementById("modal-item-anim").value,
              soundUrl: document.getElementById("modal-item-sound").value
            });
            showToast("Item updated");
            renderShowroomScreen();
          }
        },
        { text: "Cancel", onclick: () => {} }
      ]
    });
  };

  window.appAPI.showAddItemModal = () => {
    showModal({
      title: "Add Show Room Item",
      html: `
        <input id="modal-item-name" type="text" placeholder="Item Name" />
        <input id="modal-item-emoji" type="text" placeholder="Emoji" maxlength="5" />
        <select id="modal-item-anim">
          <option value="bounce">Bounce</option>
          <option value="spin">Spin</option>
          <option value="pulse">Pulse</option>
        </select>
        <input id="modal-item-sound" type="url" placeholder="Sound URL (optional)" />
        <input id="modal-item-image" type="file" accept="image/*" />
      `,
      buttons: [
        {
          text: "Create",
          onclick: async () => {
            const name = document.getElementById("modal-item-name").value.trim();
            const emoji = document.getElementById("modal-item-emoji").value.trim();
            if (!name || !emoji) return;

            let imageSrc = null;
            const fileInput = document.getElementById("modal-item-image");
            if (fileInput?.files?.[0]) {
              imageSrc = await uploadAndResizeImage(fileInput.files[0]);
            }

            showroomLogic.addShowroomItem({
              name,
              emoji,
              imageSrc,
              animationType: document.getElementById("modal-item-anim").value,
              soundUrl: document.getElementById("modal-item-sound").value
            });
            showToast("Item added!");
            renderShowroomScreen();
          }
        },
        { text: "Cancel", onclick: () => {} }
      ]
    });
  };

  window.appAPI.deleteItem = (itemId) => {
    if (confirm("Delete this item?")) {
      showroomLogic.deleteShowroomItem(itemId);
      showToast("Item deleted");
      renderShowroomScreen();
    }
  };
}

async function uploadAndResizeImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 128, 128);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
