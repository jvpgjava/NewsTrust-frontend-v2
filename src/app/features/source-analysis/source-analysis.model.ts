import { CredibilityScore } from '../../shared/models/credibility.model';

/** Espelha SourceAnalysisRequest. */
export interface SourceAnalysisRequest {
  url: string;
}

/** Espelha SourceAnalysisResponse. */
export interface SourceAnalysisResponse {
  id: string;
  domain: string;
  url: string;
  reputationScore: number;
  reputationCategory: string;
  reputationSignals: string[];
  score: CredibilityScore;
  analyzedAt: string;
}
