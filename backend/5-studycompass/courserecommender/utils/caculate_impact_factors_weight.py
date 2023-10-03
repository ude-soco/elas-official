from courserecommender.models import *
from neomodel import db


def enrolled_student_weight(student, course):
    try:
        students_list = Student.nodes.filter(study_program=student.study_program)
        total_count = len(students_list)
        instance_list = course.instance.all()
        instance_count = len(instance_list)
        enrolled_count = 0
        for instance in instance_list:
            for student in students_list:
                if student.enroll.is_connected(instance):
                    enrolled_count += 1
        es_weight = (enrolled_count / total_count) / instance_count
        return es_weight
    except Exception as e:
        print("line 20", e)


def passed_student_weight(course):
    try:
        # enrolled_count = len(Student.nodes.all())
        enrolled_number, cols = db.cypher_query(
            f"""MATCH p=(s)-[r:enrolled_in]->(n) where n.name="{course.name}" RETURN count(s)"""
        )
        enrolled_count = enrolled_number[0][0]
        passed_count = course.passed_number
        ps_weight = passed_count / enrolled_count
        return ps_weight
    except Exception as e:
        print("line 30", e)
        print("line 31", course, enrolled_count, passed_count)


def positive_rating_weight(course):
    try:
        instance_list = course.instance.all()
        instance_count = 0
        weight_sum = 0
        for instance in instance_list:
            # quotes "" are required!! instance.cid is int, for query we need string
            # query passed enroll rel
            passed_results, cols = db.cypher_query(
                f"""MATCH (s)-[r:enrolled_in]-(c) WHERE c.cid ="{instance.cid}" AND r.passed=true RETURN r"""
            )
            # query passed and rated enroll rel
            rated_results, cols = db.cypher_query(
                f"""MATCH (s)-[r:enrolled_in]-(c) WHERE c.cid ="{instance.cid}" AND r.passed=true AND r.ratings IS NOT NULL RETURN r"""
            )
            if len(passed_results) > 0:
                instance_count += 1
                passed_count = len(passed_results)
                rated_count = len(rated_results)
                weight_sum += rated_count / passed_count
                # print(instance_count, passed_cou   nt, rated_count, weight_sum)
        pr_weight = weight_sum / instance_count
        # print(instance_count, weight_sum, pr_weight)
        return pr_weight
    except Exception as e:
        print("line 57", e)
        print("line 58", course)
