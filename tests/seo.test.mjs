import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const origin='https://matheus-riquelme-web.vercel.app';
const sitemap=await readFile('dist/sitemap.xml','utf8');
const paths=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]));
const config=JSON.parse(await readFile('vercel.json','utf8'));
const csp=config.headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;
test('13 URLs canônicas, metadados únicos, H1 único e JSON-LD permitido pela CSP',async()=>{
 assert.equal(paths.length,13);assert.equal(new Set(paths.map(u=>u.href)).size,13);
 const titles=new Set(),descriptions=new Set();
 for(const url of paths){
  assert.equal(url.origin,origin);
  const html=await readFile('dist/'+(url.pathname==='/'?'index.html':url.pathname.slice(1)),'utf8');
  assert.ok(html.includes(`rel="canonical" href="${url.href}"`));
  assert.ok(html.includes('content="index,follow,max-image-preview:large"'));
  assert.equal([...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length,1);
  titles.add(html.match(/<title>(.*?)<\/title>/)[1]);descriptions.add(html.match(/name="description" content="([^"]+)"/)[1]);
  const json=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1];
  assert.ok(JSON.parse(json)['@graph'].some(n=>n['@type']==='Person'));
  assert.ok(JSON.parse(json)['@graph'].some(n=>n['@type']==='ProfessionalService'));
  assert.ok(csp.includes(`'sha256-${createHash('sha256').update(json).digest('base64')}'`));
  for(const image of [...html.matchAll(/(?:src|href)="(assets\/[^"?#]+|styles.css|script.js)"/g)])await readFile('dist/'+image[1]);
 }
 assert.equal(titles.size,13);assert.equal(descriptions.size,13);
});
test('404 e ponte legada não indexam; demos podem receber noindex e sitemap só lista páginas úteis',async()=>{
 assert.match(await readFile('dist/404.html','utf8'),/content="noindex,follow"/);
 assert.doesNotMatch(await readFile('dist/404.html','utf8'),/rel="canonical"/);
 assert.match(await readFile('dist/projeto.html','utf8'),/content="noindex"/);
 assert.doesNotMatch(sitemap,/404|projeto\.html|processo\.html|\/demos\//);
 assert.doesNotMatch(await readFile('dist/robots.txt','utf8'),/Disallow:/);
 assert.ok(config.headers.some(h=>h.source==='/demos/(.*)'&&h.headers.some(h=>h.key==='X-Robots-Tag'&&h.value==='noindex')));
 assert.ok(config.redirects.some(r=>r.source==='/index.html'&&r.destination==='/'&&r.permanent));
});
