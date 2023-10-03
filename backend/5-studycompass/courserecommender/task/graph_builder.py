import json
import os
import codecs
from tqdm import tqdm
from courserecommender.models import *
from courserecommender.utils import (
    verify_keyword,
    has_keyword_To_has_topic,
    normalize_has_topic,
)
from neomodel import clear_neo4j_database, db

elas_backend_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)

LECTURE_DATA = os.path.abspath(
    os.path.join(
        elas_backend_directory,
        "studycompass",
        "data",
        "merged_lecture_description.json",
    )
)
STUDY_PROGRAMS_DATA = os.path.abspath(
    os.path.join(elas_backend_directory, "studycompass", "data", "study_programs.json")
)
SEMESTER_DATA = os.path.abspath(
    os.path.join(elas_backend_directory, "courserecommender", "data", "semester.json")
)
OUTPUT_DATA = os.path.abspath(
    os.path.join(elas_backend_directory, "courserecommender", "data")
)


class KGBuilder(object):
    def __init__(self):
        super(KGBuilder, self).__init__()

        # entities
        self.course_instance = []
        self.study_programs = []
        self.professors = []
        self.keywords = []
        self.courses = []
        self.semester_data = []
        self.current_semester = ""

        # attributes of entity
        self.course_instance_infos = []
        self.study_program_infos = []
        # self.professor_infos = []
        self.keyword_infos = []
        # self.course_infos = []

        # relationships
        self.instance_has_key = []
        self.course_belongs_to_studyprogram = []
        self.instance_has_professor = []
        self.course_has_instance = []

    def extrac_studyprogram(self):
        print("extract info from study_program.json")
        with open(STUDY_PROGRAMS_DATA, "r", encoding="utf8") as s_file:
            studyprogram_data = json.load(s_file)
            for studyprogram_item in studyprogram_data:
                studyprogram_dict = {}
                studyprogram_dict["url"] = ""
                studyprogram_dict["id"] = ""
                studyprogram_dict["name"] = ""

                studyprogram_name = studyprogram_item["name"]
                studyprogram_dict["name"] = studyprogram_name
                self.study_programs.append(studyprogram_name)

                if "url" in studyprogram_item:
                    studyprogram_dict["url"] = studyprogram_item["url"]

                if "id" in studyprogram_item:
                    studyprogram_dict["id"] = studyprogram_item["id"]

                self.study_program_infos.append(studyprogram_dict)

    def extrac_triples(self):
        print("extract info from merged_data.json")
        with open(LECTURE_DATA, "r", encoding="utf8") as f:
            course_data = json.loads(f.read())
            self.current_semester = course_data[0]["semester"]
            for lecture_item in course_data:
                lecture_dict = {}  # temporary storage of each course attributes
                lecture_dict["url"] = ""
                lecture_dict["id"] = ""
                lecture_dict["subject_type"] = ""
                lecture_dict["semester"] = ""
                lecture_dict["language"] = ""
                lecture_dict["timetable"] = []
                lecture_dict["description"] = ""

                keywords_dict = {}
                instance_node = {}

                lecture_name = lecture_item["name"]
                lecture_id = lecture_item["id"]

                self.courses.append(lecture_name)

                instance_node["id"] = lecture_id
                instance_node["name"] = lecture_name
                instance_node["semester"] = lecture_item["semester"]
                self.course_instance.append(instance_node)
                self.course_has_instance.append(
                    [lecture_name, "has_instance", lecture_id]
                )

                lecture_dict["name"] = lecture_name

                if "url" in lecture_item:
                    lecture_dict["url"] = lecture_item["url"]

                if "id" in lecture_item:
                    lecture_dict["id"] = lecture_item["id"]

                if "subject_type" in lecture_item:
                    lecture_dict["subject_type"] = lecture_item["subject_type"]

                if "semester" in lecture_item:
                    lecture_dict["semester"] = lecture_item["semester"]

                if "language" in lecture_item:
                    lecture_dict["language"] = lecture_item["language"]

                if "timetable" in lecture_item:
                    lecture_dict["timetable"] = lecture_item["timetable"]

                if "description" in lecture_item:
                    lecture_dict["description"] = lecture_item["description"]

                if "root_id" in lecture_item:
                    for r_id in lecture_item["root_id"]:
                        for i in range(len(self.study_program_infos)):
                            if r_id in self.study_program_infos[i]["id"]:
                                self.course_belongs_to_studyprogram.append(
                                    [
                                        lecture_name,
                                        "belongs_to",
                                        self.study_program_infos[i]["name"],
                                    ]
                                )

                if "persons" in lecture_item:
                    for person in lecture_item["persons"]:
                        if "name" in person:
                            self.professors.append(person["name"])
                            self.instance_has_professor.append(
                                [lecture_id, "has_professor", person["name"]]
                            )

                if "keywords" in lecture_item:
                    keywords_list = []
                    for keyword in lecture_item["keywords"]:
                        self.keywords.append(keyword["text"])
                        self.instance_has_key.append(
                            [lecture_id, "has_key", keyword["text"], keyword["value"]]
                        )
                        keywords_list.append([keyword["text"], keyword["value"]])

                    keywords_dict["id"] = lecture_id
                    keywords_dict["name"] = lecture_name
                    keywords_dict["keywords"] = keywords_list

                self.course_instance_infos.append(lecture_dict)
                self.keyword_infos.append(keywords_dict)

    def update_semester_data(self):
        with open(SEMESTER_DATA, "r", encoding="utf8") as f:
            semester_data = json.loads(f.read())
        # check if semester is already extracted
        if not self.current_semester in semester_data:
            # semester_data.append({"name": self.current_semester})
            semester_data.insert(0, {"name": self.current_semester})
            self.semester_data = semester_data

    def add_studyprograms(self):
        print("add studyprogram entity")
        for item in self.study_program_infos:
            try:
                if not Study_program.nodes.get_or_none(name=item["name"]):
                    studyprogram = Study_program(
                        name=item["name"], url=item["url"], r_id=item["id"]
                    )
                    studyprogram.save()
            except Exception as e:
                print("add studyprogram error", e)

    def add_keywords(self):
        print("add keyword entity")
        for item in self.keywords:
            try:
                if not Keyword.nodes.get_or_none(name=item.replace("|", "")):
                    keyword = Keyword(name=item.replace("|", ""), verified=False)
                    keyword.save()
            except Exception as e:
                print("add keyword error", e)

    def add_teachers(self):
        print("add teacher entity")
        for item in self.professors:
            try:
                if not Teacher.nodes.get_or_none(name=item):
                    teacher = Teacher(name=item)
                    teacher.save()
            except Exception as e:
                print("add teacher error", e)

    def add_courses(self):
        print("add course entity")
        for item in self.courses:
            try:
                if not Course.nodes.get_or_none(name=item):
                    course = Course(name=item)
                    course.save()
                    # print(course)
            except Exception as e:
                print("add course error", e)

    def add_instances(self):
        print("add course instance entity")
        for item in self.course_instance_infos:
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

    def write_node(self):
        self.add_studyprograms()
        self.add_keywords()
        self.add_teachers()
        self.add_courses()
        self.add_instances()

    def write_belongs_to(self):
        belongs_to_data = self.course_belongs_to_studyprogram
        print("write {0} relationship".format(belongs_to_data[0][1]))
        for head, relation, tail in tqdm(belongs_to_data, ncols=80):
            try:
                course = Course.nodes.get(name=head)
                studyprogram = Study_program.nodes.get(name=tail)
                course.belongs.connect(studyprogram)
            except Exception as e:
                print("add belongs_to error", e)

    def write_has_instance(self):
        has_instance_data = self.course_has_instance
        print("write {0} relationship".format(has_instance_data[0][1]))
        for head, relation, tail in tqdm(has_instance_data, ncols=80):
            try:
                course = Course.nodes.get(name=head)
                instance = Course_instance.nodes.get(cid=tail)
                course.instance.connect(instance)
            except Exception as e:
                print("add has_instance error", e)

    def write_has_keyword(self):
        has_keyword_data = self.instance_has_key
        print("write {0} relationship".format(has_keyword_data[0][1]))
        for head, relation, tail, weight in tqdm(has_keyword_data, ncols=80):
            try:
                instance = Course_instance.nodes.get(cid=head)
                keyword = Keyword.nodes.get(name=tail.replace("|", ""))
                instance.keyword.connect(keyword, {"weight": weight})
            except Exception as e:
                print("add has_keyword error", e)

    def write_has_teacher(self):
        has_teacher_data = self.instance_has_professor
        print("write {0} relationship".format(has_teacher_data[0][1]))
        for head, relation, tail in tqdm(has_teacher_data, ncols=80):
            try:
                instance = Course_instance.nodes.get(cid=head)
                teacher = Teacher.nodes.get(name=tail)
                instance.teacher.connect(teacher)
            except Exception as e:
                print("add has_teacher error", e)

    def write_relationships(self):
        self.write_belongs_to()
        self.write_has_instance()
        self.write_has_keyword()
        self.write_has_teacher()

    # def KGbuilding(self):
    #     self.write_node()
    #     self.write_relationships()
    #     verify_keyword()
    #     has_keyword_To_has_topic()
    #     normalize_has_topic()

    def export_data(self, data, path):
        print("export data")
        # if isinstance(data[0], str):
        #     data = sorted([d.strip("...") for d in set(data)])
        with codecs.open(OUTPUT_DATA + path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    def export_entities_relationships(self):
        self.export_data(self.course_instance_infos, "/course_instance_infos.json")
        self.export_data(self.courses, "/courses.json")
        self.export_data(self.keywords, "/keywords.json")
        self.export_data(self.study_program_infos, "/study_program_infos.json")
        self.export_data(self.professors, "/professors.json")

        self.export_data(self.instance_has_key, "/instance_has_key.json")
        self.export_data(self.instance_has_professor, "/instance_has_professor.json")
        self.export_data(self.course_has_instance, "/course_has_instance.json")
        self.export_data(
            self.course_belongs_to_studyprogram, "/course_belongs_to_studyprogram.json"
        )
        self.export_data(self.semester_data, "/semester.json")

    def run(self):
        # db.set_connection("bolt://neo4j:123456@127.0.0.1:7687")
        # Clear the graph
        # clear_neo4j_database(db)
        self.extrac_studyprogram()  # extract study program information
        self.extrac_triples()  # extract lecture information
        # self.update_semester_data()
        print("{} lecture entities extracted, ".format(len(self.course_instance)))
        print("{} study_program entities extracted, ".format(len(self.study_programs)))
        print("{} keyword entities extracted, ".format(len(self.keywords)))
        print("{} professor entities extracted, ".format(len(self.professors)))

        self.write_node()
        self.write_relationships()
        verify_keyword()
        has_keyword_To_has_topic()
        normalize_has_topic()

        self.export_entities_relationships()
