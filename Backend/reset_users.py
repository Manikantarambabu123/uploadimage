import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wound_backend.settings')
django.setup()

from django.contrib.auth.models import User

def reset_users():
    print("Deleting all existing users...")
    user_count = User.objects.count()
    User.objects.all().delete()
    print(f"Deleted {user_count} users.")

    username = 'admin'
    email = 'admin@example.com'
    password = 'password123'
    
    print(f"Creating superuser '{username}'...")
    User.objects.create_superuser(username, email, password)
    print(f"Superuser created successfully!")
    print(f"Username: {username}")
    print(f"Password: {password}")

if __name__ == '__main__':
    reset_users()
