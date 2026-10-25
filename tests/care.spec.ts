import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const desk = (page: import("@playwright/test").Page) =>
  page.getByRole("navigation", { name: "Care desk" });

test("care records can be created, edited, deleted, exported, imported, and kept after reload", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One browser covers the storage flow.");
  test.setTimeout(90_000);
  await page.goto("/care/profiles");
  await page.getByLabel("Relationship or role (optional)").fill("Neighbor");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText("Profile saved on this device.")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Neighbor", exact: true }),
  ).toBeVisible();

  await desk(page).getByRole("link", { name: "Medicines" }).click();
  await expect(page.getByText("does not recommend a medicine")).toBeVisible();
  await page.getByRole("button", { name: "Save record" }).click();
  await expect(page.getByText("Enter a name.")).toBeVisible();
  await page.getByLabel("Name", { exact: true }).fill("Vitamin D");
  await page.getByLabel("What kind of record is this?").selectOption("supplement");
  await page
    .getByLabel("Label or existing instructions")
    .fill("As written on the bottle.");
  await page.getByRole("button", { name: "Save record" }).click();
  await expect(page.getByRole("heading", { name: "Vitamin D" })).toBeVisible();
  await page.getByRole("button", { name: "Edit" }).click();
  await page
    .getByLabel("Label or existing instructions")
    .fill("As written on the bottle: with breakfast.");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("with breakfast.")).toBeVisible();

  const today = await page.evaluate(() => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  });

  await desk(page).getByRole("link", { name: "Appointments" }).click();
  await page.getByLabel("Title", { exact: true }).fill("Clinic check-in");
  await page.getByLabel("Date", { exact: true }).fill(today);
  await page.getByLabel("Location").fill("Community clinic");
  await page.getByLabel("Questions to ask").fill("Ask about the printed list.");
  await page.getByRole("button", { name: "Save appointment" }).click();
  await expect(page.getByRole("heading", { name: "Clinic check-in" })).toBeVisible();

  await desk(page).getByRole("link", { name: "Checklist" }).click();
  await page.getByLabel("Task", { exact: true }).fill("Refill the organizer");
  await page.getByLabel("Due date (optional)").fill(today);
  await page.getByRole("button", { name: "Save task" }).click();
  await page.getByRole("button", { name: "Mark complete" }).click();
  await expect(page.getByText("Marked complete on this device.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nothing completed yet" })).toHaveCount(
    0,
  );

  await desk(page).getByRole("link", { name: "Notes" }).click();
  await page.getByLabel("Title (optional)").fill("Morning routine");
  await page.getByLabel("Note", { exact: true }).fill("Stretch and water");
  await page.getByRole("button", { name: "Save note" }).click();
  await page.getByLabel("Search notes").fill("water");
  await expect(page.getByRole("heading", { name: "Morning routine" })).toBeVisible();
  await page.getByLabel("Search notes").fill("zzzz-no-match");
  await expect(page.getByRole("heading", { name: "No notes match" })).toBeVisible();
  await page.getByLabel("Search notes").fill("");
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Title (optional)").fill("Morning routine updated");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Morning routine updated" }),
  ).toBeVisible();

  await page.goto("/care");
  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();
  await expect(page.getByText("Records stay on this device")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Clinic check-in" })).toBeVisible();
  await expect(page.getByText("Refill the organizer")).toHaveCount(0);

  await page.goto("/care/notes");
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete note" }).click();
  await expect(page.getByRole("heading", { name: "No notes yet" })).toBeVisible();
  await page.getByLabel("Title (optional)").fill("Evening check-in");
  await page.getByLabel("Note", { exact: true }).fill("Kept after import");
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(page.getByRole("heading", { name: "Evening check-in" })).toBeVisible();

  await page.goto("/care/data");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export records" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(
    /^caregiving-desk-records-\d{4}-\d{2}-\d{2}\.json$/,
  );
  const exportedPath = await download.path();
  expect(exportedPath).not.toBeNull();
  const exported = JSON.parse(await readFile(exportedPath!, "utf8")) as {
    format: string;
    notes: { title: string }[];
  };
  expect(exported.format).toBe("caregiving-desk-care-export");
  expect(exported.notes.some((note) => note.title === "Evening check-in")).toBe(true);

  await page.setInputFiles("#import-file", {
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await expect(page.getByText("File ready.")).toBeVisible();
  await page.getByRole("button", { name: "Add imported records" }).click();
  await expect(page.getByText("care-desk export")).toBeVisible();
  await page.goto("/care/notes");
  await expect(page.getByRole("heading", { name: "Evening check-in" })).toBeVisible();

  await page.goto("/care/data");
  await page.getByRole("button", { name: "Delete all records", exact: true }).click();
  const confirm = page.getByRole("button", { name: "Delete all records on this device" });
  await expect(confirm).toBeDisabled();
  await page
    .getByLabel("I understand this permanently removes records from this device.")
    .check();
  await confirm.click();
  await expect(
    page.getByText("All care records were deleted from this device."),
  ).toBeVisible();
  await page.goto("/care/notes");
  await expect(page.getByRole("heading", { name: "No notes yet" })).toBeVisible();

  await page.goto("/care/data");
  await page.setInputFiles("#import-file", {
    name: "records.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(exported)),
  });
  await expect(page.getByText("File ready.")).toBeVisible();
  await page.getByRole("button", { name: "Add imported records" }).click();
  await expect(
    page.getByText("Imported records were added on this device."),
  ).toBeVisible();
  await page.reload();
  await page.goto("/care/notes");
  await expect(page.getByRole("heading", { name: "Evening check-in" })).toBeVisible();

  await page.goto("/care/medications");
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Remove record" }).click();
  await expect(page.getByRole("heading", { name: "Vitamin D" })).toHaveCount(0);
});

test("resources link to the website and the free printable", async ({
  page,
  request,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "Links do not change with the viewport.",
  );
  await page.goto("/care/resources");
  await expect(
    page.getByRole("link", { name: "Download the free two-page printable" }),
  ).toHaveAttribute(
    "href",
    "https://caregiving-desk.vercel.app/downloads/parents-care-information-printable.pdf",
  );
  await expect(
    page.getByRole("link", { name: /Caregiving Desk website/ }),
  ).toHaveAttribute("href", "https://caregiving-desk.vercel.app/");
  const local = await request.get("/downloads/parents-care-information-printable.pdf");
  expect(local.ok()).toBe(true);
  expect(local.headers()["content-type"]).toMatch(/^application\/pdf/);
  const manifest = await request.get("/care/manifest.webmanifest");
  expect(manifest.ok()).toBe(true);
  const body = (await manifest.json()) as { start_url: string; name: string };
  expect(body.name).toBe("Caregiving Desk");
  expect(body.start_url).toBe("/care");
  expect((await request.get("/sw.js")).ok()).toBe(true);
});

test("the care desk opens offline with saved records", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Offline caching is covered once.");
  test.setTimeout(60_000);
  await page.goto("/care/notes");
  await page.getByLabel("Title (optional)").fill("Offline note");
  await page.getByLabel("Note", { exact: true }).fill("Still here");
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(page.getByRole("heading", { name: "Offline note" })).toBeVisible();
  await page.waitForFunction(
    () => document.documentElement.dataset.careOfflineReady === "true",
    undefined,
    { timeout: 20_000 },
  );
  await page.context().setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Care notes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Offline note" })).toBeVisible();
});

for (const route of ["/care", "/care/medications", "/care/data"]) {
  test(`${route} meets automated WCAG 2.1 AA checks`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
