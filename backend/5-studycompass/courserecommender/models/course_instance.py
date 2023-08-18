from neomodel import (
    StructuredNode,
    StructuredRel,
    StringProperty,
    BooleanProperty,
    JSONProperty,
    ArrayProperty,
    FloatProperty,
    RelationshipTo,
    IntegerProperty,
)
from courserecommender.models.keyword import Keyword
from courserecommender.models.topic import Topic
from courserecommender.models.teacher import Teacher


class RelKeyword(StructuredRel):
    weight = FloatProperty()
    mapped = BooleanProperty()


class RelTopic(StructuredRel):
    normalized_weight = FloatProperty()
    weight = FloatProperty()


class Course_instance(StructuredNode):
    cid = StringProperty(required=True, unique_index=True)
    name = StringProperty(required=True)
    description = StringProperty()
    subject_type = StringProperty()
    semester = StringProperty()
    language = StringProperty()
    url = StringProperty()
    timetable = JSONProperty()
    embedding = ArrayProperty()
    sws = StringProperty()

    keyword = RelationshipTo(Keyword, "has_keyword", model=RelKeyword)
    topic = RelationshipTo(Topic, "has_topic", model=RelTopic)
    teacher = RelationshipTo(Teacher, "has_teacher")
