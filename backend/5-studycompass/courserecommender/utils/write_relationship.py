from courserecommender.models import *
import os
import json
from tqdm import tqdm

data_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
BELONGS_TO_DATA = os.path.abspath(
    os.path.join(data_directory, "course_belongs_to_studyprogram.json")
)
HAS_INSTANCE_DATA = os.path.abspath(
    os.path.join(data_directory, "course_has_instance.json")
)
HAS_KEYWORD_DATA = os.path.abspath(
    os.path.join(data_directory, "instance_has_key.json")
)
HAS_TEACHER_DATA = os.path.abspath(
    os.path.join(data_directory, "instance_has_professor.json")
)


def write_belongs_to():
    with open(BELONGS_TO_DATA, "r", encoding="utf8") as file:
        belongs_to_data = json.load(file)
    print("write {0} relationship".format(belongs_to_data[0][1]))
    for head, relation, tail in tqdm(belongs_to_data, ncols=80):
        try:
            course = Course.nodes.get(name=head)
            studyprogram = Study_program.nodes.get(name=tail)
            course.belongs.connect(studyprogram)
        except Exception as e:
            print("add belongs_to error", e)


def write_has_instance():
    with open(HAS_INSTANCE_DATA, "r", encoding="utf8") as file:
        has_instance_data = json.load(file)
    print("write {0} relationship".format(has_instance_data[0][1]))
    for head, relation, tail in tqdm(has_instance_data, ncols=80):
        try:
            course = Course.nodes.get(name=head)
            instance = Course_instance.nodes.get(cid=tail)
            course.instance.connect(instance)
        except Exception as e:
            print("add has_instance error", e)


def write_has_keyword():
    with open(HAS_KEYWORD_DATA, "r", encoding="utf8") as file:
        has_keyword_data = json.load(file)
    print("write {0} relationship".format(has_keyword_data[0][1]))
    for head, relation, tail, weight in tqdm(has_keyword_data, ncols=80):
        try:
            instance = Course_instance.nodes.get(cid=head)
            keyword = Keyword.nodes.get(name=tail.replace("|", ""))
            instance.keyword.connect(keyword, {"weight": weight})
        except Exception as e:
            print("add has_keyword error", e)


def write_has_teacher():
    with open(HAS_TEACHER_DATA, "r", encoding="utf8") as file:
        has_teacher_data = json.load(file)
    print("write {0} relationship".format(has_teacher_data[0][1]))
    for head, relation, tail in tqdm(has_teacher_data, ncols=80):
        try:
            instance = Course_instance.nodes.get(cid=head)
            teacher = Teacher.nodes.get(name=tail)
            instance.teacher.connect(teacher)
        except Exception as e:
            print("add has_teacher error", e)
