import { createHash } from 'node:crypto';
export const productionOrigin = 'https://matheus-riquelme-web.vercel.app';
export function structuredData(site) {
  const person = `${site}/#person`;
  const service = `${site}/#service`;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': person, name: 'Matheus Riquelme', url: `${site}/sobre.html`,
        jobTitle: 'Desenvolvedor web freelancer', email: 'matheusriquelmeweb@gmail.com',
        image: `${site}/assets/images/portrait-cutout.webp`, sameAs: ['https://github.com/Riquelmedkzy'],
        knowsAbout: ['Desenvolvimento web', 'HTML', 'CSS', 'JavaScript', 'PHP', 'Aplicativos'] },
      { '@type': 'ProfessionalService', '@id': service, name: 'Matheus Riquelme — Desenvolvimento web',
        url: `${site}/servicos.html`, image: `${site}/1000620950.jpg`,
        description: 'Criação de sites, landing pages, lojas virtuais, sistemas web e aplicativos, com atendimento online para projetos no Rio de Janeiro.',
        email: 'matheusriquelmeweb@gmail.com', founder: { '@id': person },
        areaServed: { '@type': 'City', name: 'Rio de Janeiro', containedInPlace: { '@type': 'Country', name: 'Brasil' } },
        hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Serviços de desenvolvimento', itemListElement:
          ['Sites institucionais e landing pages', 'Lojas virtuais', 'Sistemas web', 'Aplicativos'].map(name =>
            ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, provider: { '@id': person } } })) } },
      { '@type': 'WebSite', '@id': `${site}/#website`, url: `${site}/`, name: 'Portfólio de Matheus Riquelme',
        inLanguage: 'pt-BR', author: { '@id': person } }
    ]
  };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return { tag: `<script type="application/ld+json">${json}</script>`, hash: `'sha256-${createHash('sha256').update(json).digest('base64')}'` };
}
