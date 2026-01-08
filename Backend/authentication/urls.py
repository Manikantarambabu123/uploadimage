from django.urls import path
from . import views

urlpatterns = [
    path('', views.auth_index, name='auth_index'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('me/', views.get_user_info, name='user_info'),
]
