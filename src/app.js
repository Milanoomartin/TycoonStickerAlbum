import { APP_ROUTES, STORAGE_KEYS } from "./config/constants.js";
import { loadDefaults } from "./config/defaults.js";
import { store, handleAlbumSwitch, init as initStore } from "./state/store.js";
import { migrate, loadState } from "./state/storage.js";
import { renderNavigation } from "./ui/navigation.js";
import { renderRouter } from "./ui/router.js";

/**
 * Bootstrap app
 * 1. Load defaults
 * 2. Migrate storage schema
 * 3. Init store with persisted state
 * 4. Render navigation + router
 * 5. Load active album theme
 */
async function initApp() {
  try {
    loadDefaults();
    migrate();
    initStore(loadState(STORAGE_KEYS.APP_STATE) || {});
    
    // Subscribe to state changes
    store.subscribe(() => {
      renderNavigation();
      renderRouter();
    });
    
    // Render initial UI
    renderNavigation();
    renderRouter();
    
    // Load active album theme + showroom
    handleAlbumSwitch();
    
    // Expose globals for UI handlers
    window.appAPI = {
      navigateTo: (route) => {
        window.location.hash = route;
      },
      getState: () => store.getState(),
      saveState: (key, data) => {
        const state = store.getState();
        state[key] = data;
        store.set(state);
      }
    };
    
    console.log("✅ MoGo Sticker Tycoon initialized");
  } catch (e) {
    console.error("Init failed:", e);
  }
}

window.addEventListener("DOMContentLoaded", initApp);
