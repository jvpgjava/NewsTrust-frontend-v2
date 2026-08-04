import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { errorInterceptor } from '../../../core/http/error-interceptor';
import { environment } from '../../../../environments/environment';
import { ContentAnalysisPage } from './content-analysis-page';

registerLocaleData(localePt);

describe('ContentAnalysisPage', () => {
  let fixture: ComponentFixture<ContentAnalysisPage>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentAnalysisPage],
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentAnalysisPage);
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => httpTesting.verify());

  it('does not submit and shows validation errors when the form is empty', async () => {
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    httpTesting.expectNone(`${environment.apiBaseUrl}/analysis/content`);
    expect(fixture.nativeElement.textContent).toContain('O título é obrigatório.');
  });

  it('submits the form and displays the returned score', async () => {
    fillForm(fixture, 'Título válido', 'Conteúdo com mais de vinte caracteres.');

    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();
    fixture.detectChanges();

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/analysis/content`);
    request.flush({
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Título válido',
      sourceUrl: null,
      analyzedAt: '2026-07-28T00:00:00Z',
      score: {
        value: 90,
        riskLevel: 'LOW_RISK',
        factors: {
          sourceReputation: 90,
          textualConsistency: 90,
          crossVerification: 90,
          disseminationPattern: 90,
          disseminationIsBaseline: false,
        },
        reasons: [],
        aiExplanations: [],
      },
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Baixo risco');
  });

  it('shows a friendly error banner when the API call fails', async () => {
    fillForm(fixture, 'Título válido', 'Conteúdo com mais de vinte caracteres.');

    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();
    fixture.detectChanges();

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/analysis/content`);
    request.flush(
      { title: 'Requisição inválida', detail: 'title não pode ser vazio' },
      { status: 400, statusText: 'Bad Request' },
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('title não pode ser vazio');
  });

  function fillForm(fx: ComponentFixture<ContentAnalysisPage>, title: string, content: string): void {
    const titleInput: HTMLInputElement = fx.nativeElement.querySelector('#title');
    const contentTextarea: HTMLTextAreaElement = fx.nativeElement.querySelector('#content');

    titleInput.value = title;
    titleInput.dispatchEvent(new Event('input'));
    contentTextarea.value = content;
    contentTextarea.dispatchEvent(new Event('input'));
    fx.detectChanges();
  }
});
