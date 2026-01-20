import os
import django
import sys

# Add the current directory to sys.path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wound_backend.settings')
django.setup()

from django.db import connection

try:
    print("Testing database connection...")
    connection.ensure_connection()
    print("DB connection successful!")
except Exception as e:
    print(f"DB connection failed: {e}")
