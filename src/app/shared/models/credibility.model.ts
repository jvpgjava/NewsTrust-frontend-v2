/**
 * Espelha exatamente os DTOs de com.newstrust.infrastructure.adapter.in.web.dto
 * no backend Java. Mantenha em sincronia se o contrato da API mudar.
 */

export type RiskLevel = 'LOW_RISK' | 'ATTENTION' | 'HIGH_RISK';

export type ScoreFactor =
  | 'SOURCE_REPUTATION'
  | 'TEXTUAL_CONSISTENCY'
  | 'CROSS_VERIFICATION'
  | 'DISSEMINATION_PATTERN'
  | 'OVERALL';

export interface ScoreReason {
  factor: ScoreFactor;
  description: string;
}

export interface ScoreFactors {
  sourceReputation: number;
  textualConsistency: number;
  crossVerification: number;
  disseminationPattern: number;
  disseminationIsBaseline: boolean;
}

export interface CredibilityScore {
  value: number;
  riskLevel: RiskLevel;
  factors: ScoreFactors;
  reasons: ScoreReason[];
  aiExplanations: string[];
}
