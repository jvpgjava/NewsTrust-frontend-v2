import { Service, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AnalysisEventPayload } from './analysis-event.model';

/**
 * Uma unica conexao SSE (EventSource) compartilhada por todo o app - aberta na
 * primeira inscricao e mantida viva entre trocas de tela. O EventSource nativo
 * do navegador ja reconecta sozinho em caso de queda, entao nao ha logica de
 * retry manual aqui.
 */
@Service()
export class AnalysisEventsSource {
  private eventSource: EventSource | null = null;
  private readonly listeners = new Set<(payload: AnalysisEventPayload) => void>();

  readonly connected = signal(false);

  events(): Observable<AnalysisEventPayload> {
    this.ensureConnected();

    return new Observable<AnalysisEventPayload>((subscriber) => {
      const listener = (payload: AnalysisEventPayload) => subscriber.next(payload);
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    });
  }

  private ensureConnected(): void {
    if (this.eventSource) {
      return;
    }

    const source = new EventSource(`${environment.apiBaseUrl}/events/analyses`);
    source.addEventListener('open', () => this.connected.set(true));
    source.addEventListener('error', () => this.connected.set(false));
    source.addEventListener('analysis-created', ((event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as AnalysisEventPayload;
      this.listeners.forEach((listener) => listener(payload));
    }) as EventListener);

    this.eventSource = source;
  }
}
