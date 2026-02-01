import { setStickerStatus } from "../../state/selectors.js";
import { showToast } from "../../ui/toast.js";
import { STICKER_STATUS } from "../../config/constants.js";

export function exportStickers(format, accountId, albumId, sets) {
  if (format === "csv") {
    exportAsCSV(accountId, albumId, sets);
  } else if (format === "json") {
    exportAsJSON(accountId, albumId, sets);
  }
}

function exportAsCSV(accountId, albumId, sets) {
  let csv = "SetNumber,SetName,StickerID,StickerName,Stars,Status\n";
  
  sets.forEach(set => {
    set.stickers?.forEach(sticker => {
      const status = JSON.parse(localStorage.getItem("mogo_stickers") || "{}")[
        `${accountId}:${albumId}:${sticker.stickerId}`
      ] || "missing";
      csv += `${set.setNumber},${set.setName},${sticker.stickerId},${sticker.name},${sticker.stars},${status}\n`;
    });
  });

  downloadFile(csv, `stickers-${accountId}-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
  showToast("Stickers exported as CSV");
}

function exportAsJSON(accountId, albumId, sets) {
  const stickerData = JSON.parse(localStorage.getItem("mogo_stickers") || "{}");
  const data = {
    export: new Date().toISOString(),
    accountId,
    albumId,
    stickers: sets.map(set => ({
      setNumber: set.setNumber,
      setName: set.setName,
      stickers: set.stickers.map(s => ({
        stickerId: s.stickerId,
        name: s.name,
        stars: s.stars,
        status: stickerData[`${accountId}:${albumId}:${s.stickerId}`] || "missing"
      }))
    }))
  };

  downloadFile(JSON.stringify(data, null, 2), `stickers-${accountId}.json`, "application/json");
  showToast("Stickers exported as JSON");
}

export function importCSV(event, accountId, albumId) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result;
    const lines = text.split("\n").slice(1); // Skip header
    let count = 0;

    lines.forEach(line => {
      if (!line.trim()) return;
      const [, , stickerId, , , status] = line.split(",");
      if (stickerId && status) {
        setStickerStatus(accountId, albumId, stickerId, status.toLowerCase());
        count++;
      }
    });

    showToast(`Imported ${count} stickers`);
  };
  reader.readAsText(file);
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
