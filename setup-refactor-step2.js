/**
 * Refactor Step 2
 * ----------------
 * Splits the remaining big components out of src/App.js into
 * src/components/*.js (and a small src/data/prep.js for the
 * CAS/UKVI Q&A data that PrepTab uses).
 *
 * Safe to run: it backs up your current App.js first
 * (as App.beforeStep2.js) before writing anything.
 *
 * Usage:
 *   node setup-refactor-step2.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const APP_PATH = path.join(SRC, "App.js");
const COMPONENTS_DIR = path.join(SRC, "components");
const DATA_DIR = path.join(SRC, "data");

function fail(msg) {
  console.error("\n❌ " + msg + "\n");
  process.exit(1);
}

if (!fs.existsSync(APP_PATH)) {
  fail(`Couldn't find ${APP_PATH}. Run this from your project root (where package.json is).`);
}

const original = fs.readFileSync(APP_PATH, "utf8");
const lines = original.split("\n");

// Grab an inclusive line range (1-indexed, like an editor) as text.
function sl(a, b) {
  return lines.slice(a - 1, b).join("\n");
}

// --- Locate the boundaries by searching for the function signatures ---
// (More robust than hardcoded line numbers in case of tiny diffs.)
function findLine(re, fromLine = 1) {
  for (let i = fromLine - 1; i < lines.length; i++) {
    if (re.test(lines[i])) return i + 1;
  }
  return -1;
}

const markers = {
  ReadinessRing: findLine(/^function ReadinessRing\(/),
  ReadinessScore: findLine(/^function ReadinessScore\(/),
  HeaderStatusPill: findLine(/^function HeaderStatusPill\(/),
  StatusDropdown: findLine(/^function StatusDropdown\(/),
  CountdownCard: findLine(/^function CountdownCard\(/),
  StepperBar: findLine(/^function StepperBar\(/),
  NextBestAction: findLine(/^function NextBestAction\(/),
  StageInfoModal: findLine(/^function StageInfoModal\(/),
  QuickCard: findLine(/^function QuickCard\(/),
  InfoExpand: findLine(/^function InfoExpand\(/),
  UniversityFinderFlow: findLine(/^function UniversityFinderFlow\(/),
  CostsTab: findLine(/^function CostsTab\(/),
  CAS_QA: findLine(/^const CAS_QA = \[/),
  UKVI_QA: findLine(/^const UKVI_QA = \[/),
  QA_CATEGORIES: findLine(/^const QA_CATEGORIES = \[/),
  REFUSAL_REASONS: findLine(/^const REFUSAL_REASONS = \[/),
  PrepTab: findLine(/^function PrepTab\(/),
  PackingTab: findLine(/^function PackingTab\(/),
  App: findLine(/^export default function App\(/),
};

for (const [name, ln] of Object.entries(markers)) {
  if (ln === -1) {
    fail(
      `Couldn't find "${name}" in App.js — your file may already be refactored, ` +
      `or differs from what this script expects. Send me the current App.js and I'll ` +
      `regenerate this script to match.`
    );
  }
}

// Find the line just before the NEXT marker (used as an exclusive-ish end).
function endOfFunctionBlock(startLine) {
  // Walk forward tracking brace depth; stop when we return to depth 0
  // after having gone positive (handles the function's closing brace).
  let depth = 0;
  let started = false;
  for (let i = startLine - 1; i < lines.length; i++) {
    const line = lines[i];
    for (const ch of line) {
      if (ch === "{") { depth++; started = true; }
      if (ch === "}") { depth--; }
    }
    if (started && depth === 0) return i + 1;
  }
  return lines.length;
}

function endOfArrayBlock(startLine) {
  let depth = 0;
  let started = false;
  for (let i = startLine - 1; i < lines.length; i++) {
    const line = lines[i];
    for (const ch of line) {
      if (ch === "[") { depth++; started = true; }
      if (ch === "]") { depth--; }
    }
    if (started && depth === 0) return i + 1;
  }
  return lines.length;
}

const ends = {
  ReadinessRing: endOfFunctionBlock(markers.ReadinessRing),
  ReadinessScore: endOfFunctionBlock(markers.ReadinessScore),
  HeaderStatusPill: endOfFunctionBlock(markers.HeaderStatusPill),
  StatusDropdown: endOfFunctionBlock(markers.StatusDropdown),
  StepperBar: endOfFunctionBlock(markers.StepperBar),
  NextBestAction: endOfFunctionBlock(markers.NextBestAction),
  StageInfoModal: endOfFunctionBlock(markers.StageInfoModal),
  QuickCard: endOfFunctionBlock(markers.QuickCard),
  InfoExpand: endOfFunctionBlock(markers.InfoExpand),
  UniversityFinderFlow: endOfFunctionBlock(markers.UniversityFinderFlow),
  CostsTab: endOfFunctionBlock(markers.CostsTab),
  CAS_QA: endOfArrayBlock(markers.CAS_QA),
  UKVI_QA: endOfArrayBlock(markers.UKVI_QA),
  QA_CATEGORIES: endOfArrayBlock(markers.QA_CATEGORIES),
  REFUSAL_REASONS: endOfArrayBlock(markers.REFUSAL_REASONS),
  PrepTab: endOfFunctionBlock(markers.PrepTab),
  PackingTab: endOfFunctionBlock(markers.PackingTab),
};

// --- Backup original App.js ---
const backupPath = path.join(SRC, "App.beforeStep2.js");
fs.writeFileSync(backupPath, original, "utf8");
console.log(`📦 Backed up current App.js -> ${path.relative(ROOT, backupPath)}`);

// --- Make sure dirs exist ---
fs.mkdirSync(COMPONENTS_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

function writeFile(fp, content) {
  fs.writeFileSync(fp, content.trimEnd() + "\n", "utf8");
  console.log(`✅ ${path.relative(ROOT, fp)}`);
}

// --- components/ReadinessRing.js ---
writeFile(
  path.join(COMPONENTS_DIR, "ReadinessRing.js"),
  `import React from "react";\n\n` +
  sl(markers.ReadinessRing, ends.ReadinessRing) +
  `\n\nexport default ReadinessRing;`
);

// --- components/ReadinessScore.js ---
writeFile(
  path.join(COMPONENTS_DIR, "ReadinessScore.js"),
  `import React from "react";\n` +
  `import { ALL_STAGE_NAMES, STAGES } from "../data/stages";\n` +
  `import { DOCS } from "../data/documents";\n` +
  `import ReadinessRing from "./ReadinessRing";\n\n` +
  sl(markers.ReadinessScore, ends.ReadinessScore) +
  `\n\nexport default ReadinessScore;`
);

// --- components/HeaderStatusPill.js ---
writeFile(
  path.join(COMPONENTS_DIR, "HeaderStatusPill.js"),
  `import React, { useState, useEffect, useRef } from "react";\n` +
  `import { STATUSES } from "../data/stages";\n\n` +
  sl(markers.HeaderStatusPill, ends.HeaderStatusPill) +
  `\n\nexport default HeaderStatusPill;`
);

// --- components/StatusDropdown.js ---
writeFile(
  path.join(COMPONENTS_DIR, "StatusDropdown.js"),
  `import React, { useState, useEffect, useRef } from "react";\n` +
  `import { STATUSES } from "../data/stages";\n\n` +
  sl(markers.StatusDropdown, ends.StatusDropdown) +
  `\n\nexport default StatusDropdown;`
);

// --- components/StepperBar.js (includes the unused CountdownCard stub) ---
writeFile(
  path.join(COMPONENTS_DIR, "StepperBar.js"),
  `import React from "react";\n` +
  `import { ALL_STAGE_NAMES } from "../data/stages";\n\n` +
  sl(markers.CountdownCard, ends.StepperBar) +
  `\n\nexport default StepperBar;`
);

// --- components/NextBestAction.js ---
writeFile(
  path.join(COMPONENTS_DIR, "NextBestAction.js"),
  `import React from "react";\n\n` +
  sl(markers.NextBestAction, ends.NextBestAction) +
  `\n\nexport default NextBestAction;`
);

// --- components/StageInfoModal.js ---
writeFile(
  path.join(COMPONENTS_DIR, "StageInfoModal.js"),
  `import React from "react";\n\n` +
  sl(markers.StageInfoModal, ends.StageInfoModal) +
  `\n\nexport default StageInfoModal;`
);

// --- components/QuickCard.js ---
writeFile(
  path.join(COMPONENTS_DIR, "QuickCard.js"),
  `import React from "react";\n\n` +
  sl(markers.QuickCard, ends.QuickCard) +
  `\n\nexport default QuickCard;`
);

// --- components/InfoExpand.js ---
writeFile(
  path.join(COMPONENTS_DIR, "InfoExpand.js"),
  `import React from "react";\n\n` +
  sl(markers.InfoExpand, ends.InfoExpand) +
  `\n\nexport default InfoExpand;`
);

// --- components/UniversityFinderFlow.js ---
writeFile(
  path.join(COMPONENTS_DIR, "UniversityFinderFlow.js"),
  `import React, { useState } from "react";\n` +
  `import { UNI_BANDS_BACHELOR, UNI_BANDS_MASTERS, SEARCH_LINKS } from "../data/universities";\n` +
  `import { getUniBand } from "../utils/uniBand";\n\n` +
  sl(markers.UniversityFinderFlow, ends.UniversityFinderFlow) +
  `\n\nexport default UniversityFinderFlow;`
);

// --- components/CostsTab.js ---
writeFile(
  path.join(COMPONENTS_DIR, "CostsTab.js"),
  `import React, { useState, useEffect } from "react";\n` +
  `import { COST_FIXED, UNI_TUITION_MAP, EXPENSE_CAT_META } from "../data/costs";\n` +
  `import { fmtGBP, gbp2bdt, formatMonth } from "../utils/format";\n` +
  `import { loadLS, saveLS } from "../hooks/useLocalStorage";\n\n` +
  sl(markers.CostsTab, ends.CostsTab) +
  `\n\nexport default CostsTab;`
);

// --- data/prep.js ---
writeFile(
  path.join(DATA_DIR, "prep.js"),
  `// CAS interview & UKVI prep data, used by PrepTab\n\n` +
  sl(markers.CAS_QA, ends.CAS_QA) + `\n\n` +
  sl(markers.UKVI_QA, ends.UKVI_QA) + `\n\n` +
  sl(markers.QA_CATEGORIES, ends.QA_CATEGORIES) + `\n\n` +
  sl(markers.REFUSAL_REASONS, ends.REFUSAL_REASONS) +
  `\n\nexport { CAS_QA, UKVI_QA, QA_CATEGORIES, REFUSAL_REASONS };`
);

// --- components/PrepTab.js ---
writeFile(
  path.join(COMPONENTS_DIR, "PrepTab.js"),
  `import React, { useState, useRef } from "react";\n` +
  `import { CAS_QA, UKVI_QA, QA_CATEGORIES, REFUSAL_REASONS } from "../data/prep";\n\n` +
  sl(markers.PrepTab, ends.PrepTab) +
  `\n\nexport default PrepTab;`
);

// --- components/PackingTab.js ---
writeFile(
  path.join(COMPONENTS_DIR, "PackingTab.js"),
  `import React, { useState, useEffect } from "react";\n` +
  `import { PACKING_CATEGORIES, LUGGAGE_PRESETS } from "../data/packing";\n` +
  `import { loadLS, saveLS } from "../hooks/useLocalStorage";\n\n` +
  sl(markers.PackingTab, ends.PackingTab) +
  `\n\nexport default PackingTab;`
);

// --- New, trimmed App.js ---
const newAppJs =
`import React, { useState, useEffect, useRef } from "react";

import { STATUSES, AUTO_ADVANCE, STAGES } from "./data/stages";
import { DOCS } from "./data/documents";
import { GUIDES } from "./data/guides";
import { loadLS, saveLS } from "./hooks/useLocalStorage";

import ReadinessRing from "./components/ReadinessRing";
import ReadinessScore from "./components/ReadinessScore";
import HeaderStatusPill from "./components/HeaderStatusPill";
import StatusDropdown from "./components/StatusDropdown";
import StepperBar from "./components/StepperBar";
import NextBestAction from "./components/NextBestAction";
import StageInfoModal from "./components/StageInfoModal";
import QuickCard from "./components/QuickCard";
import InfoExpand from "./components/InfoExpand";
import UniversityFinderFlow from "./components/UniversityFinderFlow";
import CostsTab from "./components/CostsTab";
import PrepTab from "./components/PrepTab";
import PackingTab from "./components/PackingTab";

` + sl(markers.App, lines.length);

fs.writeFileSync(APP_PATH, newAppJs.trimEnd() + "\n", "utf8");
console.log(`✅ ${path.relative(ROOT, APP_PATH)} (trimmed down)`);

console.log("\n🎉 Step 2 complete!");
console.log(`   App.js: ${original.split("\n").length} lines -> ${newAppJs.split("\n").length} lines`);
console.log("\nNext: run `npm start` and check every tab still works.");
console.log("If anything looks wrong, your old file is safe at src/App.beforeStep2.js");
