import { Component } from '@angular/core';

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
}
