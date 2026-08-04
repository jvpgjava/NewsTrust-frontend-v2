import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SourceAnalysisRequest, SourceAnalysisResponse } from './source-analysis.model';

@Service()
export class SourceAnalysisApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/analysis/source`;

  analyze(request: SourceAnalysisRequest): Observable<SourceAnalysisResponse> {
    return this.http.post<SourceAnalysisResponse>(this.baseUrl, request);
  }
}
