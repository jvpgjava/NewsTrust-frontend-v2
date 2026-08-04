import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphData, GraphNode } from '../../../shared/models/graph.model';
import { GraphCanvas } from './graph-canvas';

describe('GraphCanvas', () => {
  let fixture: ComponentFixture<GraphCanvas>;

  const data: GraphData = {
    nodes: [
      { id: 'a', label: 'Fonte A', credibilityScore: 90, riskLevel: 'LOW_RISK', metadata: {} },
      { id: 'b', label: 'Fonte B', credibilityScore: 30, riskLevel: 'HIGH_RISK', metadata: {} },
    ],
    edges: [{ source: 'a', target: 'b', weight: 0.5 }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphCanvas],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphCanvas);
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders one SVG circle per node', () => {
    const circles = fixture.nativeElement.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('renders one line per edge', () => {
    const lines = fixture.nativeElement.querySelectorAll('line');
    expect(lines.length).toBe(1);
  });

  it('emits nodeClick with the clicked node when a node is clicked', () => {
    const emitted: GraphNode[] = [];
    fixture.componentInstance.nodeClick.subscribe((node: GraphNode) => emitted.push(node));

    const firstNodeGroup: SVGGElement = fixture.nativeElement.querySelector('g[role="button"]');
    firstNodeGroup.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(emitted.length).toBe(1);
    expect(['a', 'b']).toContain(emitted[0].id);
  });

  it('re-renders when the data input changes', async () => {
    const updated: GraphData = {
      nodes: [...data.nodes, { id: 'c', label: 'Fonte C', credibilityScore: 60, riskLevel: 'ATTENTION', metadata: {} }],
      edges: data.edges,
    };

    fixture.componentRef.setInput('data', updated);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('circle').length).toBe(3);
  });
});
