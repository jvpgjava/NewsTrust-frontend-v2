import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Icon } from '../../../shared/ui/icon/icon';

/**
 * Abas "Análise de Conteúdo" / "Análise de Fonte" - navegacao real via
 * Router (URLs proprias e navegaveis), nao estado local de componente.
 */
@Component({
  selector: 'app-analysis-tabs',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Icon],
  templateUrl: './analysis-tabs.html',
  styleUrl: './analysis-tabs.css',
})
export class AnalysisTabs {}
