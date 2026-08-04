import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Icon, IconName } from '../../../shared/ui/icon/icon';

interface MenuItem {
  path: string;
  label: string;
  icon: IconName;
}

const MENU_ITEMS: MenuItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'bar-chart' },
  { path: '/analysis', label: 'Análise de Notícias', icon: 'search' },
  { path: '/trust-graph', label: 'Rede de Confiança', icon: 'network' },
  { path: '/about', label: 'Sobre o Sistema', icon: 'info' },
  { path: '/contact', label: 'Fale Conosco', icon: 'message-circle' },
];

/**
 * Cabecalho fixo no estilo do Mediar-frontend: logo + navegacao horizontal
 * sempre visivel em telas largas (lg+), com um menu hamburguer/painel
 * deslizante como fallback so em telas estreitas. A navegacao (desktop e
 * painel movel) fica sempre no DOM - alternada por classes de transform, nao
 * por @if - para que marca e links continuem presentes no texto da pagina
 * independentemente do breakpoint ou do painel estar aberto.
 */
@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader {
  protected readonly open = signal(false);
  protected readonly items = MENU_ITEMS;

  protected toggle(): void {
    this.open.update((value) => !value);
  }

  protected close(): void {
    this.open.set(false);
  }
}
