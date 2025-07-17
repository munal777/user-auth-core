from django.urls import path
from .views import UploadPDFView

urlpatterns = [
    path('events/', UploadPDFView.as_view(), name='sse_events'),
]