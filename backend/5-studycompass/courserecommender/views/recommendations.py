from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from courserecommender.models import *
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from courserecommender.utils import (
    get_similar_students,
    get_courses_from_similar_students,
    get_courses_from_course_path,
    combine_course_list,
    filter_by_blacklist,
)
from courserecommender.utils.caculate_impact_factors_weight import *

import json


@csrf_exempt
def generate_recommendations(request):
    try:
        data = json.loads(request.body)
        student = Student.nodes.get(username=data["username"])
        # 1. get similar student list
        if student.embedding:
            candidate_similar_list = Student.nodes.filter(
                study_program=student.study_program
            )
            similar_list = get_similar_students(student, candidate_similar_list)

            # 2. get candidate course list from similar students
            student_candidate_course_list = []
            for item in similar_list:
                student_name = item["name"]
                student_similarity = item["similarity"]
                similar_student = Student.nodes.get(username=student_name)
                course_list = get_courses_from_similar_students(
                    student, similar_student
                )
                student_candidate_course_list.append(
                    {
                        "course_list": course_list,
                        "name": student_name,
                        "similarity": student_similarity,
                    }
                )

            # 3. get candidate course list from learning path
            path_candidate_course_list = get_courses_from_course_path(student)

            # 4. combine candidate course list
            combined_candidate_list = combine_course_list(
                student_candidate_course_list, path_candidate_course_list
            )

            # 5. filter candidate course list
            filtered_candidate_list = filter_by_blacklist(
                student, combined_candidate_list
            )

            # 6. rank by impact factor weights
            weighted_candidate_list = []
            for candidate in filtered_candidate_list:
                u_weight = 0
                for similar_item in student_candidate_course_list:
                    if candidate in similar_item["course_list"]:
                        u_weight += similar_item["similarity"]
                lp_weight = 0
                for path_list in path_candidate_course_list:
                    for path_item in path_list:
                        if candidate == path_item["course_name"]:
                            lp_weight += path_item["possibility"]

                course = Course.nodes.get(name=candidate)
                es_weight = enrolled_student_weight(student, course)
                ps_weight = passed_student_weight(course)
                pr_weight = positive_rating_weight(course)
                total_weight = u_weight + lp_weight + es_weight + ps_weight + pr_weight
                print(u_weight, lp_weight, es_weight, ps_weight, pr_weight)
                # print(total_weight)
                weighted_candidate_list.append(
                    {"course_name": candidate, "total_weight": total_weight}
                )
            ranked_candidate_list = sorted(
                weighted_candidate_list, key=lambda x: x["total_weight"], reverse=True
            )
            # 7. top 5 as recommendations
            recommendation_list = ranked_candidate_list[:5]

            response = {
                "similar_user": student_candidate_course_list,
                "learning_path": path_candidate_course_list,
                "combined": combined_candidate_list,
                "filtered": filtered_candidate_list,
                "ranked": ranked_candidate_list,
                "recommendations": recommendation_list,
            }

            return JsonResponse(response, status=200, safe=False)
        else:
            response = {}
        return JsonResponse(response, status=200, safe=False)
    except Exception as e:
        response = {"message": "an error occurred while enrolling a course", "error": e}
        return JsonResponse(response, status=500, safe=False)


@api_view(["POST"])
@permission_classes([AllowAny])
def generate_top_popular(request):
    data = json.loads(request.body)
    studyprogram = data["studyprogram"]
    matched_courses = []
    courses, cols = db.cypher_query(
        f"""MATCH (c)-[r:belongs_to]->(s) where s.name="{studyprogram}" and c.passed_number>0 return c"""
    )
    for course in courses:
        node = course[0]
        matched_courses.append({"name": node["name"], "number": node["passed_number"]})
    response = sorted(matched_courses, key=lambda x: x["number"], reverse=True)[:10]
    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)
