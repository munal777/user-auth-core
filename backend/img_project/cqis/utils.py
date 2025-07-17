import os
from PyPDF2 import PdfReader, PdfWriter
from django.conf import settings


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
