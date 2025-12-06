// Убедимся, что типы объявлены в начале файла перед использованием
export interface TestCase {
  id: string;
  title: string;
  description?: string;
  steps?: string[];
  expectedResult?: string;
  priority: 'critical' | 'normal' | 'low';
  code?: string;
  type?: 'ui' | 'api' | string;
  status?: 'generated' | 'saved' | 'published' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DuplicateCase {
  id: string;
  title: string;
  duplicateWith?: string;
  similarity: number;
  module?: string;
  type?: string;
  created?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Request types
export interface GenerateTestsRequest {
  product: string;
  type: 'ui' | 'api';
  requirements: string;
  priority: 'critical' | 'normal' | 'low';
  owner?: string;
  feature?: string;
  story?: string;
}

export interface AnalyzeCoverageRequest {
  product: string;
  testCases: string[];
}

export interface ValidateStandardsRequest {
  code: string;
  rules: string[];
}

// Response types
export interface GenerateTestsResponse {
  code: string;
  testCases: TestCase[];
  warnings?: string[];
}

export interface CoverageAnalysisResponse {
  coverage: {
    total: number;
    covered: number;
    percentage: number;
  };
  duplicates: DuplicateCase[];
  gaps: string[];
}

export interface StandardsValidationResponse {
  valid: boolean;
  issues: ValidationIssue[];
  suggestions: string[];
}

export interface ValidationIssue {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  rule: string;
}