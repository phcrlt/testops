from langchain import LLMChain, PromptTemplate
from backend.validator import validate_allure_code
# Stub LLM (замените на Cloud.ru)
class StubLLM:
    def run(self, prompt):
        return "Generated code here"

prompt = PromptTemplate(input_variables=["req"], template="Generate Allure test for {req}")
chain = LLMChain(llm=StubLLM(), prompt=prompt)  # В реале: Cloud.ru client

def generate_test(req):
    """Generate test code using LLM."""
    if not req:
        raise ValueError("No requirements")
    return chain.run(req)

def generate_and_validate(req):
    code = generate_test(req)
    report = validate_allure_code(code)
    if not all(report.values()):
        print(f"Validation failed: {report}")  # В реале: raise or fix
    return code, report