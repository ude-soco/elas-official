from courserecommender.models import *
import json
from courserecommender.utils import get_similar_students, get_courses_from_similar_students, get_courses_from_course_path, combine_course_list, filter_by_blacklist
from courserecommender.utils.caculate_impact_factors_weight import *


def generate_recommendations(student):
    try:
        # data = json.loads(request.body)
        # student = Student.nodes.get(username=data["username"])
        # 1. get similar student list
        if student.embedding:
            candidate_similar_list = Student.nodes.filter(
                study_program=student.study_program)
            # candidate_similar_list, cols = db.cypher_query(
            #     f'MATCH (n:Student) where n.study_program="{student.study_program}" return n '
            # )
            similar_list = get_similar_students(
                student, candidate_similar_list)
            # 2. get candidate course list from similar students
            student_candidate_course_list = []
            for item in similar_list:
                student_name = item["name"]
                student_similarity = item["similarity"]
                similar_student = Student.nodes.get(username=student_name)
                course_list = get_courses_from_similar_students(
                    student, similar_student)
                student_candidate_course_list.append(
                    {"course_list": course_list, "name": student_name, "similarity": student_similarity})

            # 3. get candidate course list from learning path
            path_candidate_course_list = get_courses_from_course_path(
                student)

            # 4. combine candidate course list
            combined_candidate_list = combine_course_list(
                student_candidate_course_list, path_candidate_course_list)

            # 5. filter candidate course list
            filtered_candidate_list = filter_by_blacklist(
                student, combined_candidate_list)

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
                total_weight = u_weight + lp_weight + es_weight+ps_weight+pr_weight
                # print(u_weight, lp_weight, es_weight, ps_weight, pr_weight)
                # print(total_weight)
                weighted_candidate_list.append(
                    {"name": candidate, "weight": total_weight})
            ranked_candidate_list = sorted(
                weighted_candidate_list, key=lambda x: x["weight"], reverse=True)
            # 7. top 10 as recommendations
            recommendation_list = ranked_candidate_list[:10]
            return recommendation_list
    except Exception as e:
        print(e)


# def generate_top_popular(studyprogram):
#     # data = json.loads(request.body)
#     # studyprogram = data["studyprogram"]
#     matched_courses = []
#     courses, cols = db.cypher_query(
#         f"""MATCH (c)-[r:belongs_to]->(s) where s.name="{studyprogram}" and c.passed_number>0 return c""")
#     for course in courses:
#         node = course[0]
#         matched_courses.append(
#             {"name": node["name"], "number": node["passed_number"]})
#     popular_list = sorted(
#         matched_courses, key=lambda x: x["number"], reverse=True)[:10]
#     return popular_list

def generate_top_popular(student):
    # data = json.loads(request.body)
    # studyprogram = data["studyprogram"]
    matched_courses = []
    courses, cols = db.cypher_query(
        f"""MATCH (c)-[r:belongs_to]->(s) where s.name="{student.study_program}" and c.passed_number>0 return c""")
    for item in courses:
        node = item[0]
        course = Course.nodes.get(name=node["name"])
        passed_weight = enrolled_student_weight(student, course)
        percentage_value = passed_weight*100
        percentage = f"{percentage_value:.2f}%"
        if (node["passed_number"] > 2):
            matched_courses.append(
                {"name": node["name"], "passed_number": node["passed_number"], "passed_percentage": percentage})
    popular_list = sorted(
        matched_courses, key=lambda x: x["passed_number"], reverse=True)[:10]
    return popular_list


def get_course_ratings(node):
    try:
        total_rating_list = []
        ratings, cols = db.cypher_query(
            f"""MATCH p=()-[r:enrolled_in]->(i)  where i.name='{node["name"]}' and r.ratings is not null RETURN r.ratings"""
        )
        for item in ratings:
            rating_list = item[0]
            for rating in rating_list:
                if not any(object["rating"] == rating for object in total_rating_list):
                    total_rating_list.append({"rating": rating, "count": 1})
                else:
                    for object in total_rating_list:
                        if object["rating"] == rating:
                            count = object["count"]
                            new_count = count+1
                            object["count"] = new_count
        final_list = sorted(
            total_rating_list, key=lambda x: x["count"], reverse=True)[:3]
        return final_list
    except Exception as e:
        print(
            f"""MATCH p=()-[r:enrolled_in]->(i)  where i.name='{node["name"]}' and r.ratings is not null RETURN r.ratings""")
        print(e)
        return []
