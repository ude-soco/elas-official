from courserecommender.models import *
from courserecommender.models import *
import json
import os


data_directory = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "..", "data"))
SEMESTER_DATA = os.path.abspath(
    os.path.join(
        data_directory, "semester.json"
    )
)


def all_has_next():
    with open(SEMESTER_DATA, "r", encoding="utf8") as file:
        semester_data = json.load(file)
    all_students = Student.nodes.all()
    for student in all_students:
        previous_courses = []
        start_semester = {"name": student.start_semester}
        # get index of semester
        start_index = semester_data.index(start_semester)
        # all experienced semesters
        experienced_semesters = semester_data[start_index:]
        for item in experienced_semesters:
            semester = item["name"]
            current_courses = []
            # get courses enolled in semester
            for course in student.enroll.match(enroll_semester=semester, passed=True):
                current_courses.append(course.cid)
            if len(previous_courses) > 0:
                for start_item in previous_courses:
                    start_instance = Course_instance.nodes.get(cid=start_item)
                    start_course = Course.nodes.get(name=start_instance.name)
                    for end_item in current_courses:
                        end_instance = Course_instance.nodes.get(cid=end_item)
                        end_course = Course.nodes.get(name=end_instance.name)
                        if start_course.next.is_connected(end_course):
                            next_rel = start_course.next.relationship(
                                end_course)
                            next_rel.count = next_rel.count+1
                            next_rel.save()
                        else:
                            start_course.next.connect(end_course, {"count": 1})
                        print(start_course.name, "has next", end_course.name)
            previous_courses = current_courses


def add_has_next(student, course):
    with open(SEMESTER_DATA, "r", encoding="utf8") as file:
        semester_data = json.load(file)
    try:
        passed_semester = {"name": course.semester}
        # get course from the passed course instance
        course_node = Course.nodes.get(name=course.name)
        # get index of semester
        passed_index = semester_data.index(passed_semester)
        # check if it is not the first semester,
        # no has_next relationship connected to course in first semester
        if not passed_index == 0:
            previous_semester = semester_data[passed_index-1]
            for instance in student.enroll.match(enroll_semester=previous_semester['name'], passed=True):
                previous_course_node = Course.nodes.get(name=instance.name)
                print('pre:', previous_course_node.name)
                if previous_course_node.next.is_connected(course_node):
                    next_rel = previous_course_node.next.relationship(
                        course_node)
                    next_rel.count = next_rel.count+1
                    next_rel.save()
                else:
                    previous_course_node.next.connect(
                        course_node, {"count": 1})
        # check if it is not the last semester,
        # course in last semester dose not have has_next relationship
        if not passed_index == len(semester_data)-1:
            next_semester = semester_data[passed_index+1]
            for instance in student.enroll.match(enroll_semester=next_semester['name'], passed=True):
                next_course_node = Course.nodes.get(name=instance.name)
                print('next:', next_course_node.name)
                if course_node.next.is_connected(next_course_node):
                    next_rel = course_node.next.relationship(
                        next_course_node)
                    next_rel.count = next_rel.count+1
                    next_rel.save()
                else:
                    course_node.next.connect(next_course_node, {"count": 1})
    except Exception as e:
        print(e)


def delete_has_next(student, course):
    with open(SEMESTER_DATA, "r", encoding="utf8") as file:
        semester_data = json.load(file)
    try:
        current_semester = {"name": course.semester}
        # get course from the course instance
        course_node = Course.nodes.get(name=course.name)
        # get index of semester
        current_index = semester_data.index(current_semester)
        # check if it is not the first semester,
        # no has_next relationship connected to course in first semester
        if not current_index == 0:
            previous_semester = semester_data[current_index-1]
            for instance in student.enroll.match(enroll_semester=previous_semester['name'], passed=True):
                previous_course_node = Course.nodes.get(name=instance.name)
                print('pre:', previous_course_node.name)
                next_rel = previous_course_node.next.relationship(course_node)
                if next_rel.count > 1:
                    next_rel.count = next_rel.count-1
                    next_rel.save()
                else:
                    previous_course_node.next.disconnect(
                        course_node)
        # check if it is not the last semester,
        # course in last semester dose not have has_next relationship
        if not current_index == len(semester_data)-1:
            next_semester = semester_data[current_index+1]
            for instance in student.enroll.match(enroll_semester=next_semester['name'], passed=True):
                next_course_node = Course.nodes.get(name=instance.name)
                print('next:', next_course_node.name)
                next_rel = course_node.next.relationship(next_course_node)
                if next_rel.count > 1:
                    next_rel.count = next_rel.count-1
                    next_rel.save()
                else:
                    course_node.next.disconnect(next_course_node)
    except Exception as e:
        print(e)
