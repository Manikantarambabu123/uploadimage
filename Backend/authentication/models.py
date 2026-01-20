from django.db import models
from django.contrib.auth.models import User
import random
import string
from django.utils import timezone

class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def is_expired(self):
        # OTP expires in 10 minutes
        return timezone.now() > self.created_at + timezone.timedelta(minutes=10)

    @staticmethod
    def generate_code():
        return ''.join(random.choices(string.digits, k=6))

    def __str__(self):
        return f"OTP for {self.user.username} - {self.code}"
