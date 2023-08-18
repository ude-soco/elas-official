from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from courserecommender.models import *
import json
import os
import datetime
from neomodel import db
from courserecommender.utils import (
    calculate_student_embedding,
    add_has_next,
    delete_has_next,
    generate_recommendations,
    generate_top_popular,
    get_course_ratings,
)

elas_backend_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)
SEMESTER_DATA = os.path.abspath(
    os.path.join(elas_backend_directory, "courserecommender", "data", "semester.json")
)


@api_view(["GET"])
def get_all_courses(request):
    response = []
    with open(SEMESTER_DATA, "r", encoding="utf8") as f:
        semester_data = json.loads(f.read())
    current_semester = semester_data[-1]["name"]
    instances = Course_instance.nodes.filter(semester=current_semester)
    for instance in instances:
        professors = []
        studyprograms = []
        teachers = instance.teacher.all()
        course = Course.nodes.get(name=instance.name)
        programs = course.belongs.all()
        for program in programs:
            studyprograms.append(program.name)
        for teacher in teachers:
            professors.append({"name": teacher.name})
        response.append(
            {
                "id": instance.cid,
                "url": instance.url,
                "name": instance.name,
                "subject_type": instance.subject_type,
                "sws": instance.sws,
                "language": instance.language,
                "professors": professors,
                "description": instance.description,
                "timetable": instance.timetable,
                "semester": instance.semester,
                "belonged_studyprograms": studyprograms,
            }
        )
    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)


@api_view(["POST"])
def get_courses_by_studyprogram(request):
    data = json.loads(request.body)
    studyprogram = data["studyprogram"]
    semester = data["semester"]
    response = []
    # with open(SEMESTER_DATA, "r", encoding="utf8") as f:
    #     semester_data = json.loads(f.read())
    # current_semester = semester_data[-1]["name"]
    courses, cols = db.cypher_query(
        f"""MATCH (c)-[r:belongs_to]->(s), (c)-[r1:has_instance]->(i) where s.name="{studyprogram}" and i.semester="{semester}" return i"""
    )
    if not courses:
        return JsonResponse(
            {"error": "Courses not found"}, status=status.HTTP_404_NOT_FOUND
        )
    for course in courses:
        # get the specific node in graph
        node = course[0]
        professors = []
        instance = Course_instance.nodes.get(cid=node["cid"])
        teachers = instance.teacher.all()
        for teacher in teachers:
            professors.append({"name": teacher.name})
        response.append(
            {
                "id": node["cid"],
                "url": node["url"],
                "name": node["name"],
                "subject_type": node["subject_type"],
                "sws": node["sws"],
                "language": node["language"],
                "professors": professors,
                "description": node["description"],
                "timetable": json.loads(node["timetable"]),
                "semester": node["semester"],
            }
        )
    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)


@api_view(["POST"])
def get_courses_by_userInfo(request):
    data = json.loads(request.body)
    studyprogram = data["studyprogram"]
    # TODO:check if data has uid, combine url
    uid = data["uid"]
    response = []
    passed_list = []
    popular_list = []
    recommended_list = []
    with open(SEMESTER_DATA, "r", encoding="utf8") as f:
        semester_data = json.loads(f.read())
    current_semester = semester_data[-1]["name"]
    student = Student.nodes.get(uid=uid)

    # get passed course list
    passed_courses = student.passed.all()
    for passed_course in passed_courses:
        passed_list.append({"name": passed_course.name})

    # get top popular course list
    popular_list = generate_top_popular(student)
    print("popular_list", popular_list)

    # get recommended course list
    recommended_list = generate_recommendations(student)
    print("recommended_list", recommended_list)

    # get all courses in current semester of a studyprogram
    courses, cols = db.cypher_query(
        f"""MATCH (c)-[r:belongs_to]->(s), (c)-[r1:has_instance]->(i) where s.name="{studyprogram}" and i.semester="{current_semester}" return i"""
    )
    if not courses:
        return JsonResponse(
            {"error": "Courses not found"}, status=status.HTTP_404_NOT_FOUND
        )
    for course in courses:
        # get the specific node in graph
        node = course[0]
        passed_status = False
        popular_status = False
        passed_number = 0
        passed_percentage = "0%"
        recommended_status = False
        recommended_weight = 0
        for passed_course in passed_list:
            if passed_course["name"] == node["name"]:
                passed_status = True
        for popular_course in popular_list:
            if popular_course["name"] == node["name"]:
                popular_status = True
                passed_number = popular_course["passed_number"]
                passed_percentage = popular_course["passed_percentage"]
        if recommended_list:
            for recommended_course in recommended_list:
                if recommended_course["name"] == node["name"]:
                    recommended_status = True
                    recommended_weight = recommended_course["weight"]
        ratings = get_course_ratings(node)
        professors = []
        instance = Course_instance.nodes.get(cid=node["cid"])
        teachers = instance.teacher.all()
        for teacher in teachers:
            professors.append({"name": teacher.name})
        response.append(
            {
                "id": node["cid"],
                "url": node["url"],
                "name": node["name"],
                "subject_type": node["subject_type"],
                "sws": node["sws"],
                "language": node["language"],
                "professors": professors,
                "description": node["description"],
                "timetable": json.loads(node["timetable"]),
                "semester": node["semester"],
                "passed": passed_status,
                "popularity": {
                    "status": popular_status,
                    "passed_students": passed_number,
                    "passed_percentage": passed_percentage,
                },
                "recommendation": {
                    "status": recommended_status,
                    "weight": recommended_weight,
                },
                "ratings": ratings,
            }
        )

    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_courseInfo_by_id(request, id):
    response = []
    keywords = []
    professors = []
    study_prgrams = []
    instance = Course_instance.nodes.get(cid=id)
    course = Course.nodes.get(name=instance.name)
    topics = instance.topic.all()
    teachers = instance.teacher.all()
    studyprograms = course.belongs.all()
    for topic in topics:
        rel = instance.topic.relationship(topic)
        keywords.append({"text": topic.name, "value": rel.normalized_weight})
    for teacher in teachers:
        professors.append({"name": teacher.name})
    for studyprogram in studyprograms:
        study_prgrams.append({"name": studyprogram.name})
    response = {
        "id": instance.cid,
        "url": instance.url,
        "name": instance.name,
        "subject_type": instance.subject_type,
        "sws": instance.sws,
        "language": instance.language,
        "description": instance.description,
        "timetable": instance.timetable,
        "semester": instance.semester,
        "keywords": keywords,
        "professors": professors,
        "study_prgrams": study_prgrams,
    }

    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)


