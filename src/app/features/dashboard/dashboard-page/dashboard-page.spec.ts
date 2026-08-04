import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import { DashboardPage } from './dashboard-page';

registerLocaleData(localePt);

describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: LOCALE_ID, useValue: 'pt-BR' }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('derives the stat cards from the sources and news graphs', async () => {
    fixture.detectChanges();

    httpTesting.expectOne(`${environment.apiBaseUrl}/graph/sources`).flush({
      nodes: [{ id: 'a', label: 'A', credibilityScore: 90, riskLevel: 'LOW_RISK', metadata: {} }],
      edges: [],
    });
    httpTesting.expectOne(`${environment.apiBaseUrl}/graph/news`).flush({
      nodes: [
        { id: 'n1', label: 'Notícia 1', credibilityScore: 20, riskLevel: 'HIGH_RISK', metadata: {} },
        { id: 'n2', label: 'Notícia 2', credibilityScore: 90, riskLevel: 'LOW_RISK', metadata: {} },
      ],
      edges: [],
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Fontes Analisadas');
    expect(text).toContain('Notícias de Alto Risco');
    expect(text).toContain('Notícia 1');
    expect(text).toContain('Notícia 2');
  });

  it('shows an empty state when there are no news nodes yet', async () => {
    fixture.detectChanges();

    httpTesting.expectOne(`${environment.apiBaseUrl}/graph/sources`).flush({ nodes: [], edges: [] });
    httpTesting.expectOne(`${environment.apiBaseUrl}/graph/news`).flush({ nodes: [], edges: [] });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Nenhuma notícia analisada ainda');
  });
});
