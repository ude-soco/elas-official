from django.http import JsonResponse
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from neomodel.exceptions import UniqueProperty
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
import os
import json


semester_directory = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "courserecommender",
        "data",
        "semester.json",
    )
)
study_program_directory = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "courserecommender",
        "data",
        "study_program_infos.json",
    )
)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_semester_and_study_program_data(request):
    with open(semester_directory) as f_1:
        semester_data = json.load(f_1)
    with open(study_program_directory) as f_2:
        study_program_data = json.load(f_2)

    return JsonResponse(
        {
            "message": {
                "semester_data": semester_data,
                "study_programs": study_program_data,
            }
        },
        status=status.HTTP_200_OK,
    )
