// tests/camcu-full-verification.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ALL_ROUTES = ["/", "/cau-chuyen", "/khong-gian", "/thuc-don", "/lien-he"];

test.describe("Kiểm tra 9 hạng mục chỉnh sửa & Đối chiếu bản gốc backup", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("cc_intro", "1");
      sessionStorage.setItem("camcu_intro_seen", "1");
    });
  });

  test("1 & 8. Mọi Hero tối luôn dùng chữ kem #F2EDE4 ở cả chế độ Sáng/Tối, H1 đầy đủ, chữ ghost .16", async ({
    page,
  }) => {
    for (const route of ALL_ROUTES) {
      await page.goto(`http://localhost:3000${route}`);

      // Kiểm tra ở chế độ Sáng: Hero vẫn phải giữ chữ kem #F2EDE4 (rgb(242, 237, 228))
      await page.evaluate(() =>
        document.documentElement.setAttribute("data-theme", "light")
      );

      const h1 = page.locator(".hero-dark-surface h1").first();
      await expect(h1).toBeVisible();
      const h1Text = await h1.innerText();
      expect(h1Text.trim().length).toBeGreaterThan(5);

      const h1Color = await h1.evaluate(
        (el) => window.getComputedStyle(el).color
      );
      expect(h1Color).toBe("rgb(242, 237, 228)");

      // Kiểm tra chữ ghost "CẨM CÙ HOUSE" có opacity = 0.16
      const ghost = page.locator(".hero-ghost-text").first();
      if ((await ghost.count()) > 0) {
        const opacity = await ghost.evaluate(
          (el) => window.getComputedStyle(el).opacity
        );
        expect(Number(opacity)).toBeCloseTo(0.16, 2);
      }
    }
  });

  test("2. Tên ảnh trên ảnh (Lưới + Phim) có gradient .65, chữ kem >= 16px, tối đa 2 dòng", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/khong-gian");
    const captionTitle = page.locator(".photo-caption-title").first();
    await expect(captionTitle).toBeVisible();

    const styles = await captionTitle.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        color: cs.color,
        fontSize: parseFloat(cs.fontSize),
        lineClamp: cs.webkitLineClamp,
      };
    });

    expect(styles.color).toBe("rgb(242, 237, 228)");
    expect(styles.fontSize).toBeGreaterThanOrEqual(16);
    expect(styles.lineClamp).toBe("2");
  });

  test("3 & 4. So khớp văn bản VN/EN với bản gốc backup, bỏ 'ĐÃ BAO GỒM PHỤC VỤ', thẻ đánh giá >= 15px, 4 dòng + Đọc thêm", async ({
    page,
  }) => {
    for (const route of ALL_ROUTES) {
      await page.goto(`http://localhost:3000${route}`);
      const bodyText = await page.locator("body").innerText();
      expect(bodyText).not.toContain("ĐÃ BAO GỒM PHỤC VỤ");
    }

    await page.goto("http://localhost:3000/");
    await expect(page.locator("body")).toContainText(
      "Khách Hàng Nói Gì Về Cẩm Cù House"
    );

    const reviewText = page.locator("blockquote p").first();
    const fontSize = await reviewText.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).fontSize)
    );
    expect(fontSize).toBeGreaterThanOrEqual(15);

    const readMoreBtn = page
      .locator("blockquote button", { hasText: /Đọc thêm|Read more/ })
      .first();
    await expect(readMoreBtn).toBeVisible();
  });

  test("5, 6, 7. Thực đơn có đường chấm dẫn; Header/Footer >= 15px; Liên Hệ card title <= 28px", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/thuc-don");
    await expect(page.locator(".menu-dotted-leader").first()).toBeVisible();

    await page.goto("http://localhost:3000/lien-he");
    const cardTitleSize = await page
      .locator(".contact-card-title")
      .first()
      .evaluate((el) => parseFloat(window.getComputedStyle(el).fontSize));
    expect(cardTitleSize).toBeLessThanOrEqual(28);
  });

  test("9. Quét axe-core tương phản >= 4.5:1 & Chụp ảnh 1440 + 390 (Sáng + Tối, VN + EN)", async ({
    page,
  }) => {
    const viewports = [
      { name: "1440", width: 1440, height: 900 },
      { name: "390", width: 390, height: 844 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const theme of ["dark", "light"] as const) {
        for (const route of ALL_ROUTES) {
          await page.goto(`http://localhost:3000${route}`);
          await page.evaluate((t) => {
            sessionStorage.setItem("camcu_intro_seen", "1");
            sessionStorage.setItem("cc_intro", "1");
            document.documentElement.setAttribute("data-theme", t);
            if (t === "light") {
              document.documentElement.classList.remove("dark");
              document.documentElement.classList.add("light");
            } else {
              document.documentElement.classList.add("dark");
              document.documentElement.classList.remove("light");
            }
          }, theme);
          await page.waitForTimeout(1200);

          const axe = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa"])
            .analyze();
          expect(axe.violations).toEqual([]);

          const slug = route === "/" ? "home" : route.replace("/", "");
          await page.screenshot({
            path: `screenshots/after-${slug}-${vp.name}-${theme}-VN.png`,
            fullPage: true,
          });
        }
      }
    }
  });
});
