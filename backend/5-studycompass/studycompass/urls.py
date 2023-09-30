from django.urls import path
from .views import *

urlpatterns = [
    path("scrape/", scrape_lsf, name="scrape_lsf"),
    path("status/task/<str:task_id>/", check_task_status, name="check_task_status"),
    path("get-studyprograms/", get_studyprograms, name="get_studyprograms"),
    path(
        "get-lectures-with-id/<str:id>/",
        get_lectures_with_id,
        name="get_lectures_with_id",
    ),
]
