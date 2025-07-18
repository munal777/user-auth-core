from celery import shared_task
from .cqis_ai import CQIS



@shared_task
def run_cqis_check(file):
    model = CQIS()
    return model.check_run(file)