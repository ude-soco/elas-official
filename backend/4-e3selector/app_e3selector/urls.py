from django.urls import path
from .views import *

urlpatterns = [
    path("status/task/<str:task_id>/", check_task_status, name="check_task_status"),
    path("scrape/", scrape_e3, name="scrape_e3"),
    path(
        "courses-ratings/",  # replaced with "e3_courses_and_rating/" TODO: update frontend
        get_e3_courses_and_ratings,
        name="get_e3_courses_and_ratings",
    ),
    path("e3-courses/", get_e3_courses, name="get_e3_courses"),
    path("shared/<slug>/", share, name="share"),
]
