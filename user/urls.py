from django.urls import path
from .views import LoginAPIView, RegisterAPIView, UserListAPIView, UserDetailsAPIView, UserProfileAPIView, SendOTPView, ValidateOTPView, ChangePasswordAPIView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('users/', UserListAPIView.as_view(), name='users'),
    path('user/<int:id>/', UserDetailsAPIView.as_view(), name='user_detail'),
    path('user/profile/<int:id>/', UserProfileAPIView.as_view(), name='userProfile'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('verify-otp/', ValidateOTPView.as_view(), name="verify_otp"),
    path('reset-password/', ChangePasswordAPIView.as_view(), name="reset_password")
]