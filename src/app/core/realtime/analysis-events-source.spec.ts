import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { AnalysisEventPayload } from './analysis-event.model';
import { AnalysisEventsSource } from './analysis-events-source';

type Listener = (event: { data: string }) => void;

class MockEventSource {
  static instances: MockEventSource[] = [];

  private readonly listeners = new Map<string, Listener[]>();

  constructor(readonly url: string) {
    MockEventSource.instances.push(this);
  }

  addEventListener(type: string, listener: Listener): void {
    const list = this.listeners.get(type) ?? [];
    list.push(listener);
    this.listeners.set(type, list);
  }

  dispatch(type: string, event: { data: string } = { data: '' }): void {
    (this.listeners.get(type) ?? []).forEach((listener) => listener(event));
  }

  close(): void {}
}

describe('AnalysisEventsSource', () => {
  let originalEventSource: typeof EventSource;

  beforeEach(() => {
    originalEventSource = globalThis.EventSource;
    MockEventSource.instances = [];
    (globalThis as unknown as { EventSource: unknown }).EventSource = MockEventSource;

    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    (globalThis as unknown as { EventSource: unknown }).EventSource = originalEventSource;
  });

  it('opens a single EventSource connection shared across multiple subscribers', () => {
    const service = TestBed.inject(AnalysisEventsSource);

    const sub1 = service.events().subscribe();
    const sub2 = service.events().subscribe();

    expect(MockEventSource.instances.length).toBe(1);
    expect(MockEventSource.instances[0].url).toBe(`${environment.apiBaseUrl}/events/analyses`);

    sub1.unsubscribe();
    sub2.unsubscribe();
  });

  it('emits parsed payloads to active subscribers', () => {
    const service = TestBed.inject(AnalysisEventsSource);
    const received: AnalysisEventPayload[] = [];
    const sub = service.events().subscribe((payload) => received.push(payload));

    const payload: AnalysisEventPayload = {
      network: 'news',
      nodeId: '11111111-1111-1111-1111-111111111111',
      label: 'Título',
      credibilityScore: 80,
      riskLevel: 'LOW_RISK',
      occurredAt: '2026-07-29T00:00:00Z',
    };
    MockEventSource.instances[0].dispatch('analysis-created', { data: JSON.stringify(payload) });

    expect(received).toEqual([payload]);
    sub.unsubscribe();
  });

  it('updates the connected signal on open and error', () => {
    const service = TestBed.inject(AnalysisEventsSource);
    const sub = service.events().subscribe();

    expect(service.connected()).toBe(false);

    MockEventSource.instances[0].dispatch('open');
    expect(service.connected()).toBe(true);

    MockEventSource.instances[0].dispatch('error');
    expect(service.connected()).toBe(false);

    sub.unsubscribe();
  });
});
