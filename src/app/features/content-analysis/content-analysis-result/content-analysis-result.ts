import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { RiskBadge } from '../../../shared/ui/risk-badge/risk-badge';
import { CredibilityBreakdown } from '../../../shared/ui/credibility-breakdown/credibility-breakdown';
import { Icon } from '../../../shared/ui/icon/icon';
import { NewsContentAnalysisResponse } from '../content-analysis.model';

@Component({
  selector: 'app-content-analysis-result',
  imports: [DecimalPipe, RiskBadge, CredibilityBreakdown, Icon],
  templateUrl: './content-analysis-result.html',
  styleUrl: './content-analysis-result.css',
})
export class ContentAnalysisResult {
  readonly result = input.required<NewsContentAnalysisResponse>();
}
