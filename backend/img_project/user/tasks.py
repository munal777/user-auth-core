from celery import shared_task
from .utils import welcome_mail

@shared_task
def send_welcome_message(user_mail):
    welcome_mail(user_mail)
    