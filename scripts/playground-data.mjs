import { z } from 'zod';
const id=z.string().regex(/^[a-z][a-z0-9-]*$/);
const label=z.string().min(1).max(120);
const text=z.string().min(1).max(1200);
const unique=rows=>new Set(rows.map(r=>r.id)).size===rows.length;
export const ecosystemSchema=z.object({
 categories:z.array(z.object({id,name:label}).strict()).refine(unique,'Categorias duplicadas'),
 technologies:z.array(z.object({id,name:label,icon:id,category:id,color:z.string().regex(/^#[0-9a-f]{6}$/i),x:z.number().min(5).max(95),y:z.number().min(5).max(95),description:text,application:text,projects:z.array(id).min(1)}).strict()).refine(unique,'Tecnologias duplicadas'),
 relations:z.array(z.object({source:id,target:id,reason:text}).strict()),
 experiments:z.array(z.object({id,name:label,description:text,technologies:z.array(label),category:label,module:z.enum(['ui','animation','terminal']),status:z.enum(['ready','beta','development'])}).strict()).refine(unique,'Experimentos duplicados')
}).strict();
export function validateRelations(data,projects){
 const technologies=new Set(data.technologies.map(t=>t.id)),categories=new Set(data.categories.map(c=>c.id)),slugs=new Set(projects.map(p=>p.slug));
 for(const t of data.technologies){if(!categories.has(t.category)||t.projects.some(p=>!slugs.has(p)))throw Error(`Relação inválida: ${t.id}`);}
 const seen=new Set();
 for(const r of data.relations){const key=[r.source,r.target].sort().join(':');if(!technologies.has(r.source)||!technologies.has(r.target)||r.source===r.target||seen.has(key))throw Error(`Conexão inválida: ${key}`);seen.add(key);}
 return data;
}
export const statusLabels={completed:'Concluído',beta:'Beta',development:'Em desenvolvimento',unknown:'Estado não informado'};
