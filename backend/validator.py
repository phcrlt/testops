import ast
import re

def validate_allure_code(code):
    """Validate code for Allure and AAA."""
    report = {'aaa': False, 'allure_decorators': False, 'steps': False, 'attachments': False}
    
    # Check AAA pattern (regex)
    if re.search(r'Arrange.*Act.*Assert', code, re.DOTALL | re.IGNORECASE):
        report['aaa'] = True
    
    # Parse AST for decorators and steps
    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                # Check decorators like @allure.title
                for deco in node.decorator_list:
                    if isinstance(deco, ast.Attribute) and 'allure' in str(deco.value):
                        report['allure_decorators'] = True
            if isinstance(node, ast.With):
                # Check allure.step in with items
                for item in node.items:
                    if 'allure.step' in str(item.context_expr):
                        report['steps'] = True
            if isinstance(node, ast.Call) and 'allure.attach' in str(node.func):
                report['attachments'] = True
    except SyntaxError:
        return {'error': 'Invalid syntax'}
    
    return report