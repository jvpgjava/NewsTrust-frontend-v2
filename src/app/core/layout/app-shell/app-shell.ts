import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteHeader } from '../site-header/site-header';

/**
 * Layout raiz: cabecalho fixo (nav horizontal em telas largas, menu
 * hamburguer/painel deslizante como fallback em telas estreitas) +
 * router-outlet + rodape. Persistente entre as trocas de rota.
 */
@Component({
  selector: 'app-app-shell',
  imports: [RouterOutlet, SiteHeader],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell {}
