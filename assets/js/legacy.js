const slug = new URLSearchParams(location.search).get('slug');
const allowed=['aranhaverso','lista-tarefas','nexusfc','hogwarts','sexta-feira','ciberfolio','gestao-compras'];
if(allowed.includes(slug))location.replace(slug+'.html');
