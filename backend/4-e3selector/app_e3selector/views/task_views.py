from celery.result import AsyncResult
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
import json

from ..celery_tasks.tasks import scrape_e3_task

@api_view(["GET"])
def check_task_status(request, task_id):
    task = AsyncResult(task_id)
    if task.ready():
        result = task.result
        return JsonResponse(
            {"status": "completed", "message": result}, status=status.HTTP_200_OK
        )
    else:
        return JsonResponse({"status": "pending"}, status=status.HTTP_202_ACCEPTED)

# TODO: Need to update to the django rest framework
@csrf_exempt
def scrape_e3(request):
    if request.method == "POST":
        request_body = json.loads(request.body.decode("utf-8"))
        url = request_body.get("url")
        if url:
            task = scrape_e3_task.delay(url=url)  # type: ignore
            return JsonResponse(
                {"task_id": task.id, "message": "Started scraping", "status": 200}
            )
        else:
            return JsonResponse(data={"message": "URL not provided", "status": 400})
    else:
        return JsonResponse(data={"message": "Invalid request method", "status": 405})
