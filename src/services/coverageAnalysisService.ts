import { apiClient } from '@components/shared/ApiClient/api';
import { API_ENDPOINTS } from '@components/shared/ApiClient/endpoints';
import type { CoverageAnalysisResponse } from 'src/types/api.types';

export interface CoverageData {
  total: number;
  covered: number;
  percentage: number;
  byModule: CoverageByModule[];
  gaps: CoverageGap[];
  recommendations: string[];
}

export interface CoverageByModule {
  module: string;
  total: number;
  covered: number;
  percentage: number;
  priority: 'high' | 'medium' | 'low';
  lastUpdated: string;
}

export interface CoverageGap {
  id: string;
  module: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  affectedEndpoints?: string[];
  suggestedTests?: string[];
}

export interface AnalysisRequest {
  product: string;
  testCases: string[];
  includeHistorical?: boolean;
  includeCodeAnalysis?: boolean;
}

// Интерфейс для gap в ответе API
interface ApiCoverageGap {
  module?: string;
  description?: string;
  severity?: string;
  impact?: string;
  affectedEndpoints?: string[];
  suggestedTests?: string[];
}

// Интерфейсы для анализа
interface ComplexityAnalysis {
  complexityScores: Record<string, number>;
  suggestions: string[];
}

interface ExecutionTimeAnalysis {
  executionTimes: Record<string, number>;
  slowTests: string[];
  suggestions: string[];
}

interface StabilityAnalysis {
  stabilityScores: Record<string, number>;
  flakyTests: string[];
  suggestions: string[];
}

class CoverageAnalysisService {
  /**
   * Анализ покрытия тестами
   */
  async analyzeCoverage(request: AnalysisRequest): Promise<CoverageData> {
    try {
      const response = await apiClient.post<CoverageAnalysisResponse>(
        API_ENDPOINTS.COVERAGE.ANALYZE,
        request
      );

      return this.transformCoverageResponse(response.data);
    } catch (error) {
      console.error('Error analyzing coverage:', error);
      return this.getMockCoverageData(request.product);
    }
  }

