import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ScoreFactor, ScoreFactors, ScoreReason } from '../../models/credibility.model';

interface FactorRow {
  label: string;
  value: number;
  note?: string;
}

const FACTOR_LABELS: Record<ScoreFactor, string> = {
  SOURCE_REPUTATION: 'Reputação da fonte (R)',
  TEXTUAL_CONSISTENCY: 'Consistência textual (T)',
  CROSS_VERIFICATION: 'Verificação cruzada (V)',
  DISSEMINATION_PATTERN: 'Padrão de disseminação (D)',
  OVERALL: 'Resultado geral',
};

/**
 * Decomposicao visual dos quatro subfatores do score (R/T/V/D) + a lista de
 * razoes auditaveis que o justificam. E o "porque" por tras do numero - nunca
 * mostrar so o score sem isso, essa e a exigencia central de explicabilidade do projeto.
 */
@Component({
  selector: 'app-credibility-breakdown',
  imports: [DecimalPipe],
  templateUrl: './credibility-breakdown.html',
  styleUrl: './credibility-breakdown.css',
})
export class CredibilityBreakdown {
  readonly factors = input.required<ScoreFactors>();
  readonly reasons = input<ScoreReason[]>([]);

  protected readonly rows = computed<FactorRow[]>(() => {
    const f = this.factors();
    return [
      { label: FACTOR_LABELS.SOURCE_REPUTATION, value: f.sourceReputation },
      { label: FACTOR_LABELS.TEXTUAL_CONSISTENCY, value: f.textualConsistency },
      { label: FACTOR_LABELS.CROSS_VERIFICATION, value: f.crossVerification },
      {
        label: FACTOR_LABELS.DISSEMINATION_PATTERN,
        value: f.disseminationPattern,
        note: f.disseminationIsBaseline ? 'sem dados disponíveis — baseline neutro aplicado' : undefined,
      },
    ];
  });

  protected factorLabel(factor: ScoreFactor): string {
    return FACTOR_LABELS[factor];
  }
}
