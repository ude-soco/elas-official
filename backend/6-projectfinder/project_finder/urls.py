from django.urls import path
from .views import *

urlpatterns = [
    # path("example-route/", example_view, name="example-name"),
    path("students/", add_new_student, name="add-new-student"),
]