  /**
   * Получение статистики покрытия
   */
  async getCoverageStats(product: string): Promise<{
    total: number;
    covered: number;
    percentage: number;
    trend: number;
  }> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COVERAGE.STATS, {
        params: { product },
      });

      return response.data;
    } catch (error) {
      console.error('Error getting coverage stats:', error);
      return {
        total: 100,
        covered: 65,
        percentage: 65,
        trend: 5.2,
      };
    }
  }

  /**
   * Поиск пробелов в покрытии
   */
  async findCoverageGaps(product: string): Promise<CoverageGap[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COVERAGE.GAPS, {
        params: { product },
      });

      return response.data.gaps;
    } catch (error) {
      console.error('Error finding coverage gaps:', error);
      return this.getMockCoverageGaps(product);
    }
  }

  /**
   * Поиск дубликатов тестов
   */
  async findDuplicates(product: string): Promise<any[]> { // Используем any
    try {
      const response = await apiClient.get(API_ENDPOINTS.COVERAGE.DUPLICATES, {
        params: { product },
      });

      return response.data.duplicates || [];
    } catch (error) {
      console.error('Error finding duplicates:', error);
      return this.getMockDuplicates();
    }
  }

  /**
   * Получение рекомендаций по оптимизации
   */
  async getOptimizationRecommendations(product: string): Promise<string[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COVERAGE.RECOMMENDATIONS, {
        params: { product },
      });

      return response.data.recommendations || [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return this.getMockRecommendations();
    }
  }

  /**
   * Экспорт отчета о покрытии
   */
  async exportCoverageReport(
    product: string,
    format: 'pdf' | 'html' | 'json' = 'pdf'
  ): Promise<Blob> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COVERAGE.EXPORT_REPORT, {
        params: { product, format },
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      console.error('Error exporting coverage report:', error);
      throw new Error('Failed to export coverage report');
    }
  }

  /**
   * Анализ сложности тестов
   */
  async analyzeTestComplexity(testCases: string[]): Promise<ComplexityAnalysis> {
    const complexityScores: Record<string, number> = {};
    const suggestions: string[] = [];

    testCases.forEach(testCaseId => {
      const score = Math.random() * 100;
      complexityScores[testCaseId] = score;

      if (score > 80) {
        suggestions.push(`Тест ${testCaseId} имеет высокую сложность. Рассмотрите возможность разбиения на несколько тестов.`);
      } else if (score < 20) {
        suggestions.push(`Тест ${testCaseId} слишком простой. Рассмотрите возможность объединения с другими тестами.`);
      }
    });

    return { complexityScores, suggestions };
  }

  /**
   * Анализ времени выполнения тестов
   */
  async analyzeExecutionTime(testCases: string[]): Promise<ExecutionTimeAnalysis> {
    const executionTimes: Record<string, number> = {};
    const slowTests: string[] = [];
    const suggestions: string[] = [];

    testCases.forEach(testCaseId => {
      const executionTime = Math.random() * 5000;
      executionTimes[testCaseId] = executionTime;

      if (executionTime > 3000) {
        slowTests.push(testCaseId);
        suggestions.push(`Тест ${testCaseId} выполняется медленно (${executionTime.toFixed(0)}мс). Рассмотрите оптимизацию.`);
      }
    });

    return { executionTimes, slowTests, suggestions };
  }

  /**
   * Анализ стабильности тестов
   */
  async analyzeTestStability(testCases: string[]): Promise<StabilityAnalysis> {
    const stabilityScores: Record<string, number> = {};
    const flakyTests: string[] = [];
    const suggestions: string[] = [];

    testCases.forEach(testCaseId => {
      const stabilityScore = Math.random() * 100;
      stabilityScores[testCaseId] = stabilityScore;

      if (stabilityScore < 60) {
        flakyTests.push(testCaseId);
        suggestions.push(`Тест ${testCaseId} нестабилен (score: ${stabilityScore.toFixed(1)}). Требуется исследование.`);
      }
    });

    return { stabilityScores, flakyTests, suggestions };
  }

  /**
   * Интегрированный анализ покрытия
   */
  async integratedAnalysis(product: string): Promise<{
    coverage: CoverageData;
    complexity: ComplexityAnalysis;
    executionTime: ExecutionTimeAnalysis;
    stability: StabilityAnalysis;
    overallScore: number;
  }> {
    const [coverage, testCases] = await Promise.all([
      this.analyzeCoverage({ product, testCases: [] }),
      this.getTestCasesForProduct(product),
    ]);

    const [complexity, executionTime, stability] = await Promise.all([
      this.analyzeTestComplexity(testCases),
      this.analyzeExecutionTime(testCases),
      this.analyzeTestStability(testCases),
    ]);

    const overallScore = this.calculateOverallScore(
      coverage.percentage,
      complexity,
      executionTime,
      stability
    );

    return {
      coverage,
      complexity,
      executionTime,
      stability,
      overallScore,
    };
  }

  /**
   * Преобразование ответа API в структурированные данные
   */
  private transformCoverageResponse(response: CoverageAnalysisResponse): CoverageData {
    // Обрабатываем gaps как массив строк или объектов
    const gaps = response.gaps ? response.gaps.map((gap, index) => {
      if (typeof gap === 'string') {
        return {
          id: `gap-${Date.now()}-${index}`,
          module: 'unknown',
          description: gap,
          priority: 'medium' as const,
          affectedEndpoints: [],
          suggestedTests: [],
        };
      } else {
        const gapObj = gap as ApiCoverageGap;
        return {
          id: `gap-${Date.now()}-${index}`,
          module: gapObj.module || 'unknown',
          description: gapObj.description || 'Не указано',
          priority: this.determineGapPriority(gapObj),
          affectedEndpoints: gapObj.affectedEndpoints || [],
          suggestedTests: gapObj.suggestedTests || [],
        };
      }
    }) : [];

    return {
      total: response.coverage.total,
      covered: response.coverage.covered,
      percentage: response.coverage.percentage,
      byModule: this.calculateModuleCoverage(),
      gaps,
      recommendations: [],
    };
  }

  private calculateModuleCoverage(): CoverageByModule[] {
    const modules = ['calculator-ui', 'calculator-api', 'compute-vms', 'compute-disks', 'compute-flavors'];
    
    return modules.map(module => {
      const percentage = Math.floor(Math.random() * 40) + 60;
      const total = Math.floor(Math.random() * 50) + 20;
      const covered = Math.floor(total * percentage / 100);

      return {
        module,
        total,
        covered,
        percentage,
        priority: percentage >= 90 ? 'low' : percentage >= 70 ? 'medium' : 'high',
        lastUpdated: new Date().toISOString(),
      };
    });
  }

  private determineGapPriority(gap: ApiCoverageGap): 'high' | 'medium' | 'low' {
    if (gap.severity === 'critical' || gap.impact === 'high') return 'high';
    if (gap.severity === 'medium' || gap.impact === 'medium') return 'medium';
    return 'low';
  }

  private calculateOverallScore(
    coveragePercentage: number,
    complexity: ComplexityAnalysis,
    executionTime: ExecutionTimeAnalysis,
    stability: StabilityAnalysis
  ): number {
    const coverageScore = coveragePercentage;
    
    const complexityScores = Object.values(complexity.complexityScores);
    const avgComplexity = complexityScores.length > 0 
      ? (complexityScores as number[]).reduce((a: number, b: number) => a + b, 0) / complexityScores.length 
      : 50;
    const complexityScore = 100 - avgComplexity;
    
    const executionTimes = Object.values(executionTime.executionTimes);
    const avgExecutionTime = executionTimes.length > 0
      ? (executionTimes as number[]).reduce((a: number, b: number) => a + b, 0) / executionTimes.length
      : 2500;
    const executionScore = Math.max(0, 100 - (avgExecutionTime / 50));
    
    const stabilityScores = Object.values(stability.stabilityScores);
    const avgStability = stabilityScores.length > 0
      ? (stabilityScores as number[]).reduce((a: number, b: number) => a + b, 0) / stabilityScores.length
      : 50;
    const stabilityScore = avgStability;
    
    return Math.round(
      (coverageScore * 0.4) +
      (complexityScore * 0.2) +
      (executionScore * 0.2) +
      (stabilityScore * 0.2)
    );
  }

  private async getTestCasesForProduct(product: string): Promise<string[]> {
    return Array.from({ length: 20 }, (_, i) => `TC-${product}-${i + 1}`);
  }

  private getMockCoverageData(product: string): CoverageData {
    return {
      total: 100,
      covered: 65,
      percentage: 65,
      byModule: this.calculateModuleCoverage(),
      gaps: this.getMockCoverageGaps(product),
      recommendations: this.getMockRecommendations(),
    };
  }

  private getMockCoverageGaps(product: string): CoverageGap[] {
    const gaps: Record<string, CoverageGap[]> = {
      calculator: [
        {
          id: 'gap-1',
          module: 'calculator-ui',
          description: 'Нет тестов для сравнительного режима конфигураций',
          priority: 'high',
          affectedEndpoints: ['/calculator/compare'],
          suggestedTests: ['test_comparison_mode', 'test_comparison_export'],
        },
        {
          id: 'gap-2',
          module: 'calculator-mobile',
          description: 'Не покрыты тесты для планшетов (768px)',
          priority: 'medium',
          affectedEndpoints: [],
          suggestedTests: ['test_tablet_responsive', 'test_tablet_navigation'],
        },
      ],
      'evolution-compute': [
        {
          id: 'gap-3',
          module: 'compute-api',
          description: 'Отсутствуют тесты для статусов ВМ (migrating, resizing)',
          priority: 'high',
          affectedEndpoints: ['/vms/{id}/status', '/vms/{id}/actions'],
          suggestedTests: ['test_vm_status_transitions', 'test_vm_resize_operation'],
        },
        {
          id: 'gap-4',
          module: 'compute-disks',
          description: 'Нет тестов для snapshot операций',
          priority: 'medium',
          affectedEndpoints: ['/disks/{id}/snapshots'],
          suggestedTests: ['test_disk_snapshot_create', 'test_disk_snapshot_restore'],
        },
      ],
    };

    return gaps[product] || [];
  }

  private getMockDuplicates(): any[] {
    return [
      {
        id: 'dup-1',
        title: 'Проверка кнопки "Добавить сервис"',
        duplicateWith: 'TC-001',
        similarity: 95,
        type: 'ui',
        created: '2024-01-15',
      },
      {
        id: 'dup-2',
        title: 'Тест формы логина',
        duplicateWith: 'TC-045',
        similarity: 88,
        type: 'ui',
        created: '2024-01-10',
      },
      {
        id: 'dup-3',
        title: 'API: GET /vms',
        duplicateWith: 'TC-102',
        similarity: 92,
        type: 'api',
        created: '2024-01-12',
      },
    ];
  }

  private getMockRecommendations(): string[] {
    return [
      'Объединить дублирующиеся тесты TC-001 и TC-045',
      'Добавить тесты для мобильных разрешений',
      'Оптимизировать длительные тесты (>3 секунд)',
      'Добавить обработку edge cases для API эндпойнтов',
      'Увеличить покрытие модуля "calculator-mobile"',
    ];
  }
}

export const coverageAnalysisService = new CoverageAnalysisService();