import pytest
from backend.base import parse_requirements, calculate_coverage

def test_parse_requirements_valid():
    assert parse_requirements("UI: Add service") == {'type': 'UI', 'desc': 'Add service'}

def test_parse_requirements_empty():
    with pytest.raises(ValueError):
        parse_requirements("")

def test_calculate_coverage_valid():
    assert calculate_coverage(80, 100) == 80.0

def test_calculate_coverage_zero():
    assert calculate_coverage(0, 0) == 0.0

def test_calculate_coverage_partial():
    assert calculate_coverage(50, 100) == 50.0