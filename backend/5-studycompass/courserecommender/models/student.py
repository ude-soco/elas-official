from neomodel import (
    StructuredNode,
    StructuredRel,
    StringProperty,
    ArrayProperty,
    JSONProperty,
    BooleanProperty,
    DateTimeFormatProperty,
    RelationshipTo,
)
from courserecommender.models.course_instance import Course_instance
from courserecommender.models.study_program import Study_program
from courserecommender.models.course import Course


class relEnroll(StructuredRel):
    enroll_semester = StringProperty(required=True)
    selected_time = ArrayProperty()
    passed = BooleanProperty()
    ratings = ArrayProperty()
    ratings_last_updated = DateTimeFormatProperty(format="%Y-%m-%d %H:%M:%S")


class Student(StructuredNode):
    uid = StringProperty(unique_index=True)  # use the uid to query student
    username = StringProperty(required=True)  # change to username
    study_program = StringProperty(required=True)
    start_semester = StringProperty(required=True)
    current_semester = StringProperty()
    embedding = ArrayProperty()
    setting = JSONProperty()

    enroll = RelationshipTo(Course_instance, "enrolled_in", model=relEnroll)
    study = RelationshipTo(Study_program, "study_in")
    blacklist = RelationshipTo(Course, "in_blacklist")
    passed = RelationshipTo(Course, "has_passed")
