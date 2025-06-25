var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => SortableTablesPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var tableOriginalRowsMap = /* @__PURE__ */ new WeakMap();
var tableSortStateMap = /* @__PURE__ */ new WeakMap();
function makeTableSortable(table) {
  const headers = table.querySelectorAll("thead th");
  const tbody = table.querySelector("tbody");
  if (!tbody) return;
  if (!tableOriginalRowsMap.has(table)) {
    const originalRows = Array.from(tbody.querySelectorAll("tr")).map(
      (row) => row.cloneNode(true)
    );
    tableOriginalRowsMap.set(table, originalRows);
  }
  headers.forEach((header, index) => {
    header.addEventListener("click", (e) => {
      var _a;
      const isShift = e.shiftKey;
      const sortStates = (_a = tableSortStateMap.get(table)) != null ? _a : [];
      const existing = sortStates.find((s) => s.index === index);
      let nextDirection = "asc";
      if (existing) {
        nextDirection = existing.direction === "asc" ? "desc" : "none";
      }
      let newSortStates;
      if (isShift) {
        newSortStates = sortStates.filter((s) => s.index !== index);
        if (nextDirection !== "none") {
          newSortStates.push({ index, direction: nextDirection });
        }
      } else {
        newSortStates = nextDirection === "none" ? [] : [{ index, direction: nextDirection }];
      }
      tableSortStateMap.set(table, newSortStates);
      headers.forEach((h) => {
        var _a2, _b;
        h.classList.remove("asc", "desc");
        h.dataset.sort = "";
        h.textContent = (_b = (_a2 = h.textContent) == null ? void 0 : _a2.replace(/[\s🔼🔽①②③④⑤⑥⑦⑧⑨⑩]+$/, "")) != null ? _b : "";
      });
      newSortStates.forEach((s, i) => {
        var _a2, _b;
        const hdr = headers[s.index];
        hdr.classList.add(s.direction);
        const arrow = s.direction === "asc" ? "\u{1F53C}" : "\u{1F53D}";
        const indexChar = (_a2 = ["\u2460", "\u2461", "\u2462", "\u2463", "\u2464", "\u2465", "\u2466", "\u2467", "\u2468", "\u2469"][i]) != null ? _a2 : "(".concat(i + 1, ")");
        hdr.textContent = ((_b = hdr.textContent) == null ? void 0 : _b.trim()) + " " + arrow + indexChar;
      });
      const originalRows = tableOriginalRowsMap.get(table);
      if (!originalRows) return;
      const rows = originalRows.map((row) => row.cloneNode(true));
      if (newSortStates.length > 0) {
        rows.sort((a, b) => {
          var _a2, _b, _c, _d, _e, _f;
          for (const { index: index2, direction } of newSortStates) {
            const cellA = (_c = (_b = (_a2 = a.children[index2]) == null ? void 0 : _a2.textContent) == null ? void 0 : _b.trim()) != null ? _c : "";
            const cellB = (_f = (_e = (_d = b.children[index2]) == null ? void 0 : _d.textContent) == null ? void 0 : _e.trim()) != null ? _f : "";
            let cmp = 0;
            cmp = cellA.localeCompare(cellB);
            if (cmp !== 0) return direction === "asc" ? cmp : -cmp;
          }
          return 0;
        });
      }
      tbody.replaceChildren();
      rows.forEach((row) => tbody.appendChild(row));
    });
  });
}
var SortableTablesPlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.registerMarkdownPostProcessor((el) => {
      el.querySelectorAll("table").forEach((tableEl) => {
        makeTableSortable(tableEl);
      });
    });
  }
};
