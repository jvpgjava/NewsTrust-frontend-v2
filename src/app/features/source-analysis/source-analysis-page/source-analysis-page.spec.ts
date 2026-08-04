import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { errorInterceptor } from '../../../core/http/error-interceptor';
import { environment } from '../../../../environments/environment';
import { SourceAnalysisPage } from './source-analysis-page';

registerLocaleData(localePt);

describe('SourceAnalysisPage', () => {
  let fixture: ComponentFixture<SourceAnalysisPage>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceAnalysisPage],
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceAnalysisPage);
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => httpTesting.verify());

  it('does not submit and shows a validation error for an invalid URL', async () => {
    fillUrl(fixture, 'not-a-url');

    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    httpTesting.expectNone(`${environment.apiBaseUrl}/analysis/source`);
    expect(fixture.nativeElement.textContent).toContain('Informe uma URL válida');
  });

  it('submits a valid URL and displays the returned score', async () => {
    fillUrl(fixture, 'https://example.com');

    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();
    fixture.detectChanges();

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/analysis/source`);
    request.flush({
      id: '11111111-1111-1111-1111-111111111111',
      domain: 'example.com',
      url: 'https://example.com',
      reputationScore: 90,
      reputationCategory: 'confiável',
      reputationSignals: [],
      analyzedAt: '2026-07-29T00:00:00Z',
      score: {
        value: 90,
        riskLevel: 'LOW_RISK',
        factors: {
          sourceReputation: 90,
          textualConsistency: 0,
          crossVerification: 0,
          disseminationPattern: 0,
          disseminationIsBaseline: true,
        },
        reasons: [],
        aiExplanations: [],
      },
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Baixo risco');
  });

  function fillUrl(fx: ComponentFixture<SourceAnalysisPage>, url: string): void {
    const input: HTMLInputElement = fx.nativeElement.querySelector('#url');
    input.value = url;
    input.dispatchEvent(new Event('input'));
    fx.detectChanges();
  }
});
