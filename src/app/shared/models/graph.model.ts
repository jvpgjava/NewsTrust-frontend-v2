import { CredibilityScore, RiskLevel } from './credibility.model';

export type GraphNetwork = 'sources' | 'news';

/** Espelha GraphNodeResponse do backend. */
export interface GraphNode {
  id: string;
  label: string;
  credibilityScore: number;
  riskLevel: RiskLevel;
  metadata: Record<string, unknown>;
}

/** Espelha GraphEdgeResponse - nomes "source"/"target" seguem a convencao do D3 (d3-force). */
export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

/** Espelha GraphResponse. */
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/** Espelha NewsGraphNodeDetailResponse. */
export interface NewsGraphNodeDetail {
  id: string;
  title: string;
  content: string;
  score: CredibilityScore;
  analyzedAt: string;
  connections: GraphEdge[];
}
