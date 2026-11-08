import { STORE_CONSTANTS } from "./atmosphere-engine.js";

/**
 * Render thực đơn phong cách Tạp chí Thực vật học (Editorial Botanical Monograph)
 * @param {HTMLElement} container - Phần tử gốc #menu-section
 * @param {Object} menuState - Kết quả từ loadEditorialMenuData()
 * @param {"vi"|"en"} lang - Ngôn ngữ hiển thị hiện tại
 */
export function renderEditorialMenu(container, menuState, lang = "vi") {
  if (!container) return;

  const isVi = lang === "vi";

  // Trường hợp chưa có dữ liệu thật: hiển thị đúng "Chưa kết nối", không dùng số giả
  if (!menuState || !menuState.connected) {
    container.innerHTML = `
      <section class="editorial-menu-section" aria-labelledby="editorial-menu-heading">
        <header class="editorial-masthead">
          <div>
            <span class="label-uppercase-12">${STORE_CONSTANTS.name} · ${STORE_CONSTANTS.coordinates.display}</span>
            <h2 id="editorial-menu-heading" class="editorial-masthead-title">
              ${isVi ? "Thực Đơn Cẩm Cù House" : "Cẩm Cù House Menu"}
            </h2>
          </div>
          <p class="editorial-masthead-meta">${isVi ? "Chưa kết nối" : "Disconnected"}</p>
        </header>
      </section>
    `;
    return;
  }

  const chaptersHtml = menuState.categories
    .map((chapter, chapterIdx) => {
      const chapterTitle = isVi ? chapter.titleVi : chapter.titleEn;
      const chapterNumber = String(chapterIdx + 1).padStart(2, "0");

      const itemsHtml = chapter.items
        .map((item) => {
          const name = isVi ? item.nameVi : item.nameEn;
          const desc = isVi ? item.descriptionVi : item.descriptionEn;
          const tags = isVi ? item.tagsVi : item.tagsEn;

          const tagsHtml =
            tags.length > 0
              ? `<div class="editorial-item-tags">
                  ${tags
                    .map(
                      (tag) =>
                        `<span class="editorial-tag-12">${escapeHtml(tag)}</span>`
                    )
                    .join("")}
                </div>`
              : "";

          const descHtml = desc
            ? `<p class="editorial-item-desc">${escapeHtml(desc)}</p>`
            : "";

          return `
            <li class="editorial-menu-item${item.inStock === false ? " is-out-of-stock" : ""}" data-item-id="${escapeHtml(item.id)}">
              <div class="editorial-item-topline">
                <span class="editorial-item-index">${escapeHtml(item.orderNumber)}</span>
                <h4 class="editorial-item-name">${escapeHtml(name)}</h4>
                <span class="editorial-dot-leader" aria-hidden="true"></span>
                <span class="editorial-item-price">${escapeHtml(item.priceDisplay)}</span>
              </div>
              ${descHtml}
              ${tagsHtml}
            </li>
          `;
        })
        .join("");

      return `
        <article class="editorial-chapter" id="cat-${escapeHtml(chapter.id)}" data-category="${escapeHtml(chapter.id)}">
          <div class="editorial-chapter-header">
            <h3 class="editorial-chapter-title">${chapterNumber}. ${escapeHtml(chapterTitle)}</h3>
            <span class="label-uppercase-12">${chapter.items.length} ${isVi ? "MÓN" : "ITEMS"}</span>
          </div>
          <ul class="editorial-grid">
            ${itemsHtml}
          </ul>
        </article>
      `;
    })
    .join("");

  const filterNavHtml = `
    <nav class="editorial-category-nav" aria-label="${isVi ? "Danh mục thực đơn" : "Menu categories"}">
      <button type="button" class="editorial-cat-chip" data-filter="all" aria-pressed="true">
        ${isVi ? `Tất cả (${menuState.totalCount})` : `All (${menuState.totalCount})`}
      </button>
      ${menuState.categories
        .map(
          (cat) => `
        <button type="button" class="editorial-cat-chip" data-filter="${escapeHtml(cat.id)}" aria-pressed="false">
          ${escapeHtml(isVi ? cat.titleVi : cat.titleEn)} (${cat.items.length})
        </button>
      `
        )
        .join("")}
    </nav>
  `;

  container.innerHTML = `
    <section class="editorial-menu-section" aria-labelledby="editorial-menu-heading">
      <header class="editorial-masthead">
        <div>
          <span class="label-uppercase-12">${STORE_CONSTANTS.name} · ${STORE_CONSTANTS.coordinates.display}</span>
          <h2 id="editorial-menu-heading" class="editorial-masthead-title">
            ${isVi ? "Thực Đơn Cẩm Cù House" : "Cẩm Cù House Menu"}
          </h2>
        </div>
        <p class="editorial-masthead-meta">
          ${
            isVi
              ? `${STORE_CONSTANTS.address} · Thứ 2–5 07:00–18:00, Thứ 6–CN 07:00–22:00`
              : `${STORE_CONSTANTS.address} · Mon–Thu 07:00–18:00, Fri–Sun 07:00–22:00`
          }
        </p>
      </header>

      ${filterNavHtml}

      <div class="editorial-chapters-wrapper">
        ${chaptersHtml}
      </div>

      <footer class="editorial-menu-footer">
        <p class="editorial-footer-text">
          <strong>${STORE_CONSTANTS.name}</strong> — ${STORE_CONSTANTS.address}
        </p>
        <div class="primary-cta-group">
          <a class="btn-cta-primary" href="${STORE_CONSTANTS.hotlines.primaryTel}">
            ${isVi ? `Gọi Hotline: ${STORE_CONSTANTS.hotlines.primary}` : `Call Hotline: ${STORE_CONSTANTS.hotlines.primary}`}
          </a>
          <a class="btn-cta-secondary" href="${STORE_CONSTANTS.mapsUrl}" target="_blank" rel="noopener noreferrer">
            ${isVi ? "Chỉ đường (Google Maps)" : "Directions (Google Maps)"}
          </a>
        </div>
      </footer>
    </section>
  `;

  bindCategoryFilter(container);
}

function bindCategoryFilter(container) {
  if (!container || typeof container.querySelectorAll !== "function") return;
  const buttons = container.querySelectorAll(".editorial-cat-chip");
  const chapters = container.querySelectorAll(".editorial-chapter");

  if (!buttons || typeof buttons.forEach !== "function") return;

  buttons.forEach((btn) => {
    if (!btn || typeof btn.addEventListener !== "function") return;
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-filter");

      buttons.forEach((b) => {
        if (typeof b?.setAttribute === "function") {
          b.setAttribute("aria-pressed", String(b === btn));
        }
      });

      chapters.forEach((chapter) => {
        if (chapter && typeof chapter.getAttribute === "function") {
          const match =
            target === "all" || chapter.getAttribute("data-category") === target;
          chapter.hidden = !match;
        }
      });
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
