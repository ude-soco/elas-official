from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from courserecommender.models import *
from courserecommender.utils.caculate_impact_factors_weight import *
import json


@csrf_exempt
def test(request):
    try:
        data = json.loads(request.body)
        student = Student.nodes.get(name=data["name"])
        course = Course.nodes.get(name="Cloud, Web & Mobile")
        es_weight = enrolled_student_weight(student, course)
        ps_weight = passed_student_weight(course)
        pr_weight = positive_rating_weight(course)
        response = {"es_weight": es_weight,
                    "ps_weight": ps_weight}

        return JsonResponse(response, status=200, safe=False)
    except Exception as e:
        response = {
            "message": "an error occurred while enrolling a course",
            "error": e
        }
        return JsonResponse(response, status=500, safe=False)
