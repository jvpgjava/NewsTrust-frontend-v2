import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import * as d3 from 'd3';

import { RiskLevel } from '../../../shared/models/credibility.model';
import { GraphData, GraphNode } from '../../../shared/models/graph.model';

interface SimNode extends GraphNode, d3.SimulationNodeDatum {}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  weight: number;
}

/** Deve ficar em sincronia com --color-risk-* em src/styles.css. */
const RISK_COLORS: Record<RiskLevel, string> = {
  LOW_RISK: '#10b981',
  ATTENTION: '#f59e0b',
  HIGH_RISK: '#ef4444',
};

const RISK_LABELS: Record<RiskLevel, string> = {
  LOW_RISK: 'Baixo risco',
  ATTENTION: 'Atenção',
  HIGH_RISK: 'Alto risco',
};

const NODE_RADIUS = 10;
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 480;

/**
 * Encapsula toda a integracao com D3 - forca-dirigida, zoom/pan, drag de nos,
 * clique/teclado para selecionar um no. O container e um <div> vazio no
 * template Angular; tudo dentro dele e manipulado imperativamente pelo D3 via
 * afterNextRender()/effect(), nunca por bindings do Angular, entao os dois
 * mundos nunca competem pelo mesmo DOM.
 */
@Component({
  selector: 'app-graph-canvas',
  imports: [],
  templateUrl: './graph-canvas.html',
  styleUrl: './graph-canvas.css',
})
export class GraphCanvas implements OnDestroy {
  readonly data = input.required<GraphData>();
  readonly nodeClick = output<GraphNode>();

  private readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  private svg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private linkGroup?: d3.Selection<SVGGElement, unknown, null, undefined>;
  private nodeGroup?: d3.Selection<SVGGElement, unknown, null, undefined>;
  private simulation?: d3.Simulation<SimNode, SimLink>;
  private resizeObserver?: ResizeObserver;
  private zoomBehavior?: d3.ZoomBehavior<SVGSVGElement, unknown>;

  readonly zoomLevel = signal(1);

  zoomIn(): void {
    this.zoomBy(1.2);
  }

  zoomOut(): void {
    this.zoomBy(1 / 1.2);
  }

  resetZoom(): void {
    if (this.svg && this.zoomBehavior) {
      this.svg.transition().duration(200).call(this.zoomBehavior.transform, d3.zoomIdentity);
    }
  }

  private zoomBy(factor: number): void {
    if (this.svg && this.zoomBehavior) {
      this.svg.transition().duration(200).call(this.zoomBehavior.scaleBy, factor);
    }
  }

  constructor() {
    afterNextRender(() => {
      this.initialize();
      this.render(this.data());
    });

    effect(() => {
      const data = this.data();
      if (this.svg) {
        this.render(data);
      }
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.simulation?.stop();
  }

  private initialize(): void {
    const host = this.container().nativeElement;
    const { width, height } = this.measure(host);

    const svg = d3
      .select(host)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('role', 'img')
      .attr('aria-label', 'Grafo de credibilidade interativo');

    const zoomLayer = svg.append('g');

    this.linkGroup = zoomLayer.append('g').attr('stroke', '#94a3b8').attr('stroke-opacity', 0.6);
    this.nodeGroup = zoomLayer.append('g');

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        zoomLayer.attr('transform', event.transform);
        this.zoomLevel.set(event.transform.k);
      });

    svg.call(zoomBehavior);
    this.zoomBehavior = zoomBehavior;
    this.svg = svg;

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        const size = this.measure(host);
        svg.attr('viewBox', `0 0 ${size.width} ${size.height}`);
        this.simulation?.force('center', d3.forceCenter(size.width / 2, size.height / 2));
        this.simulation?.alpha(0.3).restart();
      });
      this.resizeObserver.observe(host);
    }
  }

  private measure(host: HTMLDivElement): { width: number; height: number } {
    const rect = host.getBoundingClientRect();
    return { width: rect.width || DEFAULT_WIDTH, height: rect.height || DEFAULT_HEIGHT };
  }

  private render(data: GraphData): void {
    if (!this.svg || !this.linkGroup || !this.nodeGroup) {
      return;
    }

    const { width, height } = this.measure(this.container().nativeElement);

    const nodes: SimNode[] = data.nodes.map((node) => ({ ...node }));
    const nodeIds = new Set(nodes.map((node) => node.id));
    const links: SimLink[] = data.edges
      .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
      .map((edge) => ({ source: edge.source, target: edge.target, weight: edge.weight }));

    this.simulation?.stop();

    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((node) => node.id)
          .distance(80)
          .strength((link) => Math.max(0.1, link.weight)),
      )
      .force('charge', d3.forceManyBody().strength(-180))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(NODE_RADIUS + 6));

    const link = this.linkGroup
      .selectAll<SVGLineElement, SimLink>('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => Math.max(1, d.weight * 3));

    const drag = d3
      .drag<SVGGElement, SimNode>()
      .on('start', (event, d) => {
        if (!event.active) {
          simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) {
          simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      });

    const node = this.nodeGroup
      .selectAll<SVGGElement, SimNode>('g')
      .data(nodes, (d) => (d as SimNode).id)
      .join((enter) => {
        const g = enter.append('g').attr('tabindex', 0).attr('role', 'button');
        g.append('circle').attr('r', NODE_RADIUS);
        g.append('title');
        return g;
      })
      .attr('aria-label', (d) => `${d.label} - ${RISK_LABELS[d.riskLevel]}`)
      .on('click', (_event, d) => this.nodeClick.emit(d))
      .on('keydown', (event: KeyboardEvent, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.nodeClick.emit(d);
        }
      })
      .call(drag);

    node.select('circle').attr('fill', (d) => RISK_COLORS[d.riskLevel]);
    node.select('title').text((d) => `${d.label} (${d.credibilityScore.toFixed(1)})`);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as SimNode).x ?? 0)
        .attr('y1', (d) => (d.source as SimNode).y ?? 0)
        .attr('x2', (d) => (d.target as SimNode).x ?? 0)
        .attr('y2', (d) => (d.target as SimNode).y ?? 0);

      node.attr('transform', (d) => `translate(${d.x ?? 0}, ${d.y ?? 0})`);
    });

    this.simulation = simulation;
  }
}
