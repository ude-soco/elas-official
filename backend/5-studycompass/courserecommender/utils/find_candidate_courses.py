from courserecommender.models import *


def get_courses_from_similar_students(target_student, similar_student):
    course_list = []
    try:
        for candidate_course in similar_student.enroll.match(passed=True):
            course_list.append(candidate_course.name)
        for passed_course in target_student.enroll.match(passed=True):
            if passed_course.name in course_list:
                course_list.remove(passed_course.name)
        return course_list
    except Exception as e:
        print(e)


def get_courses_from_course_path(student):
    path_candidate_course_list = []
    passed_course_list = []
    try:
        for passed_instance in student.enroll.match(passed=True):
            passed_course_list.append(passed_instance.name)

        for passed_instance in student.enroll.match(passed=True):
            passed_course = Course.nodes.get(name=passed_instance.name)
            next_courses = passed_course.next.all()
            total_count = 0

            next_course_list = []
            for course in next_courses:
                name = course.name
                # if not name in passed_course_list:
                rel = passed_course.next.relationship(course)
                count = rel.count
                if not name in passed_course_list:
                    next_course_list.append({"course_name": name, "count": count})
                total_count += count
            for item in next_course_list:
                count = item["count"]
                item["possibility"] = count / total_count
            if len(next_course_list) != 0:
                path_candidate_course_list.append(next_course_list)
        return path_candidate_course_list

    except Exception as e:
        print(e)


def combine_course_list(student_course_list, path_course_list):
    combined_list = []
    try:
        for item in student_course_list:
            course_list = item["course_list"]
            combined_list.extend(course_list)
        for path_list in path_course_list:
            for item in path_list:
                combined_list.append(item["course_name"])
        unique_combined_list = list(set(combined_list))
        return unique_combined_list
    except Exception as e:
        print(e)


def filter_by_blacklist(student, candidate_list):
    blacklist = student.blacklist.all()
    for item in blacklist:
        for course in candidate_list:
            if course == item.name:
                candidate_list.remove(course)
    return candidate_list
