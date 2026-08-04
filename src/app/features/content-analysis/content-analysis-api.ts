import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NewsContentAnalysisRequest, NewsContentAnalysisResponse } from './content-analysis.model';

@Service()
export class ContentAnalysisApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/analysis/content`;

  analyze(request: NewsContentAnalysisRequest): Observable<NewsContentAnalysisResponse> {
    return this.http.post<NewsContentAnalysisResponse>(this.baseUrl, request);
  }
}
