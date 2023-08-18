from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from courserecommender.models import *
import json


@api_view(["GET"])
@permission_classes([AllowAny])
def get_all_studyprogram(request):
    response = []
    studyprgrams = Study_program.nodes.all()
    for studyprgram in studyprgrams:
        response.append(
            {
                "id": studyprgram.id,
                "name": studyprgram.name,
            }
        )
    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)
