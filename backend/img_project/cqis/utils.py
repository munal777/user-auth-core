import os
from PyPDF2 import PdfReader, PdfWriter
from django.conf import settings


def split_pdf(pdf):
    reader = PdfReader(pdf)

    page_files = []

    for i, page in enumerate(reader.pages):

        writer = PdfWriter()
        writer.add_page(page)

        page = i + 1

        file_path = os.path.join(settings.MEDIA_ROOT, "pages", page)

        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, "wb") as f:
            writer.write(f)

        page_files.append(file_path)
       
    return page_files
