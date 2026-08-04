import { Component, computed, input } from '@angular/core';
import { RiskLevel } from '../../models/credibility.model';

interface RiskStyle {
  label: string;
  bgVar: string;
  fgVar: string;
  dotVar: string;
}

const RISK_STYLES: Record<RiskLevel, RiskStyle> = {
  LOW_RISK: {
    label: 'Baixo risco',
    bgVar: 'var(--color-risk-low-bg)',
    fgVar: 'var(--color-risk-low-fg)',
    dotVar: 'var(--color-risk-low)',
  },
  ATTENTION: {
    label: 'Atenção',
    bgVar: 'var(--color-risk-attention-bg)',
    fgVar: 'var(--color-risk-attention-fg)',
    dotVar: 'var(--color-risk-attention)',
  },
  HIGH_RISK: {
    label: 'Alto risco',
    bgVar: 'var(--color-risk-high-bg)',
    fgVar: 'var(--color-risk-high-fg)',
    dotVar: 'var(--color-risk-high)',
  },
};

/**
 * Badge colorido da faixa de risco. A cor nunca e o unico sinal - o label
 * textual sempre acompanha, para acessibilidade (daltonismo).
 */
@Component({
  selector: 'app-risk-badge',
  imports: [],
  templateUrl: './risk-badge.html',
  styleUrl: './risk-badge.css',
})
export class RiskBadge {
  readonly riskLevel = input.required<RiskLevel>();

  protected readonly style = computed<RiskStyle>(() => RISK_STYLES[this.riskLevel()]);
}
