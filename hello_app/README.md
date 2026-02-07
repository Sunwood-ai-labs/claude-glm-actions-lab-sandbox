<div align="center">

# hello_app

<!-- Language switch badges -->
<a href="README.md"><img src="https://img.shields.io/badge/Documentation-English-white.svg" alt="EN doc"/></a>
<a href="README_JA.md"><img src="https://img.shields.io/badge/ドキュメント-日本語-white.svg" alt="JA doc"/></a>

</div>

## Overview

`hello_app` is a simple Python package that prints a greeting "Hello" to standard output when executed. This package was created as a simple example demonstrating how to run a Python package as a module.

## Features

- Executable via `python -m hello_app`
- Prints "Hello" message to standard output
- Simple and easy-to-understand code structure
- Includes test suite using unittest

## Installation

This package uses only Python's standard library and has no additional dependencies.

It works with Python 3.6 and above.

```bash
# Clone the repository
git clone <repository-url>
cd claude-glm-actions-lab-sandbox
```

## Usage

### Basic Execution

Run the package as a module using Python's `-m` option:

```bash
python -m hello_app
```

Output:
```
Hello
```

### Using from Python Code

```python
from hello_app import main

# Call the main function
main()
```

## Testing

The package includes a test suite using unittest.

### Run All Tests

```bash
# Run from project root
python -m unittest discover tests
```

### Run Specific Test File

```bash
python -m unittest tests.test_hello_app
```

### Test Details

`tests/test_hello_app.py` includes the following test cases:

- `test_hello_app_outputs_hello` - Verifies that "Hello" is output
- `test_hello_app_no_stderr` - Verifies that nothing is output to stderr

## File Structure

```
hello_app/
├── __init__.py      # Package initialization, version info (v0.1.0)
└── __main__.py      # Main module

tests/
├── __init__.py      # Test package initialization
└── test_hello_app.py  # unittest tests
```

## License

MIT License

Copyright (c) 2025 Sunwood AI Labs

## Version

Current version: **0.1.0**
