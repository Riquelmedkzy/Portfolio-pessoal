import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import {
  ecosystemSchema,
  validateRelations,
} from "../scripts/playground-data.mjs";
import { terminalCommands } from "../assets/js/lab/terminal.js";
const projects = JSON.parse(await readFile("content/projects.json"));
const raw = JSON.parse(await readFile("content/ecosystem.json"));
test("relações técnicas apontam para tecnologias, categorias e projetos existentes", () => {
  const data = ecosystemSchema.parse(raw);
  assert.doesNotThrow(() => validateRelations(data, projects));
  for (const r of data.relations) {
    assert.ok(r.reason.length > 10);
    const a = data.technologies.find((t) => t.id === r.source),
      b = data.technologies.find((t) => t.id === r.target);
    assert.ok(
      a.projects.some((p) => b.projects.includes(p)),
      `Conexão sem projeto compartilhado: ${a.id}/${b.id}`,
    );
  }
});
test("recusa relações inválidas, duplicadas e módulos arbitrários", () => {
  for (const mutate of [
    (d) => d.technologies[0].projects.push("nao-existe"),
    (d) => d.relations.push(d.relations[0]),
    (d) => (d.relations[0].target = "inexistente"),
  ]) {
    const d = structuredClone(raw);
    mutate(d);
    assert.throws(() => validateRelations(d, projects));
  }
  const d = structuredClone(raw);
  d.experiments[0].module = "../../config";
  assert.equal(ecosystemSchema.safeParse(d).success, false);
});
test("mapa e lista são gerados da mesma fonte com detalhes essenciais sem JS", async () => {
  const html = await readFile("dist/habilidades.html", "utf8");
  for (const t of raw.technologies) {
    assert.ok(html.includes(`data-tech-panel="${t.id}"`));
    assert.equal(
      [
        ...html.matchAll(
          new RegExp(`data-tech-select="${t.id}" data-category=`, "g"),
        ),
      ].length,
      2,
    );
    for (const slug of t.projects)
      assert.ok(html.includes(`href="${slug}.html"`));
  }
  assert.ok(html.includes('id="tech-details"'));
});
test("todos os estudos têm dez áreas técnicas e links preservados", async () => {
  for (const p of projects) {
    const html = await readFile(`dist/${p.slug}.html`, "utf8");
    for (const id of [
      "visao-geral",
      "necessidade",
      "objetivos",
      "tecnologias",
      "arquitetura",
      "processo",
      "desafios",
      "solucoes",
      "resultado",
      "demonstracao",
    ])
      assert.ok(html.includes(`id="${id}"`));
    for (const url of [p.repository, p.release].filter(Boolean))
      assert.ok(html.includes(url));
  }
});
test("Home preserva conteúdo, retrato e scripts orbitais", async () => {
  const previous = execFileSync("git", ["show", "main:index.html"], {
      encoding: "utf8",
    }),
    current = await readFile("index.html", "utf8");
  assert.equal(current.replace('<a href="lab.html" >Lab</a>', ""), previous);
  for (const path of [
    "assets/js/experience.js",
    "assets/js/motion.js",
    "assets/js/entrance.js",
    "assets/images/portrait-cutout.webp",
  ]) {
    assert.deepEqual(
      await readFile(path),
      execFileSync("git", ["show", `main:${path}`], {
        maxBuffer: 8 * 1024 * 1024,
      }),
    );
  }
});
test("terminal possui só comandos permitidos e destinos locais", () => {
  assert.deepEqual(Object.keys(terminalCommands), [
    "help",
    "about",
    "skills",
    "projects",
    "lab",
    "contact",
    "clear",
  ]);
  assert.ok(Object.isFrozen(terminalCommands));
  for (const url of Object.values(terminalCommands).filter(Boolean))
    assert.match(url, /^[a-z-]+\.html(?:#[a-z]+)?$/);
  assert.equal(Object.hasOwn(terminalCommands, "__proto__"), false);
});
test("demo Aranhaverso contém 11 páginas e somente arquivos públicos", async () => {
  const files = await readdir("dist/demos/aranhaverso", { recursive: true });
  assert.equal(files.filter((f) => f.endsWith(".html")).length, 11);
  assert.equal(
    files.some((f) => /\.(?:php|sql|json|log|ini)$/.test(f)),
    false,
  );
  const html = await readFile("dist/demos/aranhaverso/index.html", "utf8");
  assert.match(html, /Demo visual navegável/);
  assert.doesNotMatch(html, /index\.php|cdn\.jsdelivr/);
  assert.equal([...html.matchAll(/class="movie-tile"/g)].length, 9);
});
test("inventário inclui os sete repositórios públicos selecionados", async () => {
  const repos = JSON.parse(await readFile("content/repositories.json"));
  assert.equal(repos.length, 7);
  for (const name of [
    "Lista-de-Tarefas",
    "Sistema-de-futebol",
    "desktop-tutorial",
  ])
    assert.ok(!repos.some((r) => r.name === name));
});

test('todos os projetos exibidos têm demo real e descrição de seus limites',async()=>{
 const listed=projects.filter(p=>p.listed!==false);
 assert.equal(listed.length,8);
 for(const p of listed){assert.ok(p.demo,p.slug);assert.ok(p.demoNote?.length>40,p.slug);const html=await readFile('dist/'+p.demo,'utf8');assert.match(html,/<html\b/);const study=await readFile('dist/'+p.slug+'.html','utf8');assert.ok(study.includes(`data-load-demo="${p.demo}"`));}
 const registry=await import('../assets/js/demo-registry.js');assert.deepEqual(registry.demoPaths,projects.filter(p=>p.demo).map(p=>p.demo));
});
test('exports novos contêm somente apresentação pública e fixtures de catálogo',async()=>{
 for(const slug of ['pokelab','mundo-invertido','ciberfolio','gestao-compras','lista-tarefas']){const files=await readdir('dist/demos/'+slug,{recursive:true});assert.equal(files.some(f=>/\.(?:php|sqlite|sql|log|env|ini|bak)$/.test(f)||/(?:^|\/)(?:uploads|\.private|config)(?:\/|$)/.test(f)),false);}
 const poke=await readFile('dist/demos/pokelab/index.html','utf8');assert.doesNotMatch(poke,/\\account\.html|home-fire#catalog/);assert.match(poke,/home-fire\.html#catalog/);
});
