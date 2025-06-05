from django.core.mail import send_mail
from django.conf import settings
import secrets

def welcome_mail(user_mail):
    subject = "Welcome to Project Name"
    message = """
    Your account has been created successfully! 🎉
    """
    app_mail = settings.EMAIL_HOST_USER
    send_mail(subject, message, app_mail, [user_mail], fail_silently=True)



def send_otp_to_email(user_mail):
    subject = "OTP Code to Change Password"

    message = f"Use this code {generate_otp} to change your password"

    app_mail = settings.EMAIL_HOST_USER

    send_mail(subject, message, app_mail, [user_mail], fail_silently=True)



def generate_otp():
    
    otp = ''.join(str(secrets.randbelow(10)) for _ in range(6))

    return otp