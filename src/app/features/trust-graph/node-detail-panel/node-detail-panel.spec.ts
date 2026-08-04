import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphNode, NewsGraphNodeDetail } from '../../../shared/models/graph.model';
import { NodeDetailPanel } from './node-detail-panel';

describe('NodeDetailPanel', () => {
  let fixture: ComponentFixture<NodeDetailPanel>;

  const sourceNode: GraphNode = {
    id: 'example.com',
    label: 'example.com',
    credibilityScore: 82,
    riskLevel: 'LOW_RISK',
    metadata: { url: 'https://example.com', reputationCategory: 'confiável' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeDetailPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(NodeDetailPanel);
  });

  it('shows metadata directly for a source node without a detail fetch', async () => {
    fixture.componentRef.setInput('node', sourceNode);
    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('example.com');
    expect(text).toContain('confiável');
  });

  it('emits close when the close button is clicked', async () => {
    fixture.componentRef.setInput('node', sourceNode);
    fixture.detectChanges();
    await fixture.whenStable();

    let closed = false;
    fixture.componentInstance.close.subscribe(() => (closed = true));
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(closed).toBe(true);
  });

  it('shows content and connections for a news node with detail', async () => {
    const newsNode: GraphNode = {
      id: '11111111-1111-1111-1111-111111111111',
      label: 'Título da notícia',
      credibilityScore: 70,
      riskLevel: 'ATTENTION',
      metadata: {},
    };
    const detail: NewsGraphNodeDetail = {
      id: newsNode.id,
      title: newsNode.label,
      content: 'Conteúdo completo da notícia analisada.',
      analyzedAt: '2026-07-29T00:00:00Z',
      connections: [{ source: newsNode.id, target: '22222222-2222-2222-2222-222222222222', weight: 0.8 }],
      score: {
        value: 70,
        riskLevel: 'ATTENTION',
        factors: {
          sourceReputation: 70,
          textualConsistency: 70,
          crossVerification: 70,
          disseminationPattern: 70,
          disseminationIsBaseline: false,
        },
        reasons: [],
        aiExplanations: [],
      },
    };

    fixture.componentRef.setInput('node', newsNode);
    fixture.componentRef.setInput('detail', detail);
    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Conteúdo completo da notícia analisada.');
    expect(text).toContain('22222222-2222-2222-2222-222222222222');
  });
});
