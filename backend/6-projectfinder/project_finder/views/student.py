from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import json
from project_finder.models import *


@api_view(["POST"])
@permission_classes([AllowAny])
def add_new_student(request):
    data = json.loads(request.body)
    uid = data["uid"]
    name = data["name"]
    username = data["username"]
    student = Student(
        uid=uid,
        name=name,
        username=username,
    )
    student.save()
    return JsonResponse(
        {"message": "Add new student successfully"},
        safe=False,
        status=status.HTTP_200_OK,
    )
