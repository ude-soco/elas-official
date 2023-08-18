from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/studycompass/", include("studycompass.urls")),
    path("api/course-recommender/", include("courserecommender.urls")),
]
