from __future__ import absolute_import, unicode_literals
import os

from celery import Celery
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")

app = Celery("server")

app.config_from_object(settings, namespace="CELERY")

app.autodiscover_tasks()

app.conf.update(
    worker_max_tasks_per_child=1,
    broker_pool_limit=None,
)


@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