@api_view(["POST"])
def enroll_course(request):
    data = json.loads(request.body)
    uid = data["uid"]
    cid = data["cid"]
    selectedTimeID = data["selectedTimeID"]
    passed = data["passed"]
    if not isinstance(selectedTimeID, list):
        selectedTimeID = [selectedTimeID]

    student = Student.nodes.get(uid=uid)
    instance = Course_instance.nodes.get(cid=cid)
    course = Course.nodes.get(name=instance.name)
    if not student.enroll.is_connected(instance):
        if not student.passed.is_connected(course):
            if passed:
                student.passed.connect(course)
                if course.passed_number:
                    course.passed_number += 1
                    course.save()
                else:
                    course.passed_number = 1
                    course.save()
            semester = instance.semester
            student.enroll.connect(
                instance,
                {
                    "enroll_semester": semester,
                    "selected_time": selectedTimeID,
                    "passed": passed,
                },
            )
            add_has_next(student, instance)
            calculate_student_embedding(student)

        else:
            response = {"error": "you have already passed this course "}
            return JsonResponse(response, safe=False, status=status.HTTP_409_CONFLICT)
    else:
        if not selectedTimeID:
            student.enroll.disconnect(instance)
            response = {"massage": "unenroll course successfully."}
            return JsonResponse(response, safe=False, status=status.HTTP_200_OK)
        enroll_rel = student.enroll.relationship(instance)
        if selectedTimeID != enroll_rel.selected_time:
            enroll_rel.selected_time = selectedTimeID
            enroll_rel.save()
            response = {"massage": "enroll course successfully."}
            return JsonResponse(response, safe=False, status=status.HTTP_200_OK)
        response = {"error": "you have already enrolled this course "}
        return JsonResponse(response, safe=False, status=status.HTTP_409_CONFLICT)
    response = {"massage": "enroll course successfully."}
    return JsonResponse(response, safe=False, status=status.HTTP_200_OK)


@api_view(["POST"])
def unenroll_course(request):
    data = json.loads(request.body)
    uid = data["uid"]
    cid = data["cid"]

    student = Student.nodes.get(uid=uid)
    course = Course_instance.nodes.get(cid=cid)
    enroll_rel = student.enroll.relationship(course)

    if not enroll_rel.passed == True:
        student.enroll.disconnect(course)
    else:
        response = {"error": "passed course can not modify enrollment status."}
        return JsonResponse(response, safe=False, status=status.HTTP_409_CONFLICT)

    response = {"massage": "unenroll course successfully."}
    return JsonResponse(response, safe=False, status=status.HTTP_200_OK)


@api_view(["POST"])
def change_course_pass_state(request):
    data = json.loads(request.body)
    uid = data["uid"]
    cid = data["cid"]
    passed = data["passed"]
    student = Student.nodes.get(uid=uid)
    instance = Course_instance.nodes.get(cid=cid)
    course = Course.nodes.get(name=instance.name)
    enroll_rel = student.enroll.relationship(instance)
    # check if new state is not original state, if true, change state
    if passed != enroll_rel.passed:
        # change from NOT PASSED to PASSED
        # add has passed relationship and count No. of passed student in a course
        if passed:
            student.passed.connect(course)
            if course.passed_number:
                course.passed_number += 1
                course.save()
            else:
                course.passed_number = 1
                course.save()

            enroll_rel.passed = passed
            enroll_rel.save()
            calculate_student_embedding(student)
            add_has_next(student, instance)
            response = {"massage": "change state to passed successfully."}
        # change from PASSED to NOT PASSED
        # remove has passed relationship and count No. of passed student in a course
        else:
            student.passed.disconnect(course)
            course.passed_number -= 1
            course.save()

            enroll_rel.passed = passed
            enroll_rel.ratings = None
            enroll_rel.save()
            calculate_student_embedding(student)
            delete_has_next(student, instance)
            response = {"massage": "change state to not passed successfully."}
    response = {"massage": "no changes,keep state as it is "}
    return JsonResponse(response, safe=False, status=status.HTTP_200_OK)


