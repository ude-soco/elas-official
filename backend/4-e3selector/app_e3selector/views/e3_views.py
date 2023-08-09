from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
import os
import csv
import ast


from ..models import *


@api_view(["GET"])
@permission_classes([AllowAny])
def get_e3_courses_and_ratings(request):
    docs = E3Course.objects.prefetch_related("e3rating_set")

    response = []
    for e3course in docs:
        for e3rating in e3course.e3rating_set.all():  # type: ignore
            response.append(
                {
                    "selected": e3course.selected,
                    "Title": e3course.name,
                    "Link": e3course.url,
                    "catalog": e3course.catalog,
                    "Type": e3course.type,
                    "SWS": e3course.sws,
                    "Erwartete Teilnehmer": e3course.num_expected_participants,
                    "Max. Teilnehmer": e3course.max_participants,
                    "Credits": e3course.credit,
                    "Language": e3course.language,
                    "Description": e3course.description,
                    "Times_manual": e3course.timetables,
                    "Location": e3course.location,
                    "Exam": e3course.exam_type,
                    "Ausgeschlossen_Ingenieurwissenschaften_Bachelor": e3course.ausgeschlossen_ingenieurwissenschaften_bachelor,
                    "fairness": e3rating.fairness,
                    "support": e3rating.support,
                    "material": e3rating.material,
                    "fun": e3rating.fun,
                    "comprehensibility": e3rating.comprehensibility,
                    "interesting": e3rating.interesting,
                    "grade_effort": e3rating.grade_effort,
                }
            )

    return JsonResponse(response, safe=False, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_e3_courses(request):
    docs = E3Course.objects.prefetch_related("e3rating_set")

    response = []
    for e3course in docs:
        for e3rating in e3course.e3rating_set.all():  # type: ignore
            timetable = ast.literal_eval(e3course.timetables)
            if isinstance(timetable, list):
                timetable_objects = []
                for item in timetable:
                    timetable_objects.append(item)

                response.append(
                    {
                        "id": e3course.id,
                        "course_name": e3course.name,
                        "url": e3course.url,
                        "catalog": e3course.catalog,
                        "type": e3course.type,
                        "sws": e3course.sws,
                        "expected_participants": e3course.num_expected_participants,
                        "max_participants": e3course.max_participants,
                        "credits": e3course.credit,
                        "language": e3course.language,
                        "description": e3course.description,
                        "timetable": timetable_objects,
                        "location": e3course.location,
                        "exam": e3course.exam_type,
                        "study_programs": e3course.ausgeschlossen_ingenieurwissenschaften_bachelor,
                        "ratings": {
                            "fairness": e3rating.fairness,
                            "support": e3rating.support,
                            "material": e3rating.material,
                            "fun": e3rating.fun,
                            "comprehensibility": e3rating.comprehensibility,
                            "interesting": e3rating.interesting,
                            "grade_effort": e3rating.grade_effort,
                        },
                    }
                )

    return JsonResponse(response, safe=False, status=status.HTTP_200_OK)


SHARED_CSV_DATA_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "shared.csv")
)


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def share(request, slug):
    if request.method == "GET":
        with open(SHARED_CSV_DATA_FILE, "r") as file:
            filereader = csv.reader(file)
            for row in filereader:
                if row[0] == slug:
                    return JsonResponse({"e3selected": row[1], "e3filters": row[2]})
            return JsonResponse({"message": "OK"}, status=status.HTTP_200_OK)

    else:  # POST
        data = request.json
        with open(SHARED_CSV_DATA_FILE, "a") as file:
            filewriter = csv.writer(file)
            filewriter.writerow([slug, data["e3selected"], data["e3filters"]])
        return JsonResponse({"message": "OK"}, status=status.HTTP_200_OK)
