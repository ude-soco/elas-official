from django.urls import path
from .views import (
    courses,
    KG_building,
    students,
    recommendations,
    test,
    studyprogram,
    course_path,
)

# TODO: Optimization of the imports needed

urlpatterns = [
    # Course related
    path("courses/", courses.get_all_courses),
    path("studyprogram-courses/", courses.get_courses_by_studyprogram),
    path("user-courses/", courses.get_courses_by_userInfo),
    path("course-detail/<str:id>/", courses.get_courseInfo_by_id),
    path("enroll-course/", courses.enroll_course),
    path("unenroll-course/", courses.unenroll_course),
    path("change-pass-state/", courses.change_course_pass_state),
    path("pass-course/", courses.pass_course),
    path("undo-pass/", courses.undo_pass),
    path("rate-course/", courses.rate_course),
    path("add-blacklist/", courses.add_to_blaclist),
    path("remove-blacklist/", courses.remove_from_blaclist),
    #
    # Student related
    path("new-student/", students.add_new_student),
    path("get-student/", students.get_student),
    path("student-current-courses/", students.show_student_current_courses),
    path("student-semester/", students.get_student_semester),
    path("student-schedule/", students.show_whole_student_schedule),
    path("student-info/", students.show_student_info),
    path("student-blacklist/", students.show_blacklist_courses),
    path("change-student-setting/", students.change_student_setting),
    #
    # Study program related
    path("studyprograms/", studyprogram.get_all_studyprogram),
    path("semester-study-program-list/", studyprogram.get_semester_and_study_program_data),
    #
    # Recommendation related
    path("recommendations/", recommendations.generate_recommendations),
    path("top-popular/", recommendations.generate_top_popular),
    #
    # Knowledge graph related
    path("add-nodes/", KG_building.write_nodes),
    path("add-relations/", KG_building.write_relationships),
    path("verify/", KG_building.verify),
    path("map-and-normalize/", KG_building.map_and_normalize),
    path("build-graph/", KG_building.build_grapgh),
    #
    # Course path related
    path("all-course-path/", course_path.get_whole_course_path),
    path("studyprogram-course-path/", course_path.get_study_program_course_path),
    path("local-course-path/", course_path.get_local_course_path),
]
