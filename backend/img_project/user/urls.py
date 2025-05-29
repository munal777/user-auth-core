from django.urls import path
from .views import UserAPIView, LoginAPIView, RegisterAPIView, UserProfileAPIView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('user/<int:id>/', UserAPIView.as_view(), name='user'),
    path('user/profile/<int:id>/', UserProfileAPIView.as_view(), name='userProfile'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]