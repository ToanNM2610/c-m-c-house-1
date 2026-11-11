import { STORE_CONSTANTS } from "./atmosphere-engine.js";

/**
 * Render hành trình Scrollytelling 30 ảnh không gian Cẩm Cù House
 * @param {HTMLElement} container - Phần tử gốc #space-section
 * @param {Object} galleryState - Kết quả từ loadSpatialGalleryData()
 * @param {"vi"|"en"} lang - Ngôn ngữ hiển thị
 */
export function renderSpatialScrollytelling(container, galleryState, lang = "vi") {
  if (!container) return;

  const isVi = lang === "vi";

  // Khi chưa có dữ liệu thật: hiển thị "Chưa kết nối", không dùng ảnh giả
  if (!galleryState || !galleryState.connected) {
    container.innerHTML = `
      <section class="spatial-section" aria-labelledby="spatial-heading">
        <header class="spatial-header">
          <div>
            <span class="label-uppercase-12">${STORE_CONSTANTS.name} · ${STORE_CONSTANTS.coordinates.display}</span>
            <h2 id="spatial-heading" class="spatial-title">
              ${isVi ? "Không Gian Cẩm Cù House" : "Cẩm Cù House Space"}
            </h2>
          </div>
          <p class="spatial-subtitle">${isVi ? "Chưa kết nối" : "Disconnected"}</p>
        </header>
      </section>
    `;
    return;
  }

  const stagesHtml = galleryState.stages
    .map((stage) => {
      const cardsHtml = stage.photos
        .map((photo, slotIdx) => {
          const title = isVi ? photo.titleVi : photo.titleEn;
          const caption = isVi ? photo.captionVi : photo.captionEn;
          const alt = isVi ? photo.altVi : photo.altEn;
          const loadingStrategy =
            stage.stageNumber === "01" && slotIdx < 2 ? "eager" : "lazy";

          return `
            <figure class="spatial-card" data-slot="${slotIdx}" data-photo-order="${escapeHtml(photo.orderNumber)}">
              <img
                class="spatial-img"
                src="${escapeHtml(photo.src)}"
                alt="${escapeHtml(alt)}"
                loading="${loadingStrategy}"
                decoding="async"
              />
              <figcaption class="spatial-dark-overlay">
                <span class="label-uppercase-12 spatial-card-num">
                  ${STORE_CONSTANTS.name} · ${escapeHtml(photo.orderNumber)} / ${galleryState.totalCount}
                </span>
                <h3 class="spatial-card-title">${escapeHtml(title)}</h3>
                ${
                  caption
                    ? `<p class="spatial-card-caption">${escapeHtml(caption)}</p>`
                    : ""
                }
              </figcaption>
            </figure>
          `;
        })
        .join("");

      return `
        <div class="spatial-stage" data-stage="${escapeHtml(stage.stageNumber)}">
          <aside class="spatial-stage-rail">
            <span class="label-uppercase-12">
              ${isVi ? "CHẶNG KHÔNG GIAN" : "SPATIAL STAGE"} ${escapeHtml(stage.stageNumber)}
            </span>
            <p class="spatial-stage-index">${escapeHtml(stage.rangeLabel)}</p>
            <p class="spatial-stage-coords">${STORE_CONSTANTS.coordinates.display}</p>
          </aside>
          <div class="spatial-stage-grid">
            ${cardsHtml}
          </div>
        </div>
      `;
    })
    .join("");

  container.innerHTML = `
    <section class="spatial-section" aria-labelledby="spatial-heading">
      <header class="spatial-header">
        <div>
          <span class="label-uppercase-12">${STORE_CONSTANTS.name} · ${STORE_CONSTANTS.coordinates.display}</span>
          <h2 id="spatial-heading" class="spatial-title">
            ${isVi ? "Không Gian Cẩm Cù House" : "Cẩm Cù House Space"}
          </h2>
        </div>
        <p class="spatial-subtitle">
          ${STORE_CONSTANTS.address}
        </p>
      </header>

      <div class="spatial-stages-wrapper">
        ${stagesHtml}
      </div>

      <footer class="spatial-journey-cta">
        <p class="spatial-cta-copy">
          <strong>${STORE_CONSTANTS.name}</strong> — ${STORE_CONSTANTS.address} (${
            isVi
              ? "Thứ 2–5 07:00–18:00, Thứ 6–CN 07:00–22:00"
              : "Mon–Thu 07:00–18:00, Fri–Sun 07:00–22:00"
          })
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

  initSpatialScrollObserver(container);
}

function initSpatialScrollObserver(container) {
  if (!container || typeof container.querySelectorAll !== "function") return;
  const cards = container.querySelectorAll(".spatial-card");
  if (!cards || !cards.length) return;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
    cards.forEach((card) => {
      if (card?.classList?.add) card.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  cards.forEach((card) => observer.observe(card));
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

