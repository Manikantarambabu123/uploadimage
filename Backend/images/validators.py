from django.core.exceptions import ValidationError
import os

def validate_image_format(value):
    """
    Validate that the uploaded file is PNG or JPG format only.
    """
    ext = os.path.splitext(value.name)[1].lower()
    valid_extensions = ['.png', '.jpg', '.jpeg']
    
    if ext not in valid_extensions:
        raise ValidationError(
            f'Unsupported file format. Only PNG and JPG files are allowed. You uploaded: {ext}'
        )

def validate_image_size(value):
    """
    Validate that the uploaded file is not larger than 10MB.
    """
    max_size = 10 * 1024 * 1024  # 10MB in bytes
    
    if value.size > max_size:
        raise ValidationError(
            f'File size exceeds 10MB limit. Your file is {value.size / (1024 * 1024):.2f}MB'
        )
