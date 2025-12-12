import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
import pytest
from backend.agent import generate_test

def test_generate_test_valid(mocker):
    mocker.patch('backend.agent.chain.run', return_value="valid_code")
    assert "valid_code" == generate_test("req")

def test_generate_test_empty():
    with pytest.raises(ValueError):
        generate_test("")