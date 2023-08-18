from django.urls import path
from .views import *

urlpatterns = [
    # Courses
    path("courses/", get_all_courses, name="courses"),
    path(
        "studyprogram-courses/",
        get_courses_by_studyprogram,
        name="studyprogram-courses",
    ),
    path("user-courses/", get_courses_by_userInfo, name="user-courses"),
    path("course-detail/<str:id>/", get_courseInfo_by_id, name="course-detail"),
    path("enroll-course/", enroll_course, name="enroll-course"),
    path("unenroll-course/", unenroll_course, name="unenroll-course"),
    path("change-pass-state/", change_course_pass_state, name="change-pass-state"),
    path("pass-course/", pass_course, name="pass-course"),
    path("undo-pass/", undo_pass, name="undo-pass"),
    path("rate-course/", rate_course, name="rate-course"),
    path("add-blacklist/", add_to_blaclist, name="add-blacklist"),
    path("remove-blacklist/", remove_from_blaclist, name="remove-blacklist"),
    # Students
    path("new-student/", create_student, name="new-student"),
    path("update-student/", edit_student, name="update-student"),
    path("get-student/", get_student, name="get-student"),
    path(
        "student-current-courses/",
        show_student_current_courses,
        name="student-current-courses",
    ),
    path("student-semester/", get_student_semester, name="student-semester"),
    path("student-schedule/", show_whole_student_schedule, name="student-schedule"),
    path("student-info/", show_student_info, name="student-info"),
    path("student-blacklist/", show_blacklist_courses, name="student-blacklist"),
    path(
        "change-student-setting/", change_student_setting, name="change-student-setting"
    ),
    # Study program
    path("studyprograms/", get_all_studyprogram, name="studyprograms"),
    # Recommendations
    path("recommendations/", generate_recommendations, name="recommendations"),
    path("top-popular/", generate_top_popular, name="top-popular"),
    # KG related
    path("add-nodes/", write_nodes, name="add-nodes"),
    path("add-relations/", write_relationships, name="add-relations"),
    path("verify/", verify, name="verify"),
    path("map-and-normalize/", map_and_normalize, name="map-and-normalize"),
    path("build-graph/", build_grapgh, name="build-graph"),
    # Course path related
    path("all-course-path/", get_whole_course_path, name="all-course-path"),
    path("local-course-path/", get_local_course_path, name="local-course-path"),
]
