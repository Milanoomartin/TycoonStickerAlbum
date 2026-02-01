import * as generatorLogic from "./generator.logic.js";
import { createThemePrompt } from "./generator.aiPrompt.js";
import { downloadAlbumFiles } from "./generator.export.js";
import { EMOJI_PRESETS } from "../../../config/constants.js";
import { showToast } from "../../../ui/toast.js";
import { showModal } from "../../../ui/modals.js";

let currentGeneratorState = {
  albumInput: {},
  themeInput: {},
  setsInput: [],
  validationErrors: []
};

export function renderAlbumGenerator() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="screen-container">
      <h1>Album Generator</h1>
      <p>Create new album definitions quickly. Downloads album JSON for placement in /src/data/albums/</p>

      <div class="generator-steps">
        <!-- Step 1: Album Details -->
        <fieldset>
          <legend>Step 1: Album Details</legend>
          <input id="
