import pytest
from backend.base import parse_requirements
from backend.agent import generate_test
from backend.validator import validate_allure_code

@pytest.mark.integration
def test_full_pipeline_valid(mocker):
    mocker.patch('backend.agent.chain.run', return_value="""@allure.title('Test')
def test_func():
    with allure.step('Arrange'): pass
    with allure.step('Act'): pass
    with allure.step('Assert'): allure.attach('file', 'name')""")
    req = parse_requirements("UI: Add service")
    code = generate_test(req['desc'])
    report = validate_allure_code(code)
    assert report['aaa'] and report['allure_decorators'] and report['steps'] and report['attachments']

@pytest.mark.integration
def test_full_pipeline_invalid():
    req = parse_requirements("Invalid")
    code = generate_test(req['desc'])
    report = validate_allure_code(code)
    assert not all(report.values())  # Expect fail  