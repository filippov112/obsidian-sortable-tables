import { Plugin } from "obsidian";

// Хранилище исходных строк таблиц
const tableOriginalRowsMap = new WeakMap<HTMLTableElement, HTMLTableRowElement[]>();

// Хранилище массивов сортировок по таблицам
const tableSortStateMap = new WeakMap<
  HTMLTableElement,
  { index: number; direction: "asc" | "desc" }[]
>();

function makeTableSortable(table: HTMLTableElement) {
    const headers = table.querySelectorAll("thead th");
    const tbody = table.querySelector("tbody");

    if (!tbody) return;

    if (!tableOriginalRowsMap.has(table)) {
        const originalRows = Array.from(tbody.querySelectorAll("tr")).map(row =>
        row.cloneNode(true) as HTMLTableRowElement
        );
        tableOriginalRowsMap.set(table, originalRows);
    }

    headers.forEach((header, index) => {
        header.addEventListener("click", (e) => {
        const isShift = (e as MouseEvent).shiftKey;
        const sortStates = tableSortStateMap.get(table) ?? [];

        const existing = sortStates.find(s => s.index === index);
        let nextDirection: "asc" | "desc" | "none" = "asc";

        if (existing) {
            nextDirection = existing.direction === "asc" ? "desc" : "none";
        }

        let newSortStates: { index: number; direction: "asc" | "desc" }[];

        if (isShift) {
            newSortStates = sortStates.filter(s => s.index !== index);
            if (nextDirection !== "none") {
            newSortStates.push({ index, direction: nextDirection });
            }
        } else {
            newSortStates = nextDirection === "none" ? [] : [{ index, direction: nextDirection }];
        }

        tableSortStateMap.set(table, newSortStates);

        // Сброс иконок и меток
        headers.forEach(h => {
        h.classList.remove("asc", "desc");
        (h as HTMLElement).dataset.sort = "";
        h.textContent = h.textContent?.replace(/[\s🔼🔽①②③④⑤⑥⑦⑧⑨⑩]+$/, "") ?? "";
        });

        newSortStates.forEach((s, i) => {
        const hdr = headers[s.index];
        hdr.classList.add(s.direction);
        const arrow = s.direction === "asc" ? "🔼" : "🔽";
        const indexChar = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"][i] ?? `(${i + 1})`;
        hdr.textContent = hdr.textContent?.trim() + " " + arrow + indexChar;
        });

        const originalRows = tableOriginalRowsMap.get(table);
        if (!originalRows) return;

        const rows = originalRows.map(row => row.cloneNode(true) as HTMLTableRowElement);

        if (newSortStates.length > 0) {
            rows.sort((a, b) => {
            for (const { index, direction } of newSortStates) {
                const cellA = a.children[index]?.textContent?.trim() ?? "";
                const cellB = b.children[index]?.textContent?.trim() ?? "";
                // const numA = parseFloat(cellA);
                // const numB = parseFloat(cellB);

                let cmp = 0;
                // if (!isNaN(numA) && !isNaN(numB)) {
                // cmp = numA - numB;
                // } else {
                cmp = cellA.localeCompare(cellB);
                // }

                if (cmp !== 0) return direction === "asc" ? cmp : -cmp;
            }
            return 0;
            });
        }

        tbody.replaceChildren();
        rows.forEach(row => tbody.appendChild(row));
        });
    });
}

export default class SortableTablesPlugin extends Plugin {
  async onload() {
    this.registerMarkdownPostProcessor((el) => {
      el.querySelectorAll("table").forEach((tableEl) => {
        makeTableSortable(tableEl as HTMLTableElement);
      });
    });
  }
}
