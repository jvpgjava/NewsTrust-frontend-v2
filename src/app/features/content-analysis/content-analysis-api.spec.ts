import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ContentAnalysisApi } from './content-analysis-api';
import { NewsContentAnalysisResponse } from './content-analysis.model';

describe('ContentAnalysisApi', () => {
  let service: ContentAnalysisApi;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContentAnalysisApi);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('POSTs to /analysis/content and returns the analysis result', async () => {
    const request = { title: 'Título', content: 'Conteúdo da notícia' };
    const response: NewsContentAnalysisResponse = {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Título',
      sourceUrl: null,
      analyzedAt: '2026-07-28T00:00:00Z',
      score: {
        value: 77,
        riskLevel: 'LOW_RISK',
        factors: {
          sourceReputation: 90,
          textualConsistency: 80,
          crossVerification: 70,
          disseminationPattern: 50,
          disseminationIsBaseline: true,
        },
        reasons: [],
        aiExplanations: [],
      },
    };

    const resultPromise = firstValueFrom(service.analyze(request));

    const testRequest = httpTesting.expectOne(`${environment.apiBaseUrl}/analysis/content`);
    expect(testRequest.request.method).toBe('POST');
    expect(testRequest.request.body).toEqual(request);
    testRequest.flush(response);

    await expect(resultPromise).resolves.toEqual(response);
  });
});
