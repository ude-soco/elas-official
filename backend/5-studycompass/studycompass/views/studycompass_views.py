from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from courserecommender.models.study_program import Study_program
import os
import json

from ..models import *

semester_directory = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "courserecommender",
        "data",
        "semester.json",
    )
)
study_program_directory = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "courserecommender",
        "data",
        "study_program_infos.json",
    )
)


@api_view(["GET"])
def get_semester_and_study_program_data(request):
    with open(semester_directory) as f_1:
        semester_data = json.load(f_1)
    # with open(study_program_directory) as f_2:
    #     study_program_data = json.load(f_2)
    study_program_data = []
    studyprograms = Study_program.nodes.all()
    print(studyprograms)
    for studyprogram in studyprograms:
        study_program_data.append(
            {"id": studyprogram.r_id, "name": studyprogram.name, "url": studyprogram.url})

    return JsonResponse(
        {
            "message": {
                "semester_data": semester_data,
                "study_programs": study_program_data,
            }
        },
        status=status.HTTP_200_OK,
    )

@api_view(["GET"])
def get_studyprograms(request):
    all_studyprograms = StudyProgram.objects.all()
    result = []

    for studyprogram in all_studyprograms:
        lectures = Lecture.objects.filter(
            lecture_studyprogram__studyprogram=studyprogram
        )
        seminar, vorlesung, vorlesung_uebung, uebung = 0, 0, 0, 0

        for lecture in lectures:
            if len(lecture.sws.strip()) > 0:
                if lecture.subject_type == "Vorlesung":
                    vorlesung += int(lecture.sws)
                elif lecture.subject_type == "Seminar":
                    seminar += int(lecture.sws)
                elif lecture.subject_type == "Vorlesung/Übung":
                    vorlesung_uebung += int(lecture.sws)
                elif lecture.subject_type == "Übung":
                    uebung += int(lecture.sws)

        result.append(
            {
                "id": studyprogram.id,
                "name": studyprogram.name,
                "url": studyprogram.url,
                "stats": {
                    "Vorlesung": vorlesung,
                    "Vorlesung/Übung": vorlesung_uebung,
                    "Übung": uebung,
                    "Seminar": seminar,
                },
            }
        )

    return JsonResponse({"message": result}, safe=False, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_lecture_with_id(request):
    lecture_id = request.GET.get("id")
    lecture = Lecture.objects.filter(id=lecture_id).first()
    if not lecture:
        return JsonResponse(
            {"error": "Lecture not found"}, status=status.HTTP_404_NOT_FOUND
        )

    professors = [
        {"name": professor.name, "url": professor.url}
        for professor in lecture.professors.all()
    ]

    study_programs = [
        {"name": studyprogram.name, "url": studyprogram.url}
        for studyprogram in StudyProgram.objects.filter(
            lecture_studyprogram__lecture=lecture
        )
    ]

    timetables = [
        {
            "id": timetable.id,
            "comment": timetable.comment,
            "day": timetable.day,
            "duration": {"from": timetable.duration_from, "to": timetable.duration_to},
            "elearn": timetable.elearn,
            "rhythm": timetable.rhythm,
            "room": timetable.room,
            "dates": timetable.dates,
            "status": timetable.status,
            "time": {"from": timetable.time_from, "to": timetable.time_to},
        }
        for timetable in lecture.timetables.all()
    ]

    response = {
        "id": lecture.id,
        "url": lecture.url,
        "name": lecture.name,
        "subject_type": lecture.subject_type,
        "sws": lecture.sws,
        "longtext": lecture.longtext,
        "shorttext": lecture.shorttext,
        "language": lecture.language,
        "description": lecture.description,
        "keywords": lecture.keywords,
        "professors": professors,
        "study_programs": study_programs,
        "timetables": timetables,
    }

    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_lectures_with_id(request, id):
    studyprogram = get_object_or_404(StudyProgram, id=id)
    lectures = studyprogram.lectures.all()  # type: ignore

    response = []

    for lecture in lectures:
        lecture_professors = lecture.professors.all()
        professors = [
            {"name": professor.name, "url": professor.url}
            for professor in lecture_professors
        ]

        lecture_studyprograms = lecture.root_id.all()
        study_programs = [
            {"name": studyprogram.name, "url": studyprogram.url}
            for studyprogram in lecture_studyprograms
        ]

        timetables = lecture.timetables.all()
        timetables_extended = [
            {
                "id": timetable.id,
                "comment": timetable.comment,
                "day": timetable.day,
                "duration": {
                    "from": timetable.duration_from,
                    "to": timetable.duration_to,
                },
                "elearn": timetable.elearn,
                "rhythm": timetable.rhythm,
                "room": timetable.room,
                "dates": timetable.dates,
                "status": timetable.status,
                "time": {"from": timetable.time_from, "to": timetable.time_to},
            }
            for timetable in timetables
        ]

        response.append(
            {
                "id": lecture.id,
                "url": lecture.url,
                "name": lecture.name,
                "subject_type": lecture.subject_type,
                "sws": lecture.sws,
                "longtext": lecture.longtext,
                "shorttext": lecture.shorttext,
                "language": lecture.language,
                "description": lecture.description,
                "keywords": lecture.keywords,
                "professors": professors,
                "study_programs": study_programs,
                "timetable": timetables_extended,
            }
        )

    return JsonResponse({"message": response}, safe=False, status=status.HTTP_200_OK)
