import os
import time

from PyPDF2 import PdfReader, PdfWriter
from django.conf import settings
from .tasks import run_cqis_check

def split_pdf(pdf, task_id):
    reader = PdfReader(pdf)

    page_files = []

    output_dir = os.path.join(settings.MEDIA_ROOT, task_id)
    os.makedirs(output_dir, exist_ok=True)

    for i, page in enumerate(reader.pages):

        writer = PdfWriter()
        writer.add_page(page)

        page_path = os.path.join(output_dir, f'page_{i+1}.pdf')

        with open(page_path, "wb") as f:
            writer.write(f)

        page_files.append(page_path)
       
    return page_files


def event_stream(task_id):

    output_dir = os.path.join(settings.MEDIA_ROOT, task_id)
    total_pages = len(os.listdir(output_dir))

    task_results = []

    for i in range(total_pages):
        page_path = os.path.join(output_dir, f'page_{i+1}.pdf')

        if os.path.exists(page_path):
            result = run_cqis_check.delay(page_path)
            task_results.append((i+1, result))
        else:
            break
    
    completed = set()

    while len(completed) < len(task_results):
        for page_num, result in task_results:
            if page_num in completed:
                continue
            if result.ready():
                yield f"data: {result.result}\n\n"
                completed.add(page_num)

        time.sleep(0.5)   