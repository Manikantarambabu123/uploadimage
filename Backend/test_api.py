"""
Test script for Django backend API endpoints
"""
import requests
import sys
import os

BASE_URL = 'http://localhost:8000'

def test_login(username, password):
    """Test login endpoint"""
    print(f"\n{'='*50}")
    print("Testing Login Endpoint")
    print('='*50)
    
    url = f"{BASE_URL}/api/auth/login/"
    data = {
        'username': username,
        'password': password
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✓ Login successful!")
            return response.json()['tokens']['access']
        else:
            print("✗ Login failed!")
            return None
    except Exception as e:
        print(f"✗ Error: {e}")
        return None

def test_image_upload(token, image_path):
    """Test image upload endpoint"""
    print(f"\n{'='*50}")
    print("Testing Image Upload Endpoint")
    print('='*50)
    
    if not token:
        print("✗ No authentication token available")
        return
    
    if not os.path.exists(image_path):
        print(f"✗ Image file not found: {image_path}")
        return
    
    url = f"{BASE_URL}/api/images/upload/"
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    files = {
        'image': open(image_path, 'rb')
    }
    data = {
        'description': 'Test image upload'
    }
    
    try:
        response = requests.post(url, headers=headers, files=files, data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            print("✓ Image uploaded successfully!")
        else:
            print("✗ Image upload failed!")
    except Exception as e:
        print(f"✗ Error: {e}")

def test_list_images(token):
    """Test list images endpoint"""
    print(f"\n{'='*50}")
    print("Testing List Images Endpoint")
    print('='*50)
    
    if not token:
        print("✗ No authentication token available")
        return
    
    url = f"{BASE_URL}/api/images/"
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✓ Successfully retrieved images!")
        else:
            print("✗ Failed to retrieve images!")
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == '__main__':
    print("\n" + "="*50)
    print("Django Backend API Test Script")
    print("="*50)
    print("\nMake sure the Django server is running on http://localhost:8000")
    
    # Test login
    username = input("\nEnter username (default: admin): ").strip() or 'admin'
    password = input("Enter password: ").strip()
    
    token = test_login(username, password)
    
    if token:
        # Test list images
        test_list_images(token)
        
        # Test image upload (optional)
        upload_test = input("\nDo you want to test image upload? (y/n): ").strip().lower()
        if upload_test == 'y':
            image_path = input("Enter path to test image (PNG or JPG): ").strip()
            test_image_upload(token, image_path)
            
            # List images again to see the uploaded image
            test_list_images(token)
    
    print("\n" + "="*50)
    print("Test Complete!")
    print("="*50 + "\n")
