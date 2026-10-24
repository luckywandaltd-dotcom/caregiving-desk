import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test.use({ javaScriptEnabled: false });

test("the free printable downloads without JavaScript or an email subscription", async ({
  page,
  request,
}) => {
  await page.goto("/free-fridge-sheet");
  const link = page.getByRole("link", { name: "Download the free PDF", exact: true });
  await expect(link).toBeVisible();
  await expect(page.getByRole("main")).toContainText("No signup required");
  const response = await request.get((await link.getAttribute("href"))!);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toMatch(/^application\/pdf/);
  const original = await readFile(
    "public/downloads/parents-care-information-printable.pdf",
  );
  expect((await response.body()).equals(original)).toBe(true);
  expect(original.subarray(0, 5).toString()).toBe("%PDF-");

  const downloaded = page.waitForEvent("download");
  await link.focus();
  await page.keyboard.press("Enter");
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe("Parents_Care_Information_Printable.pdf");
  expect(await download.failure()).toBeNull();
  const path = await download.path();
  expect(path).not.toBeNull();
  expect((await readFile(path!)).equals(original)).toBe(true);
});
