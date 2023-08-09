from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from ..celery_tasks.tasks import scrape_e3_task


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
