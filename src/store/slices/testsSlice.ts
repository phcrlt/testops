import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface TestCase {
  id: string;
  title: string;
  type: 'ui' | 'api';
  priority: 'critical' | 'normal' | 'low';
  status: 'generated' | 'saved' | 'published';
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface TestGenerationRequest {
  product: 'calculator' | 'evolution-compute';
  type: 'ui' | 'api';
  requirements: string;
  priority: 'critical' | 'normal' | 'low';
  owner?: string;
}

interface TestsState {
  testCases: TestCase[];
  generatedCode: string | null;
  isLoading: boolean;
  error: string | null;
  coverage: {
    total: number;
    covered: number;
    percentage: number;
  };
  duplicates: TestCase[];
}

const initialState: TestsState = {
  testCases: [],
  generatedCode: null,
  isLoading: false,
  error: null,
  coverage: {
    total: 100,
    covered: 65,
    percentage: 65,
  },
  duplicates: [],
};

// Async thunks
export const generateTests = createAsyncThunk(
  'tests/generate',
  async (request: TestGenerationRequest) => {
    // В реальном приложении здесь будет API-запрос к бэкенду
    const response = await new Promise<{ code: string; testCases: TestCase[] }>((resolve) => {
      setTimeout(() => {
        const mockCode = `import allure
import pytest

@allure.feature("${request.product}")
@allure.label("owner", "${request.owner || 'default'}")
class TestGeneratedCases:
    @allure.title("${request.type.toUpperCase()} тест для ${request.product}")
    @allure.tag("${request.priority.toUpperCase()}")
    def test_generated_case(self):
        with allure.step("Шаг 1"):
            assert True
        with allure.step("Шаг 2"):
            assert True`;

        const mockTestCases: TestCase[] = [
          {
            id: Date.now().toString(),
            title: `Тест кейс 1 для ${request.product}`,
            type: request.type,
            priority: request.priority,
            status: 'generated',
            code: mockCode,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: (Date.now() + 1).toString(),
            title: `Тест кейс 2 для ${request.product}`,
            type: request.type,
            priority: request.priority,
            status: 'generated',
            code: mockCode,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        resolve({ code: mockCode, testCases: mockTestCases });
      }, 2000);
    });

    return response;
  }
);

export const analyzeCoverage = createAsyncThunk(
  'tests/analyzeCoverage',
  async (product: string) => {
    console.log(`Analyzing coverage for product: ${product}`);
    // В реальном приложении здесь будет API-запрос
    const response = await new Promise<{ covered: number; total: number; duplicates: TestCase[] }>(
      (resolve) => {
        setTimeout(() => {
          resolve({
            covered: 65,
            total: 100,
            duplicates: [],
          });
        }, 1500);
      }
    );

    return response;
  }
);

const testsSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    setGeneratedCode: (state, action: PayloadAction<string>) => {
      state.generatedCode = action.payload;
    },
    clearGeneratedCode: (state) => {
      state.generatedCode = null;
    },
    saveTestCase: (state, action: PayloadAction<TestCase>) => {
      state.testCases.push(action.payload);
    },
    updateTestCase: (state, action: PayloadAction<TestCase>) => {
      const index = state.testCases.findIndex((tc) => tc.id === action.payload.id);
      if (index !== -1) {
        state.testCases[index] = action.payload;
      }
    },
    deleteTestCase: (state, action: PayloadAction<string>) => {
      state.testCases = state.testCases.filter((tc) => tc.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate tests
      .addCase(generateTests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateTests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generatedCode = action.payload.code;
        state.testCases = [...state.testCases, ...action.payload.testCases];
      })
      .addCase(generateTests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка генерации тестов';
      })
      // Analyze coverage
      .addCase(analyzeCoverage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(analyzeCoverage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coverage = {
          covered: action.payload.covered,
          total: action.payload.total,
          percentage: (action.payload.covered / action.payload.total) * 100,
        };
        state.duplicates = action.payload.duplicates;
      })
      .addCase(analyzeCoverage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка анализа покрытия';
      });
  },
});

export const {
  setGeneratedCode,
  clearGeneratedCode,
  saveTestCase,
  updateTestCase,
  deleteTestCase,
  clearError,
} = testsSlice.actions;

export const selectTestCases = (state: { tests: TestsState }) => state.tests.testCases;
export const selectGeneratedCode = (state: { tests: TestsState }) => state.tests.generatedCode;
export const selectTestsLoading = (state: { tests: TestsState }) => state.tests.isLoading;
export const selectTestsError = (state: { tests: TestsState }) => state.tests.error;
export const selectCoverage = (state: { tests: TestsState }) => state.tests.coverage;
export const selectDuplicates = (state: { tests: TestsState }) => state.tests.duplicates;

export default testsSlice.reducer;