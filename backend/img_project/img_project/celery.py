import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'img_project.settings')

# This creates the Celery "app" object, named 'img_project'
app = Celery('img_project')

# Load settings from Django's settings.py (only keys starting with 'CELERY_')
app.config_from_object('django.conf:settings', namespace='CELERY') 

# Finds tasks in all tasks.py files across apps
app.autodiscover_tasks() 