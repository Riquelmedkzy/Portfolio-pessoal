import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
page.setDefaultTimeout(20000);
const origin = process.env.PREVIEW_URL || "http://127.0.0.1:8765";
const errors = [],
  requests = [],
  checks = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("request", (r) => {
  if (r.method() === "POST") requests.push(r.url());
});
const projects = JSON.parse(await readFile("content/projects.json"));
async function run(name, fn) {
  await fn();
  checks.push(name);
  console.log("OK", name);
}
async function open(slug) {
  await page.goto(`${origin}/${slug}.html#demonstracao`);
  await page.locator("[data-load-demo]").click();
  await page.frameLocator("iframe").locator("body").waitFor();
  if(["pokelab","lista-tarefas","mundo-invertido","ciberfolio","gestao-compras"].includes(slug)) await page.frameLocator("iframe").locator('html[data-presentation-ready="true"]').waitFor();
  return page.frameLocator("iframe");
}
try {
  await run(
    "PokéLab: catálogo, busca, ficha e equipe entre páginas no sandbox",
    async () => {
      let f = await open("pokelab");
      await f.locator(".element-tile.type-fire").click();
      await f.locator("#search").fill("Charizard");
      assert.equal(await f.locator(".pokemon-card:visible").count(), 1);
      await f.locator(".pokemon-name").filter({ hasText: "Charizard" }).click();
      await f.locator("h1").filter({ hasText: "Charizard" }).waitFor();
      await f.locator('a[href^="team-fire.html"]').click();
      await f.locator(".suggested-card [data-add]").click();
      await f.locator("#team-slots .occupied").waitFor();
      assert.equal(await f.locator("#team-slots .occupied").count(), 1);
      await f.locator(".element-back").click();
      await f.locator(".element-tile.type-water").click();
      await f.locator("[data-add]:not([disabled])").first().click();
      assert.equal(await f.locator("#team-slots .occupied").count(), 2);
      await f.locator("#analyze").click();
      await f.locator("#analysis:not([hidden])").waitFor();
    },
  );
  await run(
    "ListaTarefas: criar, editar, concluir, filtrar e excluir dados fictícios",
    async () => {
      const f = await open("lista-tarefas");
      await f.locator("#title").fill("Teste de demonstração");
      await f.locator("#save").click();
      await f.locator("#search").fill("Teste de demonstração");
      assert.equal(await f.locator("#tasks li").count(), 1);
      await f
        .getByRole("button", {
          name: "Editar Teste de demonstração",
          exact: true,
        })
        .click();
      await f.locator("#title").fill("Tarefa editada");
      await f.locator("#save").click();
      await f.locator("#search").fill("Tarefa editada");
      await f.locator("#tasks input[type=checkbox]").check();
      await f.locator("#status-filter").selectOption("done");
      assert.equal(await f.locator("#tasks li").count(), 1);
      await f
        .getByRole("button", { name: "Excluir Tarefa editada", exact: true })
        .click();
      assert.equal(await f.locator("#tasks li").count(), 0);
    },
  );
  await run(
    "Mundo Invertido: troca de mundos, temporadas e formulários sem envio",
    async () => {
      const f = await open("mundo-invertido");
      const before = await f.locator("body").getAttribute("data-world");
      await f.locator("[data-switch-world]").click();
      assert.notEqual(
        await f.locator("body").getAttribute("data-world"),
        before,
      );
      await f.locator('#navigation a[href="temporadas.html"]').click();
      await f.locator('[data-season="2"]').click();
      await f.locator('[data-season="2"][aria-current="true"]').waitFor();
      await f.locator('#navigation a[href="contact.html"]').click();
      await f
        .locator("form button")
        .last()
        .click();
      await f.locator("[data-demo-feedback]").waitFor();
    },
  );
  await run(
    "Ciberfólio: páginas originais e formulário ilustrativo",
    async () => {
      const f = await open("ciberfolio");
      if(await f.locator("[data-nav-toggle]").isVisible())await f.locator("[data-nav-toggle]").click();
      await f.locator('.nav-links a[href="servico.html"]').click();
      await f.locator("h1").waitFor();
      if(await f.locator("[data-nav-toggle]").isVisible())await f.locator("[data-nav-toggle]").click();
      await f.locator('.nav-links a[href="contact.html"]').click();
      await f.locator("form").first().locator("button").last().click();
      await f.locator("[data-demo-feedback]").waitFor();
    },
  );
  await run(
    "Gestão de compras: cadastro, acesso e perfil fictício",
    async () => {
      const f = await open("gestao-compras");
      await f.locator('nav a[href="register.html"]').click();
      await f.locator("form").waitFor();
      await f.locator('nav a[href="profile.html"]').click();
      assert.match(await f.locator("body").innerText(), /Visitante de exemplo/);
      assert.equal(await f.locator("input[type=file]").count(), 0);
    },
  );
  await run(
    "Todos os oito projetos listados carregam demos em desktop e mobile",
    async () => {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const p of projects.filter((p) => p.listed !== false)) {
          assert.ok(p.demo, p.slug);
          const f = await open(p.slug);
          await f.locator("body").waitFor();
          await page.waitForTimeout(250);
          assert.equal(
            await f
              .locator("body")
              .evaluate(
                () => document.documentElement.scrollWidth > innerWidth,
              ),
            false,
            p.slug + " overflow " + width,
          );
          await page.screenshot({
            path: `.local/playground/demo-${p.slug}-${width}.png`,
            fullPage: false,
          });
          await page.locator("[data-close-demo]").click();
          assert.equal(await page.locator("iframe").count(), 0);
        }
      }
    },
  );
  assert.deepEqual(requests, [], "Demonstrações não devem enviar formulários");
  assert.deepEqual(errors, []);
  console.log("Todos os fluxos passaram.");
} finally {
  await mkdir(".local/playground", { recursive: true });
  await writeFile(
    ".local/playground/demos-report.json",
    JSON.stringify({ checks, errors, postRequests: requests }, null, 2),
  );
  await browser.close();
}
