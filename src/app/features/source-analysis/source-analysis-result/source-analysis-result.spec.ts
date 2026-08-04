import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceAnalysisResponse } from '../source-analysis.model';
import { SourceAnalysisResult } from './source-analysis-result';

registerLocaleData(localePt);

describe('SourceAnalysisResult', () => {
  let fixture: ComponentFixture<SourceAnalysisResult>;

  const result: SourceAnalysisResponse = {
    id: '11111111-1111-1111-1111-111111111111',
    domain: 'example.com',
    url: 'https://example.com',
    reputationScore: 82,
    reputationCategory: 'confiável',
    reputationSignals: ['Domínio registrado há mais de 10 anos'],
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceAnalysisResult],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceAnalysisResult);
    fixture.componentRef.setInput('result', result);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows the domain, score and risk badge', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('example.com');
    expect(text).toContain('82');
    expect(text).toContain('Baixo risco');
  });

  it('shows the reputation signals', () => {
    expect(fixture.nativeElement.textContent).toContain('Domínio registrado há mais de 10 anos');
  });
});
