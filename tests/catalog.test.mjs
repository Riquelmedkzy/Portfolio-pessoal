import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {catalogSchema,escape} from '../scripts/catalog.mjs';
const projects=JSON.parse(await readFile('content/projects.json','utf8'));
test('catálogo preserva os sete projetos e inclui novas explorações',()=>{const parsed=catalogSchema.parse(projects);for(const slug of ['aranhaverso','lista-tarefas','nexusfc','hogwarts','sexta-feira','ciberfolio','gestao-compras'])assert.ok(parsed.some(p=>p.slug===slug));assert.equal(parsed.length,9);});
test('recusa slug duplicado, traversal e protocolos ativos',()=>{for(const altered of [[...projects,projects[0]],[{...projects[0],demo:'demos/../../config/local.php'}],[{...projects[0],repository:'javascript:alert(1)'}]])assert.equal(catalogSchema.safeParse(altered).success,false);});
test('escape de conteúdo impede HTML ativo',()=>{assert.equal(escape('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');});
test('saída não publica fontes, SQL, PHP ou dependências',async()=>{const files=await readdir('dist',{recursive:true});assert.equal(files.some(f=>/\.(php|sql|mjs|cjs)$/.test(f)||/^(?:content|config|database|node_modules|scripts)\//.test(f)),false);});
