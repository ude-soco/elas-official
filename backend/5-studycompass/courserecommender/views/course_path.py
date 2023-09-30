from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from courserecommender.models import *
from neomodel import db
import json


@api_view(["GET"])
@permission_classes([AllowAny])
def get_whole_course_path(request):
    response = []
    lable_list = []
    source_list = []
    target_list = []
    value_list = []
    results, cols = db.cypher_query(
        "MATCH (c1)-[r:has_next]->(c2) RETURN c1.name,c2.name,r.count"
    )
    for item in results:
        source_list.append(item[0])
        target_list.append(item[1])
        value_list.append(item[2])
    lable_list = list(set(source_list+target_list))
    final_source = [lable_list.index(item) for item in source_list]
    final_target = [lable_list.index(item) for item in target_list]

    response = [{"lableList": lable_list, "sourceList": final_source,
                 "targetList": final_target, "valueList": value_list}]
    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def get_study_program_course_path(request):
    data = json.loads(request.body)
    studyprogram = data["studyprogram"]
    response = []
    lable_list = []
    source_list = []
    target_list = []
    value_list = []
    results, cols = db.cypher_query(
        f"""MATCH (c1)-[r:has_next]->(c2), (c1)-[r1:belongs_to]->(s),(c2)-[r2:belongs_to]->(s) where s.name="{studyprogram}" RETURN c1.name,c2.name,r.count"""
    )
    for item in results:
        source_list.append(item[0])
        target_list.append(item[1])
        value_list.append(item[2])
    lable_list = list(set(source_list+target_list))
    final_source = [lable_list.index(item) for item in source_list]
    final_target = [lable_list.index(item) for item in target_list]

    response = [{"lableList": lable_list, "sourceList": final_source,
                 "targetList": final_target, "valueList": value_list}]
    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def get_local_course_path(request):
    data = json.loads(request.body)
    cid = data["cid"]
    instance = Course_instance.nodes.get(cid=cid)
    course = Course.nodes.get(name=instance.name)

    response = []
    lable_list = []
    source_list = []
    target_list = []
    value_list = []
    incomings, cols = db.cypher_query(
        f"""MATCH (s)-[r:has_next]->(t) WHERE t.name='{course.name}' RETURN s.name,r.count"""
    )
    outgoings, cols = db.cypher_query(
        f"""MATCH (s)-[r:has_next]->(t) WHERE s.name='{course.name}' RETURN t.name,r.count"""
    )
    for item in incomings:
        source_list.append(item[0])
        target_list.append(course.name)
        value_list.append(item[1])
    for item in outgoings:
        source_list.append(course.name)
        target_list.append(item[0])
        value_list.append(item[1])
    lable_list = list(set(source_list+target_list))
    final_source = [lable_list.index(item) for item in source_list]
    final_target = [lable_list.index(item) for item in target_list]

    response = [{"lableList": lable_list, "sourceList": final_source,
                 "targetList": final_target, "valueList": value_list}]
    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)
