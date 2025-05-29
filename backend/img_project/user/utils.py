from django.core.mail import send_mail
from django.conf import settings


def welcome_mail(user_mail):
    subject = "Welcome to Project Name"
    message = """
    Your account has been created successfully! 🎉
    """
    app_mail = settings.EMAIL_HOST_USER

    send_mail(subject, message, app_mail, [user_mail], fail_silently=True)