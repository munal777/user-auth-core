from django.core.mail import send_mail
from django.conf import settings
import random

def welcome_mail(user_mail):
    subject = "Welcome to Project Name"
    message = """
    Your account has been created successfully! 🎉
    """
    app_mail = settings.EMAIL_HOST_USER

    send_mail(subject, message, app_mail, [user_mail], fail_silently=True)

def send_otp_to_email(user_mail):
    subject = "OTP Code to Change Password"

    generate_otp = random.randint(100000, 999999)

    message = f"Use this code {generate_otp} to change your password"

    app_mail = settings.EMAIL_HOST_USER

    send_mail(subject, message, app_mail, [user_mail], fail_silently=True)

