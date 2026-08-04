import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsContentAnalysisResponse } from '../content-analysis.model';
import { ContentAnalysisResult } from './content-analysis-result';

registerLocaleData(localePt);

describe('ContentAnalysisResult', () => {
  let fixture: ComponentFixture<ContentAnalysisResult>;

  const result: NewsContentAnalysisResponse = {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Título de teste',
    sourceUrl: null,
    analyzedAt: '2026-07-28T00:00:00Z',
    score: {
      value: 77.5,
      riskLevel: 'LOW_RISK',
      factors: {
        sourceReputation: 90,
        textualConsistency: 80,
        crossVerification: 70,
        disseminationPattern: 50,
        disseminationIsBaseline: true,
      },
      reasons: [{ factor: 'OVERALL', description: 'Score final classifica como baixo risco.' }],
      aiExplanations: ['O conteúdo é consistente com fontes já verificadas.'],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentAnalysisResult],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentAnalysisResult);
    fixture.componentRef.setInput('result', result);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows the score value and risk badge', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('77,5');
    expect(text).toContain('Baixo risco');
  });

  it('shows the AI-generated explanation alongside the deterministic reasons', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('O conteúdo é consistente com fontes já verificadas.');
    expect(text).toContain('Score final classifica como baixo risco.');
  });
});
