import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { CredibilityBreakdown } from '../../../shared/ui/credibility-breakdown/credibility-breakdown';
import { RiskBadge } from '../../../shared/ui/risk-badge/risk-badge';
import { Icon } from '../../../shared/ui/icon/icon';
import { SourceAnalysisResponse } from '../source-analysis.model';

@Component({
  selector: 'app-source-analysis-result',
  imports: [DecimalPipe, RiskBadge, CredibilityBreakdown, Icon],
  templateUrl: './source-analysis-result.html',
  styleUrl: './source-analysis-result.css',
})
export class SourceAnalysisResult {
  readonly result = input.required<SourceAnalysisResponse>();
}
