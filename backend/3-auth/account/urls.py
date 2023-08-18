from django.urls import path
from .views import *

urlpatterns = [
    path("register/", user_registration_view, name="register"),
    path("login/", user_login_view, name="login"),
    path("logout/", user_logout_view, name="logout"),
    path("update/<str:user_id>/", user_update_view, name="update"),
    path("session/", session_view, name="session"),
]
