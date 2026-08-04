import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { GraphData } from '../../shared/models/graph.model';
import { TrustGraphApi } from './trust-graph-api';

describe('TrustGraphApi', () => {
  let service: TrustGraphApi;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TrustGraphApi);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('GETs /graph/sources', async () => {
    const graph: GraphData = { nodes: [], edges: [] };
    const resultPromise = firstValueFrom(service.sourceNetwork());

    httpTesting.expectOne(`${environment.apiBaseUrl}/graph/sources`).flush(graph);

    await expect(resultPromise).resolves.toEqual(graph);
  });

  it('GETs /graph/news', async () => {
    const graph: GraphData = { nodes: [], edges: [] };
    const resultPromise = firstValueFrom(service.newsNetwork());

    httpTesting.expectOne(`${environment.apiBaseUrl}/graph/news`).flush(graph);

    await expect(resultPromise).resolves.toEqual(graph);
  });

  it('GETs /graph/news/{id}', async () => {
    const id = '11111111-1111-1111-1111-111111111111';
    const resultPromise = firstValueFrom(service.newsNodeDetail(id));

    httpTesting.expectOne(`${environment.apiBaseUrl}/graph/news/${id}`).flush({
      id,
      title: 'Título',
      content: 'Conteúdo',
      analyzedAt: '2026-07-29T00:00:00Z',
      connections: [],
      score: {
        value: 80,
        riskLevel: 'LOW_RISK',
        factors: {
          sourceReputation: 80,
          textualConsistency: 80,
          crossVerification: 80,
          disseminationPattern: 80,
          disseminationIsBaseline: false,
        },
        reasons: [],
        aiExplanations: [],
      },
    });

    const detail = await resultPromise;
    expect(detail.id).toBe(id);
  });
});