@csrf_exempt
def pass_course(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            for item in data:
                user_name = item["user_name"]
                course_id = item["course_id"]
                passed = item["passed"]
                student = Student.nodes.get(username=user_name)
                instance = Course_instance.nodes.get(cid=course_id)
                course = Course.nodes.get(name=instance.name)
                enroll_rel = student.enroll.relationship(instance)
                enroll_rel.passed = passed
                enroll_rel.save()
                # add has passed relationship and count No. of passed student in a course
                if passed:
                    student.passed.connect(course)
                    if course.passed_number:
                        course.passed_number += 1
                        course.save()
                    else:
                        course.passed_number = 1
                        course.save()

                    calculate_student_embedding(student)
                    add_has_next(student, instance)

            response = {"massage": "update passed status successfully."}
            return JsonResponse(response, status=200, safe=False)

        except Exception as e:
            response = {
                "message": "an error occurred while updating passed status",
                "error": e,
            }
            return JsonResponse(response, status=500, safe=False)

    response_data = {"error": "Invalid request method."}
    return JsonResponse(response_data, status=405)


@csrf_exempt
def undo_pass(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            for item in data:
                user_name = item["user_name"]
                course_id = item["course_id"]
                passed = item["passed"]
                student = Student.nodes.get(name=user_name)
                instance = Course_instance.nodes.get(cid=course_id)
                course = Course.nodes.get(name=instance.name)

                student.passed.disconnect(course)
                course.passed_number -= 1
                course.save()

                enroll_rel = student.enroll.relationship(instance)
                enroll_rel.passed = passed
                enroll_rel.save()

                calculate_student_embedding(student)
                delete_has_next(student, instance)

            response = {"massage": "update passed status successfully."}
            return JsonResponse(response, status=200, safe=False)

        except Exception as e:
            response = {
                "message": "an error occurred while updating passed status",
                "error": e,
            }
            return JsonResponse(response, status=500, safe=False)

    response_data = {"error": "Invalid request method."}
    return JsonResponse(response_data, status=405)


@api_view(["POST"])
def rate_course(request):
    data = json.loads(request.body)
    uid = data["uid"]
    cid = data["cid"]
    ratings = data["ratings"]
    local_time = datetime.datetime.now()
    student = Student.nodes.get(uid=uid)
    course = Course_instance.nodes.get(cid=cid)
    enroll_rel = student.enroll.relationship(course)

    if enroll_rel.passed == True:
        enroll_rel.ratings = ratings
        enroll_rel.ratings_last_updated = local_time
        enroll_rel.save()
    else:
        response = {"massage": "only passed course can be rated."}
        return JsonResponse(response, safe=False, status=status.HTTP_409_CONFLICT)

    response = {"massage": "rate course successfully."}
    return JsonResponse(response, safe=False, status=status.HTTP_200_OK)


@csrf_exempt
def add_to_blaclist(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            user_name = data["user_name"]
            course_id = data["course_id"]

            student = Student.nodes.get(name=user_name)
            instance = Course_instance.nodes.get(cid=course_id)
            course = Course.nodes.get(name=instance.name)
            if not student.blacklist.is_connected(course):
                student.blacklist.connect(course)
            else:
                response = {"massage": "course in already in blacklist"}
                return JsonResponse(response, status=401, safe=False)

            response = {"massage": "add to blacklist successfully."}
            return JsonResponse(response, status=200, safe=False)

        except:
            response = {
                "message": "an error occurred while adding to blacklist",
                "error": Exception,
            }
            return JsonResponse(response, status=500, safe=False)

    response_data = {"error": "Invalid request method."}
    return JsonResponse(response_data, status=405)


@csrf_exempt
def remove_from_blaclist(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            user_name = data["user_name"]
            course_id = data["course_id"]

            student = Student.nodes.get(name=user_name)
            instance = Course_instance.nodes.get(cid=course_id)
            course = Course.nodes.get(name=instance.name)
            student.blacklist.disconnect(course)

            response = {"massage": "remove from blacklist successfully."}
            return JsonResponse(response, status=200, safe=False)

        except:
            response = {
                "message": "an error occurred while adding to blacklist",
                "error": Exception,
            }
            return JsonResponse(response, status=500, safe=False)

    response_data = {"error": "Invalid request method."}
    return JsonResponse(response_data, status=405)
