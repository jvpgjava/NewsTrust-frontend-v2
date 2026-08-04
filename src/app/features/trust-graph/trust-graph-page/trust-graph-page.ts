import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';

import { AnalysisEventsSource } from '../../../core/realtime/analysis-events-source';
import { ApiError } from '../../../core/http/api-error.model';
import { ErrorBanner } from '../../../shared/ui/error-banner/error-banner';
import { LoadingSpinner } from '../../../shared/ui/loading-spinner/loading-spinner';
import { Icon } from '../../../shared/ui/icon/icon';
import { GraphData, GraphNetwork, GraphNode, NewsGraphNodeDetail } from '../../../shared/models/graph.model';
import { GraphCanvas } from '../graph-canvas/graph-canvas';
import { NodeDetailPanel } from '../node-detail-panel/node-detail-panel';
import { TrustGraphApi } from '../trust-graph-api';

const LIVE_UPDATE_DEBOUNCE_MILLIS = 500;

@Component({
  selector: 'app-trust-graph-page',
  imports: [DecimalPipe, LoadingSpinner, ErrorBanner, GraphCanvas, NodeDetailPanel, Icon],
  templateUrl: './trust-graph-page.html',
  styleUrl: './trust-graph-page.css',
})
export class TrustGraphPage {
  private readonly api = inject(TrustGraphApi);
  private readonly eventsSource = inject(AnalysisEventsSource);

  protected readonly activeNetwork = signal<GraphNetwork>('sources');
  protected readonly graphData = signal<GraphData | null>(null);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly selectedNode = signal<GraphNode | null>(null);
  protected readonly selectedNodeDetail = signal<NewsGraphNodeDetail | null>(null);

  protected readonly connected = this.eventsSource.connected;

  protected readonly nodeCount = computed(() => this.graphData()?.nodes.length ?? 0);
  protected readonly edgeCount = computed(() => this.graphData()?.edges.length ?? 0);
  protected readonly averageCredibility = computed(() => {
    const nodes = this.graphData()?.nodes ?? [];
    if (nodes.length === 0) {
      return 0;
    }
    return nodes.reduce((sum, node) => sum + node.credibilityScore, 0) / nodes.length;
  });

  constructor() {
    this.loadGraph();

    this.eventsSource
      .events()
      .pipe(
        filter((event) => event.network === this.activeNetwork()),
        debounceTime(LIVE_UPDATE_DEBOUNCE_MILLIS),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.loadGraph());
  }

  protected switchNetwork(network: GraphNetwork): void {
    if (network === this.activeNetwork()) {
      return;
    }
    this.activeNetwork.set(network);
    this.closeDetail();
    this.loadGraph();
  }

  protected onNodeSelected(node: GraphNode): void {
    this.selectedNode.set(node);
    this.selectedNodeDetail.set(null);

    if (this.activeNetwork() === 'news') {
      this.api.newsNodeDetail(node.id).subscribe({
        next: (detail) => this.selectedNodeDetail.set(detail),
        error: () => this.selectedNodeDetail.set(null),
      });
    }
  }

  protected closeDetail(): void {
    this.selectedNode.set(null);
    this.selectedNodeDetail.set(null);
  }

  protected retry(): void {
    this.loadGraph();
  }

  private loadGraph(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const request = this.activeNetwork() === 'sources' ? this.api.sourceNetwork() : this.api.newsNetwork();
    request.subscribe({
      next: (data) => {
        this.graphData.set(data);
        this.loading.set(false);
      },
      error: (error: ApiError) => {
        this.errorMessage.set(error.userMessage);
        this.loading.set(false);
      },
    });
  }
}
