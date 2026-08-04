import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreFactors, ScoreReason } from '../../models/credibility.model';
import { CredibilityBreakdown } from './credibility-breakdown';

describe('CredibilityBreakdown', () => {
  let fixture: ComponentFixture<CredibilityBreakdown>;

  const factors: ScoreFactors = {
    sourceReputation: 80,
    textualConsistency: 60,
    crossVerification: 90,
    disseminationPattern: 50,
    disseminationIsBaseline: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredibilityBreakdown],
    }).compileComponents();

    fixture = TestBed.createComponent(CredibilityBreakdown);
    fixture.componentRef.setInput('factors', factors);
  });

  it('renders all four subfactors with their values', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Reputação da fonte (R)');
    expect(text).toContain('Consistência textual (T)');
    expect(text).toContain('Verificação cruzada (V)');
    expect(text).toContain('Padrão de disseminação (D)');
    expect(text).toContain('baseline neutro aplicado');
  });

  it('renders the auditable reasons when provided', async () => {
    const reasons: ScoreReason[] = [{ factor: 'OVERALL', description: 'Score final classifica como baixo risco.' }];
    fixture.componentRef.setInput('reasons', reasons);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Score final classifica como baixo risco.');
  });
});
