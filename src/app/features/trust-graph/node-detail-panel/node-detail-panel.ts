import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

import { CredibilityBreakdown } from '../../../shared/ui/credibility-breakdown/credibility-breakdown';
import { RiskBadge } from '../../../shared/ui/risk-badge/risk-badge';
import { Icon } from '../../../shared/ui/icon/icon';
import { GraphNode, NewsGraphNodeDetail } from '../../../shared/models/graph.model';

/**
 * Painel lateral de detalhes de um no selecionado no grafo. Para nos de
 * noticia, `detail` traz o conteudo completo (buscado via GET /graph/news/{id});
 * para nos de fonte, nao ha endpoint de detalhe separado - os metadados que ja
 * vem no proprio no do grafo (url, categoria de reputacao) sao suficientes.
 */
@Component({
  selector: 'app-node-detail-panel',
  imports: [DecimalPipe, RiskBadge, CredibilityBreakdown, Icon],
  templateUrl: './node-detail-panel.html',
  styleUrl: './node-detail-panel.css',
})
export class NodeDetailPanel {
  readonly node = input.required<GraphNode>();
  readonly detail = input<NewsGraphNodeDetail | null>(null);
  readonly close = output<void>();

  protected readonly sourceUrl = computed(() => this.readMetadata('url'));
  protected readonly reputationCategory = computed(() => this.readMetadata('reputationCategory'));

  private readMetadata(key: string): string | null {
    const value = this.node().metadata[key];
    return typeof value === 'string' && value.length > 0 ? value : null;
  }
}
