import { CredibilityScore } from '../../shared/models/credibility.model';

/** Espelha NewsContentAnalysisRequest. */
export interface NewsContentAnalysisRequest {
  title: string;
  content: string;
  sourceUrl?: string | null;
}

/** Espelha NewsContentAnalysisResponse. */
export interface NewsContentAnalysisResponse {
  id: string;
  title: string;
  sourceUrl: string | null;
  score: CredibilityScore;
  analyzedAt: string;
}
