from courserecommender.models import *
import os
import json

data_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
STUDY_PROGRAMS_DATA = os.path.abspath(
    os.path.join(data_directory, "study_program_infos.json")
)
KEYWORD_DATA = os.path.abspath(os.path.join(data_directory, "keywords.json"))
TEACHER_DATA = os.path.abspath(os.path.join(data_directory, "professors.json"))
COURSE_DATA = os.path.abspath(os.path.join(data_directory, "courses.json"))
INSTANCE_DATA = os.path.abspath(
    os.path.join(data_directory, "course_instance_infos.json")
)


def add_studyprograms():
    with open(STUDY_PROGRAMS_DATA, "r", encoding="utf8") as file:
        studyprogram_data = json.load(file)
    print("add studyprogram entity")
    for item in studyprogram_data:
        try:
            if not Study_program.nodes.get_or_none(name=item["name"]):
                studyprogram = Study_program(
                    name=item["name"], url=item["url"], r_id=item["id"]
                )
                studyprogram.save()
        except Exception as e:
            print("add studyprogram error", e)


def add_keywords():
    with open(KEYWORD_DATA, "r", encoding="utf8") as file:
        keyword_data = json.load(file)
    print("add keyword entity")
    for item in keyword_data:
        try:
            if not Keyword.nodes.get_or_none(name=item.replace("|", "")):
                keyword = Keyword(name=item.replace("|", ""), verified=False)
                keyword.save()
        except Exception as e:
            print("add keyword error", e)


def add_teachers():
    with open(TEACHER_DATA, "r", encoding="utf8") as file:
        teacher_data = json.load(file)
    print("add teacher entity")
    for item in teacher_data:
        try:
            if not Teacher.nodes.get_or_none(name=item):
                teacher = Teacher(name=item)
                teacher.save()
        except Exception as e:
            print("add teacher error", e)


def add_courses():
    with open(COURSE_DATA, "r", encoding="utf8") as file:
        course_data = json.load(file)
    print("add course entity")
    for item in course_data:
        try:
            if not Course.nodes.get_or_none(name=item):
                course = Course(name=item)
                course.save()
                # print(course)
        except Exception as e:
            print("add course error", e)


def add_instances():
    with open(INSTANCE_DATA, "r", encoding="utf8") as file:
        instance_data = json.load(file)
    print("add course instance entity")
    for item in instance_data:
        try:
            if not Course_instance.nodes.get_or_none(cid=item["id"]):
                course_instance = Course_instance(
                    cid=item["id"],
                    name=item["name"],
                    description=item["description"],
                    subject_type=item["subject_type"],
                    semester=item["semester"],
                    language=item["language"],
                    url=item["url"],
                    timetable=item["timetable"],
                )
                course_instance.save()
        except Exception as e:
            print("add instance error", e)
