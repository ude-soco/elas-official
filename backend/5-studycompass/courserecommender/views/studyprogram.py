from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from courserecommender.models import *
import json
import os

semester_directory = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "data",
        "semester.json",
    )
)
study_program_directory = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "data",
        "study_program_infos.json",
    )
)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_all_studyprogram(request):
    response = []
    studyprgrams = Study_program.nodes.all()
    for studyprgram in studyprgrams:
        response.append(
            {
                "id": studyprgram.r_id,
                "name": studyprgram.name,
            }
        )
    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_semester_and_study_program_data(request):
    with open(semester_directory) as f_1:
        semester_data = json.load(f_1)
    # with open(study_program_directory) as f_2:
    #     study_program_data = json.load(f_2)
    study_program_data = []
    studyprograms = Study_program.nodes.all()
    for studyprogram in studyprograms:
        study_program_data.append(
            {
                "id": studyprogram.r_id,
                "name": studyprogram.name,
                "url": studyprogram.url,
            }
        )

    return JsonResponse(
        {
            "message": {
                "semester_data": semester_data,
                "study_programs": study_program_data,
            }
        },
        status=status.HTTP_200_OK,
    )
