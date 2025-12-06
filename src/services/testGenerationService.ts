import { apiClient } from '@components/shared/ApiClient/api';
import type { GenerateTestsRequest, GenerateTestsResponse } from 'src/types/api.types';

export interface TestGenerationRequest {
  product: string;
  type: 'ui' | 'api';
  requirements: string;
  priority: 'critical' | 'normal' | 'low';
  owner?: string;
  feature?: string;
  story?: string;
  openapiSpec?: any;
  endpoint?: string;
}

export interface TestGenerationResult {
  code: string;
  testCases: Array<{
    id: string;
    title: string;
    description?: string;
    steps?: string[];
    expectedResult?: string;
    priority?: 'critical' | 'normal' | 'low';
  }>;
  warnings?: string[];
  generationTime?: number;
}

class TestGenerationService {
  model: string = 'foundation-v1';

  /**
   * Генерация тест-кейсов на основе требований
   */
  async generateTests(request: TestGenerationRequest): Promise<TestGenerationResult> {
    try {
      const response = await apiClient.post<GenerateTestsResponse>(
        '/api/tests/generate', // Используем прямой путь вместо API_ENDPOINTS
        this.prepareRequest(request)
      );

      return {
        code: response.data.code,
        testCases: response.data.testCases || [],
        warnings: response.data.warnings,
      };
    } catch (error) {
      console.error('Error generating tests:', error);
      throw this.handleGenerationError(error);
    }
  }

  /**
   * Генерация UI тестов
   */
  async generateUITests(request: Omit<TestGenerationRequest, 'type'>): Promise<TestGenerationResult> {
    const uiRequest: TestGenerationRequest = {
      ...request,
      type: 'ui',
    };

    return this.generateTests(uiRequest);
  }

  /**
   * Генерация API тестов
   */
  async generateAPITests(
    request: Omit<TestGenerationRequest, 'type'> & { openapiSpec?: any; endpoint?: string }
  ): Promise<TestGenerationResult> {
    const apiRequest: TestGenerationRequest = {
      ...request,
      type: 'api',
      openapiSpec: request.openapiSpec,
      endpoint: request.endpoint,
    };

    return this.generateTests(apiRequest);
  }

  /**
   * Пакетная генерация тестов
   */
  async batchGenerateTests(requests: TestGenerationRequest[]): Promise<TestGenerationResult[]> {
    try {
      const response = await apiClient.post<TestGenerationResult[]>(
        '/api/tests/batch-generate',
        { requests }
      );

      return response.data;
    } catch (error) {
      console.error('Error in batch generation:', error);
      throw error;
    }
  }

  /**
   * Генерация через Cloud.ru Evolution Model
   */
  async generateWithCloudRuModel(
    prompt: string,
    model: string = 'foundation-v1'
  ): Promise<string> {
    console.log(model);
    try {
      const mockResponse = await this.mockCloudRuGeneration(prompt);
      return mockResponse;
    } catch (error) {
      console.error('Error calling Cloud.ru model:', error);
      throw new Error('Failed to generate with AI model');
    }
  }

  /**
   * Валидация сгенерированных тестов
   */
  async validateGeneratedCode(code: string): Promise<{ valid: boolean; issues: any[] }> {
    try {
      const response = await apiClient.post('/api/tests/validate', { code });
      return response.data;
    } catch (error) {
      console.error('Error validating code:', error);
      return { valid: false, issues: [] };
    }
  }

  /**
   * Оптимизация существующих тестов
   */
  async optimizeTests(testCases: any[]): Promise<{ optimized: any[]; suggestions: string[] }> {
    try {
      const response = await apiClient.post('/api/tests/optimize', { testCases });
      return response.data;
    } catch (error) {
      console.error('Error optimizing tests:', error);
      return { optimized: testCases, suggestions: [] };
    }
  }

  /**
   * Получение примеров тестов для продукта
   */
  async getExamplesForProduct(product: string): Promise<string[]> {
    const examples: Record<string, string[]> = {
      calculator: [
        'Проверка кнопки "Добавить сервис"',
        'Тестирование расчета стоимости при изменении параметров',
        'Проверка каталога продуктов',
        'Тестирование мобильной адаптации',
      ],
      'evolution-compute': [
        'Создание виртуальной машины',
        'Получение списка ВМ',
        'Обновление конфигурации ВМ',
        'Удаление виртуальной машины',
        'Управление дисками',
      ],
    };

    return examples[product] || [];
  }

  /**
   * Подготовка запроса для API
   */
  private prepareRequest(request: TestGenerationRequest): GenerateTestsRequest {
    return {
      product: request.product,
      type: request.type,
      requirements: request.requirements,
      priority: request.priority,
      owner: request.owner || 'testops-copilot',
      feature: request.feature || request.product,
      story: request.story || 'auto-generated',
      ...(request.openapiSpec && { openapiSpec: request.openapiSpec }),
      ...(request.endpoint && { endpoint: request.endpoint }),
    };
  }

  /**
   * Обработка ошибок генерации
   */
  private handleGenerationError(error: any): Error {
    if (error.code === 'MODEL_UNAVAILABLE') {
      return new Error('AI модель временно недоступна. Пожалуйста, попробуйте позже.');
    }
    
    if (error.code === 'VALIDATION_ERROR') {
      return new Error('Некорректные требования. Пожалуйста, проверьте введенные данные.');
    }
    
    if (error.code === 'RATE_LIMIT') {
      return new Error('Превышен лимит запросов. Пожалуйста, подождите 1 минуту.');
    }
    
    return new Error('Ошибка при генерации тестов. Пожалуйста, попробуйте снова.');
  }

  /**
   * Моковая генерация через Cloud.ru API (для демонстрации)
   */
  private async mockCloudRuGeneration(prompt: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (prompt.includes('UI') || prompt.includes('интерфейс')) {
      return this.generateMockUITest();
    } else if (prompt.includes('API') || prompt.includes('эндпойнт')) {
      return this.generateMockAPITest();
    } else {
      return this.generateMockGenericTest();
    }
  }

  private generateMockUITest(): string {
    return `// Mock UI test code`;
  }

  private generateMockAPITest(): string {
    return `// Mock API test code`;
  }

  private generateMockGenericTest(): string {
    return `// Mock generic test code`;
  }
}

export const testGenerationService = new TestGenerationService();