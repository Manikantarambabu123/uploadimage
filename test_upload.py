import requests
import json

# Test the upload endpoint
BASE_URL = "http://127.0.0.1:8000"

print("=" * 60)
print("Testing Wound Backend API")
print("=" * 60)

# First, let's try to login
print("\n1. Testing Login...")
login_url = f"{BASE_URL}/api/auth/login/"

# Try different credentials
credentials_list = [
    {"username": "admin", "password": "admin123"},
    {"username": "admin", "password": "admin"},
]

token = None
for login_data in credentials_list:
    print(f"   Trying: {login_data['username']}")
    try:
        response = requests.post(login_url, json=login_data)
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            token = data.get('access')
            print(f"   [OK] Login successful!")
            print(f"   Access Token: {token[:50]}...")
            break
        else:
            print(f"   [FAIL] Response: {response.text}")
    except Exception as e:
        print(f"   [ERROR] {e}")

if token:
    # Now test image upload
    print("\n2. Testing Image Upload...")
    upload_url = f"{BASE_URL}/api/images/upload/"
    
    # Create a simple test image file
    import io
    from PIL import Image
    
    # Create a small test image
    img = Image.new('RGB', (100, 100), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    files = {
        'image': ('test.png', img_bytes, 'image/png')
    }
    data = {
        'description': 'Test upload'
    }
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    try:
        upload_response = requests.post(upload_url, files=files, data=data, headers=headers)
        print(f"   Status Code: {upload_response.status_code}")
        print(f"   Response: {upload_response.text}")
        
        if upload_response.status_code == 201:
            print("   [OK] Image upload successful!")
        else:
            print("   [FAIL] Image upload failed!")
    except Exception as e:
        print(f"   [ERROR] {e}")
else:
    print("\n[FAIL] Could not login, skipping upload test")

print("\n" + "=" * 60)
