import { RiskLevel } from '../../shared/models/credibility.model';
import { GraphNetwork } from '../../shared/models/graph.model';

/** Espelha AnalysisEventPayload do backend (evento SSE "analysis-created"). */
export interface AnalysisEventPayload {
  network: GraphNetwork;
  nodeId: string;
  label: string;
  credibilityScore: number;
  riskLevel: RiskLevel;
  occurredAt: string;
}
