
import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wound_backend.settings')
django.setup()

def add_column():
    with connection.cursor() as cursor:
        try:
            print("Attempting to add 'image_url' column to 'images_assessment_images'...")
            cursor.execute("ALTER TABLE images_assessment_images ADD COLUMN image_url varchar(500);")
            print("Column added successfully.")
        except Exception as e:
            print(f"Error adding column: {e}")

if __name__ == '__main__':
    add_column()
