// tests/camcu-acceptance.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/cau-chuyen", "/khong-gian", "/thuc-don", "/lien-he"];

test.describe("Nghiệm thu Bước 7 & Mục 13.4 - Cẩm Cù House", () => {
  test("1. Console sạch, không có lỗi 404 và khớp 100% dữ liệu Bảng 13.1", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const notFoundUrls: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("response", (res) => {
      if (res.status() === 404) notFoundUrls.push(res.url());
    });

    await page.goto("http://localhost:3000/");

    // Kiểm tra bất biến Mục 1 & Bảng 13.1
    await expect(page.locator("h1")).toContainText("CẨM CÙ HOUSE");
    await expect(page.locator("body")).toContainText(
      "Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá"
    );
    await expect(page.locator("body")).toContainText(
      "Hẻm 437 Hùng Vương, Phường Nghĩa Trung, Thành phố Gia Nghĩa, Tỉnh Đắk Nông"
    );
    await expect(page.locator("body")).toContainText("11.99° N · 107.69° E");
    await expect(page.locator("body")).toContainText("800m+");
    await expect(page.locator("body")).toContainText("038 285 1688");
    await expect(page.locator("body")).toContainText("077 465 9000");

    // Kiểm tra chỉ có duy nhất 1 nơi hiển thị trạng thái ĐANG MỞ CỬA / ĐÃ ĐÓNG CỬA (Mục 7 & 13.4)
    const statusCount = await page
      .locator("text=/ĐANG MỞ CỬA|ĐÃ ĐÓNG CỬA/")
      .count();
    expect(statusCount).toBe(1);

    // Không có link Quản Trị Viên công khai ở chân trang (Mục 7)
    await expect(page.locator("footer")).not.toContainText("Quản Trị");
    await expect(page.locator("footer")).not.toContainText("Admin");

    expect(consoleErrors).toEqual([]);
    expect(notFoundUrls).toEqual([]);
  });

  test("2. Thực Đơn đủ 67 món và tuyệt đối KHÔNG dùng ảnh (Mục 1 & 8.4)", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/thuc-don");
    await expect(page.locator("body")).toContainText("HIỂN THỊ: 67 / 67 MÓN");

    // Đếm đủ 67 thẻ article món ăn
    const itemCards = page.locator("section article");
    await expect(itemCards).toHaveCount(67);

    // Không có bất kỳ thẻ img nào trong vùng danh sách thực đơn
    const menuImages = page.locator("section article img");
    await expect(menuImages).toHaveCount(0);
  });

  test("3. Không Gian Suối đủ 30 ảnh và có nhãn [01/30] -> [30/30] (Mục 8.3)", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/khong-gian");
    const figures = page.locator("section figure");
    await expect(figures).toHaveCount(30);
    await expect(page.locator("body")).toContainText("[01/30]");
    await expect(page.locator("body")).toContainText("[30/30]");
  });

  test("4. Kiểm tra Accessibility (axe-core) & Tương phản cả 2 chế độ Tối / Sáng", async ({
    page,
  }) => {
    for (const route of ROUTES) {
      await page.goto(`http://localhost:3000${route}`);

      // Chế độ Tối (mặc định)
      const darkResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(darkResults.violations).toEqual([]);

      // Chuyển sang Chế độ Sáng
      await page.evaluate(() =>
        document.documentElement.setAttribute("data-theme", "light")
      );
      const lightResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(lightResults.violations).toEqual([]);
    }
  });

  test("5. Chụp ảnh nghiệm thu Desktop 1440 + Mobile 390 (Tối + Sáng, VN + EN)", async ({
    page,
  }) => {
    const viewports = [
      { name: "desktop-1440", width: 1440, height: 900 },
      { name: "mobile-390", width: 390, height: 844 },
    ];
    const themes: ("dark" | "light")[] = ["dark", "light"];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const theme of themes) {
        await page.goto("http://localhost:3000/");
        await page.evaluate((t) => {
          sessionStorage.setItem("camcu_intro_seen", "1");
          document.documentElement.setAttribute("data-theme", t);
        }, theme);

        // Bản VN
        await page.screenshot({
          path: `screenshots/home-${vp.name}-${theme}-VN.png`,
          fullPage: true,
        });

        // Chuyển sang EN và chụp
        await page.click('button[aria-label="Chuyển ngôn ngữ Việt / Anh"]');
        await page.screenshot({
          path: `screenshots/home-${vp.name}-${theme}-EN.png`,
          fullPage: true,
        });

        // Chụp khối Thông tin quán ở trang Liên Hệ (Mục 13.4)
        await page.goto("http://localhost:3000/lien-he");
        await page.evaluate((t) => {
          document.documentElement.setAttribute("data-theme", t);
        }, theme);
        await page.screenshot({
          path: `screenshots/contact-spec-${vp.name}-${theme}.png`,
          fullPage: true,
        });
      }
    }
  });
});
