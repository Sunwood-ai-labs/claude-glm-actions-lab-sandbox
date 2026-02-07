"""Tests for hello_app package."""

import unittest
import subprocess
import sys


class TestHelloApp(unittest.TestCase):
    """Test cases for hello_app."""

    def test_hello_app_outputs_hello(self):
        """Test that python -m hello_app outputs 'Hello'."""
        result = subprocess.run(
            [sys.executable, "-m", "hello_app"],
            capture_output=True,
            text=True,
            check=True
        )
        self.assertEqual(result.stdout.strip(), "Hello")
        self.assertEqual(result.returncode, 0)

    def test_hello_app_no_stderr(self):
        """Test that hello_app produces no stderr output."""
        result = subprocess.run(
            [sys.executable, "-m", "hello_app"],
            capture_output=True,
            text=True,
            check=True
        )
        self.assertEqual(result.stderr, "")


if __name__ == "__main__":
    unittest.main()
