# Wound Assessment Backend API

Django REST API backend for wound assessment application with JWT authentication and image upload functionality.

## Features

- **JWT Authentication**: Secure login with JSON Web Tokens
- **Image Upload**: Upload wound images with validation
  - Supported formats: PNG, JPG/JPEG only
  - Maximum file size: 10MB
- **User Management**: Django admin interface for user management
- **CORS Enabled**: Frontend integration ready

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Create a superuser:
```bash
python manage.py createsuperuser
```

4. Start the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

#### Login
- **URL**: `/api/auth/login/`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```
- **Success Response** (200):
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "your_username",
    "email": "user@example.com",
    "first_name": "",
    "last_name": ""
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```
- **Error Response** (401):
```json
{
  "message": "Login failed",
  "errors": {
    "non_field_errors": ["Unable to log in with provided credentials."]
  }
}
```

#### Get User Info
- **URL**: `/api/auth/me/`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response** (200):
```json
{
  "id": 1,
  "username": "your_username",
  "email": "user@example.com",
  "first_name": "",
  "last_name": ""
}
```

### Image Upload

#### Upload Image
- **URL**: `/api/images/upload/`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `image`: Image file (PNG or JPG, max 10MB)
  - `description`: Optional text description
- **Success Response** (201):
```json
{
  "message": "Image uploaded successfully",
  "data": {
    "id": 1,
    "image": "/media/wounds/2026/01/08/image.png",
    "image_url": "http://localhost:8000/media/wounds/2026/01/08/image.png",
    "uploaded_at": "2026-01-08T10:00:00Z",
    "description": "Optional description",
    "uploaded_by": 1
  }
}
```
- **Error Response** (400):
```json
{
  "message": "Image upload failed",
  "errors": {
    "image": ["Unsupported file format. Only PNG and JPG files are allowed. You uploaded: .pdf"]
  }
}
```

#### List Images
- **URL**: `/api/images/`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response** (200):
```json
{
  "count": 2,
  "images": [
    {
      "id": 2,
      "image": "/media/wounds/2026/01/08/image2.png",
      "image_url": "http://localhost:8000/media/wounds/2026/01/08/image2.png",
      "uploaded_at": "2026-01-08T11:00:00Z",
      "description": "",
      "uploaded_by": 1
    },
    {
      "id": 1,
      "image": "/media/wounds/2026/01/08/image1.jpg",
      "image_url": "http://localhost:8000/media/wounds/2026/01/08/image1.jpg",
      "uploaded_at": "2026-01-08T10:00:00Z",
      "description": "First upload",
      "uploaded_by": 1
    }
  ]
}
```

#### Delete Image
- **URL**: `/api/images/<image_id>/`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)
- **Success Response** (200):
```json
{
  "message": "Image deleted successfully"
}
```
- **Error Response** (404):
```json
{
  "message": "Image not found or you do not have permission to delete it"
}
```

## Using Authentication Headers

For all authenticated endpoints, include the JWT access token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### Example with curl:

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'

# Upload Image
curl -X POST http://localhost:8000/api/images/upload/ \
  -H "Authorization: Bearer <your_access_token>" \
  -F "image=@/path/to/image.png" \
  -F "description=Wound assessment photo"

# List Images
curl -X GET http://localhost:8000/api/images/ \
  -H "Authorization: Bearer <your_access_token>"
```

### Example with JavaScript (Fetch API):

```javascript
// Login
const loginResponse = await fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'password123'
  })
});

const loginData = await loginResponse.json();
const accessToken = loginData.tokens.access;

// Upload Image
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('description', 'Wound assessment photo');

const uploadResponse = await fetch('http://localhost:8000/api/images/upload/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});

const uploadData = await uploadResponse.json();
```

## Image Validation

The backend automatically validates uploaded images:

1. **File Format**: Only PNG and JPG/JPEG files are accepted
   - Error message: "Unsupported file format. Only PNG and JPG files are allowed."

2. **File Size**: Maximum 10MB per image
   - Error message: "File size exceeds 10MB limit. Your file is X.XX MB"

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

To add more origins, edit `CORS_ALLOWED_ORIGINS` in `wound_backend/settings.py`.

## Admin Interface

Access the Django admin at `http://localhost:8000/admin/` to:
- Create and manage users
- View uploaded images
- Manage application data

## Project Structure

```
Backend/
├── wound_backend/          # Main project configuration
│   ├── settings.py        # Django settings with JWT, CORS, media config
│   ├── urls.py            # Main URL routing
│   └── wsgi.py
├── authentication/         # Authentication app
│   ├── serializers.py     # Login and user serializers
│   ├── views.py           # Login, logout, user info views
│   └── urls.py            # Auth API endpoints
├── images/                # Image upload app
│   ├── models.py          # UploadedImage model
│   ├── serializers.py     # Image serializers
│   ├── validators.py      # File format and size validators
│   ├── views.py           # Image upload, list, delete views
│   ├── admin.py           # Admin interface configuration
│   └── urls.py            # Image API endpoints
├── media/                 # Uploaded files storage (created automatically)
├── db.sqlite3            # SQLite database (created after migrations)
├── manage.py
└── requirements.txt       # Python dependencies
```

## Security Notes

- The `SECRET_KEY` in settings.py should be changed in production
- Set `DEBUG = False` in production
- Update `ALLOWED_HOSTS` for production deployment
- Consider using a production database (PostgreSQL, MySQL) instead of SQLite
- Implement token blacklisting for logout functionality if needed
