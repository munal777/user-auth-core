import time
import json
import uuid

from django.http import StreamingHttpResponse
from django.views import View

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from .serializers import PDFSerializer
from .utils import split_pdf

def event_stream(pages):
    for i, pages in enumerate(pages):
        time.sleep(5)

        result = {
            "page": i + 1,
            "summary": f"Summary of Page {i + 1}",
            "status": "done"
        }

        yield f"data: {json.dumps(result)}\n\n"

class UploadPDFView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        file = request.FILES.get('file')

        serializers = PDFSerializer(data={'file': file})

        if serializers.is_valid(raise_exception=True):
            pdf_file = serializers.validated_data['file']

            task_id = str(uuid.uuid4())
            pdf_list = split_pdf(pdf_file, task_id)

            return Response({'task_id': task_id}, status=status.HTTP_200_OK)
        

