import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SourceAnalysisApi } from './source-analysis-api';
import { SourceAnalysisResponse } from './source-analysis.model';

describe('SourceAnalysisApi', () => {
  let service: SourceAnalysisApi;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SourceAnalysisApi);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('POSTs to /analysis/source and returns the analysis result', async () => {
    const request = { url: 'https://example.com' };
    const response: SourceAnalysisResponse = {
      id: '11111111-1111-1111-1111-111111111111',
      domain: 'example.com',
      url: 'https://example.com',
      reputationScore: 82,
      reputationCategory: 'confiável',
      reputationSignals: [],
      analyzedAt: '2026-07-29T00:00:00Z',
      score: {
        value: 82,
        riskLevel: 'LOW_RISK',
        factors: {
          sourceReputation: 82,
          textualConsistency: 0,
          crossVerification: 0,
          disseminationPattern: 0,
          disseminationIsBaseline: true,
        },
        reasons: [],
        aiExplanations: [],
      },
    };

    const resultPromise = firstValueFrom(service.analyze(request));

    const testRequest = httpTesting.expectOne(`${environment.apiBaseUrl}/analysis/source`);
    expect(testRequest.request.method).toBe('POST');
    expect(testRequest.request.body).toEqual(request);
    testRequest.flush(response);

    await expect(resultPromise).resolves.toEqual(response);
  });
});
