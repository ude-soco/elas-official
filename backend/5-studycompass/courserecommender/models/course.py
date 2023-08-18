from neomodel import (
    StructuredNode,
    StructuredRel,
    StringProperty,
    IntegerProperty,
    RelationshipTo,
)
from courserecommender.models.study_program import Study_program
from courserecommender.models.course_instance import Course_instance


class relNext(StructuredRel):
    count = IntegerProperty()


class Course(StructuredNode):
    name = StringProperty(unique_index=True)
    passed_number = IntegerProperty()

    belongs = RelationshipTo(Study_program, "belongs_to")
    instance = RelationshipTo(Course_instance, "has_instance")
    next = RelationshipTo("Course", "has_next", model=relNext)
