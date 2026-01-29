from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_patient, name='add_patient'),
    path('assign/', views.assign_patient, name='assign_patient'),
    path('list/', views.get_patients, name='get_patients'),
    path('nurses/', views.get_nurses, name='get_nurses'),
    path('<int:pk>/', views.get_patient_profile, name='get_patient_profile'),
]
