from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from courserecommender.models import *
import json
from neomodel.core import DoesNotExist
from courserecommender.utils import *

elas_backend_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)
SEMESTER_DATA = os.path.abspath(
    os.path.join(elas_backend_directory, "courserecommender", "data", "semester.json")
)


@api_view(["POST"])
@permission_classes([AllowAny])
def add_new_student(request):
    data = json.loads(request.body)
    uid = data["uid"]
    name = data["name"]
    username = data["username"]
    study_program = data["study_program"]
    start_semester = data["start_semester"]
    student = Student(
        uid=uid,
        name=name,
        username=username,
        study_program=study_program,
        start_semester=start_semester,
    )
    student.save()
    return JsonResponse(
        {"message": "Add new student successfully"},
        safe=False,
        status=status.HTTP_200_OK,
    )


@csrf_exempt
def add_student(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            uid = data["uid"]
            username = data["username"]
            # password = data["password"]
            study_program = data["study_program"]
            semester = data["semester"]

            student = Student(
                # uid=uid,
                name=username,
                # password=password,
                study_program=study_program,
                semester=semester,
            )
            student.save()

            response = {"message": "User created successfully."}
            return JsonResponse(response, status=201, safe=False)

        except Exception as e:
            response = {
                "message": "An error occurred while creating the user",
                "error": e,
            }
            return JsonResponse(response, status=500, safe=False)

    response_data = {"error": "Invalid request method."}
    return JsonResponse(response_data, status=405)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_student(request):
    try:
        data = JSONParser().parse(request)
        student = Student.nodes.get(uid=data["uid"])
        response = {
            "uid": student.uid,
            "name": student.name,
            "username": student.username,
            "study_program": student.study_program,
            "start_semester": student.start_semester,
        }
    except DoesNotExist as e:
        response = {
            "message": "Student does not exist",
            "error": str(e),
        }
        return JsonResponse(response, status=404, safe=False)
    except Exception as e:
        response = {
            "message": "An unknown error occurred",
            "error": str(e),
        }
        return JsonResponse(response, status=500, safe=False)
    return JsonResponse(response, status=200, safe=False)


def show_student_info(request):
    try:
        data = json.loads(request.body)
        name = data["user_name"]
        student = Student.nodes.get(name=name)
        student_info = {
            "name": student.name,
            "study_program": student.study_program,
            "start_semester": student.start_semester,
        }
        response = {
            "data": student_info,
            "message": "show student information successfully.",
        }
        return JsonResponse(response, status=200, safe=False)
    except Exception as e:
        response = {
            "message": "an error occurred while show courses of student",
            "error": e,
        }
        return JsonResponse(response, status=500, safe=False)


@csrf_exempt
def show_student_courses(request):
    try:
        data = json.loads(request.body)
        name = data["user_name"]
        course_list = []
        student = Student.nodes.get(name=name)
        courses = student.enroll.all()
        for item in courses:
            enroll_rel = student.enroll.relationship(item)
            obj = {
                "cid": item.cid,
                "name": item.name,
                "description": item.description,
                "semester": item.semester,
                "passed": enroll_rel.passed,
            }
            course_list.append(obj)
        response = {"data": course_list, "message": "show course successfully."}
        return JsonResponse(response, status=200, safe=False)
    except Exception as e:
        response = {
            "message": "an error occurred while show courses of student",
            "error": e,
        }
        return JsonResponse(response, status=500, safe=False)


@csrf_exempt
def show_blacklist_courses(request):
    try:
        data = json.loads(request.body)
        name = data["user_name"]
        blacklist = []
        student = Student.nodes.get(name=name)
        courses = student.blacklist.all()
        for item in courses:
            obj = {"name": item.name}
            blacklist.append(obj)
        response = {"data": blacklist, "message": "show blacklist successfully."}
        return JsonResponse(response, status=200, safe=False)
    except Exception as e:
        response = {
            "message": "an error occurred while show blacklist courses of student",
            "error": e,
        }
        return JsonResponse(response, status=500, safe=False)


@api_view(["POST"])
@permission_classes([AllowAny])
def show_student_current_courses(request):
    data = json.loads(request.body)
    uid = data["uid"]
    with open(SEMESTER_DATA, "r", encoding="utf8") as f:
        semester_data = json.loads(f.read())
    current_semester = semester_data[-1]["name"]
    response = []

    student = Student.nodes.get(uid=uid)
    for instance in student.enroll.match(enroll_semester=current_semester):
        enroll_rel = student.enroll.relationship(instance)
        response.append(
            {
                "id": instance.cid,
                "name": instance.name,
                "timetable": instance.timetable,
                "sws": instance.sws,
                "selectedTimeID": enroll_rel.selected_time,
            }
        )
    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def show_whole_student_schedule(request):
    data = json.loads(request.body)
    uid = data["uid"]
    semester = data["semester"]
    response = []
    with open(SEMESTER_DATA, "r", encoding="utf8") as f:
        semester_data = json.loads(f.read())

    student = Student.nodes.get(uid=uid)
    for instance in student.enroll.match(enroll_semester=semester):
        enroll_rel = student.enroll.relationship(instance)
        passed = enroll_rel.passed
        ratings = enroll_rel.ratings
        selected_time = enroll_rel.selected_time
        enroll_semester = enroll_rel.enroll_semester
        response.append(
            {
                "id": instance.cid,
                "name": instance.name,
                "timetable": instance.timetable,
                "sws": instance.sws,
                "passed": passed,
                "rated": ratings,
                "selectedTimeID": selected_time,
                "enrollSemester": enroll_semester,
            }
        )

    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def get_student_semester(request):
    data = json.loads(request.body)
    uid = data["uid"]
    response = []
    with open(SEMESTER_DATA, "r", encoding="utf8") as f:
        semester_data = json.loads(f.read())

    student = Student.nodes.get(uid=uid)
    start_semester = student.start_semester
    start_index = next(
        (i for i, item in enumerate(semester_data) if item["name"] == start_semester),
        -1,
    )
    for item in semester_data[start_index:]:
        response.append(item["name"])
    response = response[::-1]

    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def change_student_setting(request):
    data = json.loads(request.body)
    uid = data["uid"]
    user_setting = data["setting"]
    student = Student.nodes.get(uid=uid)
    student.setting = user_setting
    student.save()
    return JsonResponse(
        {"message": "Change user setting successfully"},
        safe=False,
        status=status.HTTP_200_OK,
    )
