from django.http import HttpResponse, JsonResponse
from courserecommender.utils import *
from ..task.graph_builder import KGBuilder


def write_nodes(request):
    try:
        add_studyprograms()
        add_keywords()
        add_teachers()
        add_courses()
        add_instances()
    except:
        response = {"error": "Error occurred in write nodes"}
        return JsonResponse(response, safe=False)

    return HttpResponse("add nodes success")


def write_relationships(request):
    try:
        write_belongs_to()
        write_has_instance()
        write_has_keyword()
        write_has_teacher()
    except:
        response = {"error": "Error occurred in write relationships"}
        return JsonResponse(response, safe=False)
    return HttpResponse("add relationship success")


def verify(request):
    try:
        verify_keyword()
    except:
        response = {"error": "Error occurred in verifacation"}
        return JsonResponse(response, safe=False)
    return HttpResponse("verification success")


def map_and_normalize(request):
    try:
        has_keyword_To_has_topic()
        normalize_has_topic()
    except:
        response = {"error": "Error occurred in map_and_normalize"}
        return JsonResponse(response, safe=False)
    return HttpResponse("maping and nomalization success")


def build_grapgh(request):
    # write_nodes(request)
    # write_relationships(request)
    # verify(request)
    # map_and_normalize(request)
    build = KGBuilder()
    build.run()
    return HttpResponse("graph building success")
