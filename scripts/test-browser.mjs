/** Run against a local dist server. PLAYWRIGHT_MODULE may point to an installed package. */
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const moduleName = process.env.PLAYWRIGHT_MODULE || "playwright";
const { chromium } = await import(
  moduleName.startsWith("/") ? pathToFileURL(moduleName) : moduleName
);
const origin = process.env.PREVIEW_URL || "http://127.0.0.1:8765";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  headless: true,
  args: ["--no-sandbox"],
});
const config = JSON.parse(await readFile("vercel.json"));
const csp = config.headers[0].headers.find(
  (h) => h.key === "Content-Security-Policy",
).value;
const report = { checks: [], errors: [], accessibility: [], routes: [] };
await mkdir(".local/playground", { recursive: true });
async function setup(options = {}) {
  const ctx = await browser.newContext(options);
  // Serve only the test auditor at a same-origin URL; application responses use the preview's real CSP.
  await ctx.route(`${origin}/__qa/axe.js`, async (route) => {
    const path =
      process.env.AXE_PATH ||
      new URL("../node_modules/axe-core/axe.min.js", import.meta.url);
    await route.fulfill({
      contentType: "text/javascript",
      body: await readFile(path, "utf8"),
    });
  });
  ctx.on("page", (page) => {
    page.on("pageerror", (e) => report.errors.push(e.message));
    page.on("console", (m) => {
      if (
        m.type() === "error" &&
        /Content Security Policy|Refused to/.test(m.text())
      )
        report.errors.push(m.text());
    });
  });
  return ctx;
}
async function check(name, fn) {
  await fn();
  report.checks.push(name);
  console.log("OK:", name);
}
const ctx = await setup({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
page.setDefaultTimeout(12000);
const goto = (path) => page.goto(`${origin}/${path}`, { waitUntil: "load" });
try {
  await check(
    "mapa, lista, categoria, teclado e link profundo compartilham seleção",
    async () => {
      const initial = await goto("habilidades.html");
      assert.equal(initial.headers()["content-security-policy"], csp);
      await page.locator('.tech-map [data-tech-select="react-native"]').click();
      assert.equal(
        await page.locator('[data-tech-panel="react-native"]').isVisible(),
        true,
      );
      assert.equal(
        await page.locator('[data-tech-panel="javascript"]').isVisible(),
        false,
      );
      await page.locator('[data-view="list"]').click();
      assert.equal(
        await page
          .locator('.tech-list [data-tech-select="react-native"]')
          .getAttribute("aria-pressed"),
        "true",
      );
      await page.locator("[data-tech-category]").selectOption("database");
      assert.equal(
        await page.locator(".tech-list [data-list-category]:visible").count(),
        1,
      );
      assert.equal(
        await page
          .locator('.tech-list [data-list-category="database"] button:visible')
          .count(),
        3,
      );
      await page.locator('[data-view="map"]').click();
      await page.locator('.tech-map [data-tech-select="mysql"]').focus();
      await page.keyboard.press("ArrowRight");
      assert.equal(
        await page.evaluate(() => document.activeElement.dataset.techSelect),
        "mariadb",
      );
      await page.keyboard.press("Enter");
      assert.equal(
        await page.locator('[data-tech-panel="mariadb"]').isVisible(),
        true,
      );
      await goto("habilidades.html#expo");
      assert.equal(
        await page.locator('[data-tech-panel="expo"]').isVisible(),
        true,
      );
    },
  );
  await check(
    "filtros combinados, resultados vazios e restauração",
    async () => {
      await goto("projetos.html");
      await page.locator('[data-project-filter="type"]').selectOption("mobile");
      assert.equal(
        await page.locator("[data-project-entry]:visible").count(),
        1,
      );
      assert.ok(
        await page
          .locator("[data-project-entry]:visible")
          .innerText()
          .then((t) => t.includes("ListaTarefas")),
      );
      await page
        .locator('[data-project-filter="technologies"]')
        .selectOption("PHP");
      assert.equal(
        await page.locator("[data-project-entry]:visible").count(),
        0,
      );
      assert.equal(
        await page.locator("[data-project-empty]").isVisible(),
        true,
      );
      await page.locator("[data-reset-filters]").first().click();
      assert.equal(
        await page.locator("[data-project-entry]:visible").count(),
        9,
      );
    },
  );
  await check(
    "UI Playground atualiza prévia e CSS, copia/restaura valores",
    async () => {
      await goto("lab.html");
      await page.locator('[data-ui-control="radius"]').fill("32");
      await page.locator('[data-ui-control="border"]').fill("3");
      await page.locator('[data-ui-control="color"]').fill("#aa88ff");
      await page.locator('[data-ui-control="format"]').selectOption("panel");
      assert.equal(
        await page.locator('[data-ui-shape="panel"]').isVisible(),
        true,
      );
      assert.equal(
        await page
          .locator('[data-ui-shape="panel"]')
          .evaluate((el) => getComputedStyle(el).borderRadius),
        "32px",
      );
      assert.match(
        await page.locator("[data-ui-code]").innerText(),
        /border: 3px solid #aa88ff/,
      );
      await page.locator("[data-copy-css]").click();
      await page.waitForFunction(() =>
        /copiado|selecionado/.test(
          document.querySelector("[data-ui-status]").textContent,
        ),
      );
      assert.match(
        await page.locator("[data-ui-status]").innerText(),
        /copiado|selecionado/,
      );
      await page.locator("[data-ui-reset]").click();
      assert.equal(
        await page.locator('[data-ui-control="radius"]').inputValue(),
        "14",
      );
    },
  );
  await check(
    "animações: pausa, reinício, abas e controle global",
    async () => {
      await page.locator('[data-experiment="animation"]').click();
      await page
        .locator('[data-animation="entrance"]')
        .scrollIntoViewIfNeeded();
      await page.waitForFunction(() =>
        document
          .querySelector('[data-animation="entrance"]')
          .classList.contains("is-running"),
      );
      const d = page.locator('[data-animation="entrance"]');
      await d.locator("[data-animation-pause]").click();
      assert.equal(
        await d
          .locator(".anim-entry")
          .first()
          .evaluate((el) => getComputedStyle(el).animationPlayState),
        "paused",
      );
      await d.locator("[data-animation-restart]").click();
      assert.equal(
        await d.locator("[data-animation-pause]").getAttribute("aria-pressed"),
        "false",
      );
      await page.locator("[data-motion-toggle]").click();
      assert.equal(
        await page.locator("[data-animation-pause]:disabled").count(),
        6,
      );
      await page.locator("[data-motion-toggle]").click();
      await page.locator('[data-experiment="ui"]').click();
      assert.equal(
        await d.evaluate((el) => el.classList.contains("is-running")),
        false,
      );
    },
  );
  await check(
    "terminal: help, conteúdo inofensivo, histórico, clear e rotas reais",
    async () => {
      await page.locator('[data-experiment="terminal"]').click();
      const input = page.locator("#terminal-command");
      await input.fill("help");
      await page.locator("[data-terminal-form] button").click();
      assert.match(
        await page.locator("[data-terminal-output]").innerText(),
        /skills — explorar/,
      );
      await input.fill("<img src=x onerror=alert(1)>");
      await input.press("Enter");
      assert.equal(await page.locator("[data-terminal-output] img").count(), 0);
      assert.match(
        await page.locator("[data-terminal-output]").innerText(),
        /não reconhecido/,
      );
      await input.press("ArrowUp");
      assert.match(await input.inputValue(), /^<img/);
      await page.locator('[data-command="clear"]').click();
      assert.equal(await page.locator("[data-terminal-output] p").count(), 0);
      await input.fill("skills");
      await input.press("Enter");
      await page.waitForURL("**/habilidades.html");
    },
  );
  await check(
    "demos sandboxed carregam sob demanda; universos, filtro, galeria, fechamento",
    async () => {
      await goto("aranhaverso.html#demonstracao");
      assert.equal(await page.locator("iframe").count(), 0);
      await page.locator("[data-load-demo]").click();
      const frame = page.frameLocator("iframe");
      await frame.locator('[data-universe="tom-holland"]').click();
      assert.equal(
        await frame
          .locator('[data-slide="tom-holland"]')
          .getAttribute("aria-hidden"),
        "false",
      );
      await frame.locator('.film-filter[data-filter="tom-holland"]').click();
      assert.equal(await frame.locator(".movie-tile:visible").count(), 4);
      const demoFrame = page
        .frames()
        .find((f) => f.url().includes("/demos/aranhaverso/"));
      await Promise.all([
        demoFrame.waitForURL("**/spiderman1-tom.html", {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        }),
        frame.locator(".movie-tile:visible").first().click(),
      ]);
      await frame.locator(".gallery-frame").first().click();
      assert.equal(await frame.locator("dialog[open]").count(), 1);
      await frame
        .getByRole("button", { name: "Fechar imagem ampliada" })
        .click();
      await page.locator("[data-close-demo]").click();
      assert.equal(await page.locator("iframe").count(), 0);
      await goto("nexusfc.html#demonstracao");
      await page.locator("[data-load-demo]").click();
      await page.frameLocator("iframe").locator("h1").waitFor();
      await page.locator("[data-close-demo]").click();
    },
  );
  await check(
    "mobile 390px: toque no mapa, painel, navegação do Lab e menu",
    async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await goto("habilidades.html");
      await page
        .locator('.tech-map [data-tech-select="php"]')
        .tap({ force: true })
        .catch(() =>
          page.locator('.tech-map [data-tech-select="php"]').click(),
        );
      assert.equal(
        await page.locator('[data-tech-panel="php"]').isVisible(),
        true,
      );
      await page.locator("[data-inspector-link]").click();
      await page.waitForFunction(
        () =>
          document.querySelector("#tech-details").getBoundingClientRect().top <
          200,
      );
      await page.locator("[data-menu]").click();
      assert.equal(await page.locator("#navigation").isVisible(), true);
      await page.keyboard.press("Escape");
      assert.equal(
        await page.locator("[data-menu]").getAttribute("aria-expanded"),
        "false",
      );
      await goto("lab.html");
      await page.locator('[data-experiment="terminal"]').click();
      assert.equal(await page.locator("[data-terminal]").isVisible(), true);
    },
  );
  await check("reduced-motion prevalece sobre controles locais", async () => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await goto("lab.html#animation");
    await page.reload({ waitUntil: "load" });
    await page.waitForFunction(
      () =>
        document.querySelector("[data-motion-toggle]").disabled &&
        document.querySelectorAll("[data-animation-pause]:disabled").length ===
          6,
    );
    assert.equal(await page.locator("[data-motion-toggle]").isDisabled(), true);
    assert.equal(
      await page.locator("[data-animation-pause]:disabled").count(),
      6,
    );
    assert.equal(
      await page
        .locator(".anim-entry")
        .first()
        .evaluate((el) => getComputedStyle(el).animationName),
      "none",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });
  const routes = [
    "index",
    "sobre",
    "servicos",
    "contato",
    "habilidades",
    "projetos",
    "lab",
    "aranhaverso",
    "lista-tarefas",
    "nexusfc",
    "hogwarts",
    "sexta-feira",
    "ciberfolio",
    "gestao-compras",
    "mundo-invertido",
    "pokelab",
  ];
  await check(
    "16 páginas: desktop, tablet e celulares, imagens e erros de layout",
    async () => {
      for (const width of [1440, 1024, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        for (const r of routes) {
          const response = await goto(`${r}.html`);
          assert.equal(response.status(), 200);
          await page.waitForFunction(() =>
            [...document.images]
              .filter((i) => i.loading !== "lazy")
              .every((i) => i.complete),
          );
          const data = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth > innerWidth,
            broken: [...document.images]
              .filter((i) => i.complete && i.naturalWidth === 0)
              .map((i) => i.src),
          }));
          assert.equal(data.overflow, false, `${r} @ ${width}`);
          assert.deepEqual(data.broken, [], `${r} @ ${width}`);
          report.routes.push({ route: r, width, ...data });
        }
      }
    },
  );
  await check(
    "axe: novas páginas sem violações sérias ou críticas",
    async () => {
      for (const route of ["habilidades", "projetos", "lab", "aranhaverso"]) {
        await goto(`${route}.html`);
        await page.addScriptTag({ url: `${origin}/__qa/axe.js` });
        const results = await page.evaluate(() =>
          axe.run(document, {
            preload: false,
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21aa"],
            },
          }),
        );
        const serious = results.violations.filter((v) =>
          ["critical", "serious"].includes(v.impact),
        );
        report.accessibility.push({
          route,
          violations: results.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => n.target),
          })),
        });
        assert.deepEqual(
          serious.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          [],
        );
      }
    },
  );
  const nojs = await setup({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await nojs.newPage();
  await check(
    "sem JavaScript: tecnologias, detalhes, projetos e navegação acessíveis",
    async () => {
      await fallback.goto(`${origin}/habilidades.html`);
      assert.equal(await fallback.locator(".tech-list").isVisible(), true);
      assert.equal(
        await fallback.locator("[data-tech-panel]:visible").count(),
        14,
      );
      await fallback.goto(`${origin}/projetos.html`);
      assert.equal(
        await fallback.locator("[data-project-entry]:visible").count(),
        9,
      );
      assert.equal(await fallback.locator("#navigation a").count(), 7);
    },
  );
  await nojs.close();
  assert.deepEqual(report.errors, [], "Erros JS ou violações CSP");
  console.log(
    `\n${report.checks.length} fluxos aprovados; ${report.routes.length} combinações de rota/largura.`,
  );
} finally {
  await writeFile(
    ".local/playground/browser-report.json",
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
