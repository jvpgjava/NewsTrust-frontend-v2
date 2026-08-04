import { Component } from '@angular/core';

interface TeamMember {
  nome: string;
  role: string;
  bio: string;
  lattes: string;
  foto: string;
  initials: string;
  color: string;
}

/** Pagina estatica - nao depende de nenhum endpoint do backend. */
@Component({
  selector: 'app-team-page',
  imports: [],
  templateUrl: './team-page.html',
  styleUrl: './team-page.css',
})
export class TeamPage {
  protected readonly team: TeamMember[] = [
    {
      nome: 'João Vitor Prestes Grando',
      role: 'Engenheiro de Software',
      bio: 'Engenheiro de Software Full Stack com experiência em desenvolvimento web, mobile e sistemas de missão crítica. Estudante de Ciência da Computação no Cesuca, com interesse em arquitetura de software e IA aplicada ao desenvolvimento.',
      lattes: 'http://lattes.cnpq.br/8107993643947536',
      foto: '/team/JoaoFoto.jpeg',
      initials: 'JV',
      color: '#2563eb',
    },
    {
      nome: 'Arthur Marques de Oliveira',
      role: 'Orientador de Pesquisa',
      bio: 'Doutorando em Informática na Educação (PPGIE) e Estudos da Linguagem (PPGLET) pela UFRGS. Pesquisador em tecnologias educacionais e inteligência artificial aplicada ao ensino.',
      lattes: 'http://lattes.cnpq.br/8160836639323527',
      foto: '/team/ArthurFoto.jpeg',
      initials: 'AM',
      color: '#1e40af',
    },
  ];
}
