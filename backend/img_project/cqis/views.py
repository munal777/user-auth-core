import time
from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view

def event_stream():
    for i in range(10):
        time.sleep(1)  # simulate delay
        yield f"data: Message {i}\n\n"

@api_view(['GET'])
def sse_view(request):
    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    return response