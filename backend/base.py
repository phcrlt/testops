def parse_requirements(req_text):
    """Parse requirements text into dict."""
    if not req_text:
        raise ValueError("Empty requirements")
    parts = req_text.split(':')
    return {'type': parts[0].strip(), 'desc': parts[1].strip() if len(parts) > 1 else ''}

def calculate_coverage(tested, total):
    """Calculate coverage percentage."""
    if total == 0:
        return 0.0
    return (tested / total) * 100