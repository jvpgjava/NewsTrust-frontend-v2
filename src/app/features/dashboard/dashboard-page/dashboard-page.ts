import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { LoadingSpinner } from '../../../shared/ui/loading-spinner/loading-spinner';
import { ErrorBanner } from '../../../shared/ui/error-banner/error-banner';
import { Icon } from '../../../shared/ui/icon/icon';
import { GraphData, GraphNode } from '../../../shared/models/graph.model';
import { TrustGraphApi } from '../../trust-graph/trust-graph-api';

interface RiskSlice {
  label: string;
  count: number;
  percentage: number;
  colorVar: string;
}

/**
 * O backend nao expoe um endpoint de estatisticas agregadas nem historico
 * temporal (ver AnalysisController) - so os dois grafos (fontes/noticias) e o
 * detalhe de um no de noticia. Por isso este dashboard deriva tudo o que
 * mostra diretamente desses dois grafos, e nao inventa tendencia ao longo do
 * tempo nem uma lista de "analises recentes" (nenhum dos dois e uma
 * informacao que o backend realmente fornece hoje).
 */
@Component({
  selector: 'app-dashboard-page',
  imports: [DecimalPipe, LoadingSpinner, ErrorBanner, Icon],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private readonly api = inject(TrustGraphApi);

  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly sourcesGraph = signal<GraphData | null>(null);
  protected readonly newsGraph = signal<GraphData | null>(null);

  protected readonly sourcesCount = computed(() => this.sourcesGraph()?.nodes.length ?? 0);
  protected readonly connectionsCount = computed(() => this.sourcesGraph()?.edges.length ?? 0);
  protected readonly newsCount = computed(() => this.newsGraph()?.nodes.length ?? 0);
  protected readonly highRiskNewsCount = computed(
    () => this.newsGraph()?.nodes.filter((node) => node.riskLevel === 'HIGH_RISK').length ?? 0,
  );

  protected readonly averageNewsCredibility = computed(() => this.average(this.newsGraph()?.nodes ?? []));

  protected readonly riskDistribution = computed<RiskSlice[]>(() => {
    const nodes = this.newsGraph()?.nodes ?? [];
    const total = nodes.length;
    const low = nodes.filter((n) => n.riskLevel === 'LOW_RISK').length;
    const attention = nodes.filter((n) => n.riskLevel === 'ATTENTION').length;
    const high = nodes.filter((n) => n.riskLevel === 'HIGH_RISK').length;

    const pct = (value: number) => (total === 0 ? 0 : Math.round((value / total) * 100));

    return [
      { label: 'Baixo risco', count: low, percentage: pct(low), colorVar: 'var(--color-risk-low)' },
      { label: 'Atenção', count: attention, percentage: pct(attention), colorVar: 'var(--color-risk-attention)' },
      { label: 'Alto risco', count: high, percentage: pct(high), colorVar: 'var(--color-risk-high)' },
    ];
  });

  protected readonly topNewsNodes = computed<GraphNode[]>(() =>
    [...(this.newsGraph()?.nodes ?? [])].sort((a, b) => b.credibilityScore - a.credibilityScore).slice(0, 6),
  );

  constructor() {
    this.load();
  }

  protected retry(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.api.sourceNetwork().subscribe({
      next: (data) => this.sourcesGraph.set(data),
      error: (error) => this.errorMessage.set(error.userMessage ?? 'Erro ao carregar a rede de fontes.'),
    });

    this.api.newsNetwork().subscribe({
      next: (data) => {
        this.newsGraph.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.userMessage ?? 'Erro ao carregar a rede de notícias.');
        this.loading.set(false);
      },
    });
  }

  private average(nodes: GraphNode[]): number {
    if (nodes.length === 0) {
      return 0;
    }
    return nodes.reduce((sum, node) => sum + node.credibilityScore, 0) / nodes.length;
  }
}
