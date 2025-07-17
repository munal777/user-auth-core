import time
from django.http import StreamingHttpResponse
from django.views import View
import json


def event_stream(pages):
    for i, pages in enumerate(pages):
        time.sleep(5)

        result = {
            "page": i + 1,
            "summary": f"Summary of Page {i + 1}",
            "status": "done"
        }

        yield f"data: {json.dumps(result)}\n\n"

class StreamView(View):

    def post(self, request):
        pdf = request.FILES.get('files')