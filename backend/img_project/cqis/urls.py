from django.urls import path
from .views import UploadPDFView, StreamPagesView

urlpatterns = [
    path('events/', UploadPDFView.as_view(), name='upload_pdf'),
    path('events/<str:task_id>', StreamPagesView.as_view(), name='sse_events'),
]