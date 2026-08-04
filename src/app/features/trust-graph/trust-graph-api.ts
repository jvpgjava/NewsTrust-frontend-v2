import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { GraphData, NewsGraphNodeDetail } from '../../shared/models/graph.model';
import { environment } from '../../../environments/environment';

@Service()
export class TrustGraphApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/graph`;

  sourceNetwork(): Observable<GraphData> {
    return this.http.get<GraphData>(`${this.baseUrl}/sources`);
  }

  newsNetwork(): Observable<GraphData> {
    return this.http.get<GraphData>(`${this.baseUrl}/news`);
  }

  newsNodeDetail(id: string): Observable<NewsGraphNodeDetail> {
    return this.http.get<NewsGraphNodeDetail>(`${this.baseUrl}/news/${id}`);
  }
}
