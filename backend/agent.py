from langchain import LLMChain, PromptTemplate
from backend.validator import validate_allure_code
from langchain.llms.base import BaseLLM
from langchain.schema import LLMResult, Generation
from typing import List, Optional, Mapping, Any

# Stub LLM (замените на Cloud.ru)
class StubLLM(BaseLLM):
    def _generate(self, prompts: List[str], stop: Optional[List[str]] = None) -> LLMResult:
        sample_code = """
import allure

@allure.manual
@allure.label('priority', 'high')
@allure.feature('Feature')
@allure.story('Story')
def test_func():
    with allure.step('Arrange'):
        # Arrange
        pass
    with allure.step('Act'):
        # Act
        pass
    with allure.step('Assert'):
        allure.attach('data', 'name', allure.attachment_type.TEXT)
        assert True
"""
        generations = [[Generation(text=sample_code) for _ in prompts]]
        return LLMResult(generations=generations)

    @property
    def _identifying_params(self) -> Mapping[str, Any]:
        return {}

    @property
    def _llm_type(self) -> str:
        return "stub"

# Определение prompt и chain
prompt = PromptTemplate(input_variables=["req"], template="Generate Allure test for {req}")
chain = LLMChain(llm=StubLLM(), prompt=prompt)

def generate_test(req):
    """Generate test code using LLM."""
    if not req:
        raise ValueError("No requirements")
    return chain.run(req)

def generate_and_validate(req):
    code = generate_test(req)
    report = validate_allure_code(code)
    if not all(report.values()):
        print(f"Validation failed: {report}")
    return code, report