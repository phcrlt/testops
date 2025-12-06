export interface TestCase {
  id: string;
  title: string;
  type: 'ui' | 'api';
  priority: 'critical' | 'normal' | 'low';
  status: 'generated' | 'saved' | 'published';
  code: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    owner?: string;
    feature?: string;
    story?: string;
    tags?: string[];
  };
}

export interface CoverageAnalysis {
  total: number;
  covered: number;
  percentage: number;
  gaps: string[];
  recommendations: string[];
}

export interface DuplicateCase {
  id: string;
  title: string;
  duplicateWith: string;
  similarity: number;
}

export interface TestPlan {
  id: string;
  name: string;
  description: string;
  testCases: string[]; // IDs of test cases
  priority: Priority;
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export type Priority = 'low' | 'medium' | 'high';