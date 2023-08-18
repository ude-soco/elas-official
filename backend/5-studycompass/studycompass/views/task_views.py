from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated

from ..celery_tasks.tasks import scrape_lsf_task


@api_view(["POST"])

def scrape_lsf(request):
    data = JSONParser().parse(request)
    url = data.get("url")
    if url:
        task = scrape_lsf_task.delay(url=url)  # type: ignore
        return JsonResponse(
            {"task_id": task.id, "message": "Started scraping"},
            status=status.HTTP_202_ACCEPTED,
        )
    else:
        return JsonResponse(
            {"message": "URL not provided"}, status=status.HTTP_400_BAD_REQUEST
        )
