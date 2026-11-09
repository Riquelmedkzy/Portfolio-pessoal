import { z } from 'zod';
export const localPath = z.string().regex(/^(?:assets|demos)\/[a-zA-Z0-9_./-]+$/).refine(v=>!v.split('/').includes('..'));
const https = z.url().refine(v => new URL(v).protocol === 'https:');
const text = z.string().min(1).max(3000);
export const catalogSchema = z.array(z.object({slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),title:text,category:text,summary:text,description:text,role:text,technologies:z.array(text).min(1),challenge:text,solution:text,outcome:text,repository:https.optional(),release:https.optional(),demo:localPath.optional(),image:localPath.optional(),imageAlt:text.optional(),imageNote:text.optional(),featured:z.boolean(),status:z.enum(['completed','beta','development','unknown']),type:z.enum(['web','mobile','local','tool']),architecture:text,process:text}).strict()).min(1).refine(v=>new Set(v.map(p=>p.slug)).size===v.length,'Slugs duplicados').refine(v=>v.every(p=>!p.image||p.imageAlt),'Imagem sem descrição');
export const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
