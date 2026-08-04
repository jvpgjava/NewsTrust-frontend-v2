import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AnalysisEventPayload } from '../../../core/realtime/analysis-event.model';
import { AnalysisEventsSource } from '../../../core/realtime/analysis-events-source';
import { TrustGraphPage } from './trust-graph-page';

registerLocaleData(localePt);

describe('TrustGraphPage', () => {
  let fixture: ComponentFixture<TrustGraphPage>;
  let httpTesting: HttpTestingController;
  let eventsSubject: Subject<AnalysisEventPayload>;

  beforeEach(async () => {
    eventsSubject = new Subject<AnalysisEventPayload>();
    const fakeEventsSource = {
      connected: signal(true),
      events: () => eventsSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [TrustGraphPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: AnalysisEventsSource, useValue: fakeEventsSource },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrustGraphPage);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  function flushSourcesGraph(): void {
    httpTesting.expectOne(`${environment.apiBaseUrl}/graph/sources`).flush({
      nodes: [{ id: 'a', label: 'A', credibilityScore: 90, riskLevel: 'LOW_RISK', metadata: {} }],
      edges: [],
    });
  }

  it('loads the sources network on init and shows metric cards', async () => {
    fixture.detectChanges();
    flushSourcesGraph();
    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Grafo de Fontes');
    expect(text).toContain('Nós');
  });

  it('switches to the news network and requests it on tab click', async () => {
    fixture.detectChanges();
    flushSourcesGraph();
    fixture.detectChanges();
    await fixture.whenStable();

    const tabs = Array.from(fixture.nativeElement.querySelectorAll('button[role="tab"]')) as HTMLButtonElement[];
    tabs[1].click();
    fixture.detectChanges();

    httpTesting.expectOne(`${environment.apiBaseUrl}/graph/news`).flush({ nodes: [], edges: [] });
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('refetches the current network when a matching SSE event arrives', async () => {
    fixture.detectChanges();
    flushSourcesGraph();
    fixture.detectChanges();
    await fixture.whenStable();

    eventsSubject.next({
      network: 'sources',
      nodeId: 'b',
      label: 'B',
      credibilityScore: 50,
      riskLevel: 'ATTENTION',
      occurredAt: '2026-07-29T00:00:00Z',
    });

    await new Promise((resolve) => setTimeout(resolve, 600));

    httpTesting.expectOne(`${environment.apiBaseUrl}/graph/sources`).flush({ nodes: [], edges: [] });
  }, 2000);

  it('ignores SSE events for a network that is not currently active', async () => {
    fixture.detectChanges();
    flushSourcesGraph();
    fixture.detectChanges();
    await fixture.whenStable();

    eventsSubject.next({
      network: 'news',
      nodeId: 'c',
      label: 'C',
      credibilityScore: 50,
      riskLevel: 'ATTENTION',
      occurredAt: '2026-07-29T00:00:00Z',
    });

    await new Promise((resolve) => setTimeout(resolve, 600));

    httpTesting.expectNone(`${environment.apiBaseUrl}/graph/news`);
  }, 2000);
});
