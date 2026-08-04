import { Component } from '@angular/core';

interface TeamMember {
  name: string;
  linkedIn: string;
}

interface Pillar {
  num: string;
  titulo: string;
  descricao: string;
}

/** Pagina estatica - nao depende de nenhum endpoint do backend. */
@Component({
  selector: 'app-about-page',
  imports: [],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
})
export class AboutPage {
  protected readonly pillars: Pillar[] = [
    {
      num: '01',
      titulo: 'Reputação da Fonte (R)',
      descricao:
        'Consulta bases de reputação de domínio e uma lista curada de veículos jornalísticos brasileiros com registro editorial público.',
    },
    {
      num: '02',
      titulo: 'Consistência Textual (T)',
      descricao:
        'Heurísticas linguísticas combinadas com análise semântica por IA para identificar sensacionalismo e inconsistências internas ao texto.',
    },
    {
      num: '03',
      titulo: 'Verificação Cruzada (V)',
      descricao: 'Compara a notícia com outras já processadas na rede para confirmar ou contradizer sua afirmação central.',
    },
    {
      num: '04',
      titulo: 'Padrão de Disseminação (D)',
      descricao:
        'Considera velocidade e alcance de propagação quando há dados disponíveis; aplica um baseline neutro quando não há.',
    },
  ];

  protected readonly values: Pillar[] = [
    {
      num: '01',
      titulo: 'Transparência',
      descricao: 'Os fatores por trás de cada score são sempre exibidos junto ao resultado — nunca apenas o número.',
    },
    {
      num: '02',
      titulo: 'Precisão',
      descricao: 'Metodologias e modelos são constantemente refinados e testados para garantir resultados confiáveis.',
    },
    {
      num: '03',
      titulo: 'Neutralidade',
      descricao: 'Foco exclusivo na veracidade factual, sem viés político ou ideológico.',
    },
    {
      num: '04',
      titulo: 'Acessibilidade',
      descricao: 'Interface intuitiva e resultados claros, independentemente de conhecimento técnico.',
    },
  ];

  protected readonly team: TeamMember[] = [
    { name: 'João Vitor Prestes Grando', linkedIn: 'https://www.linkedin.com/in/jvprestessg' },
    { name: 'Évilyn Flores Francisco', linkedIn: 'https://www.linkedin.com/in/evilyn-flores' },
    { name: 'Guilherme Lima Sarmento', linkedIn: 'https://www.linkedin.com/in/guilherme-sarmento-972665394' },
    { name: 'Vinicius Martinez da Silva', linkedIn: 'https://www.linkedin.com/in/vinícius-martinez-76857334a' },
    { name: 'Rafael Ramos da Luz', linkedIn: 'https://www.linkedin.com/in/rafael-ramos-da-luz-69772b164' },
  ];

  protected readonly advisor: TeamMember = {
    name: 'Arthur Marques de Oliveira',
    linkedIn: 'https://www.linkedin.com/in/arthur-marques-de-oliveira-a09072110',
  };
}
