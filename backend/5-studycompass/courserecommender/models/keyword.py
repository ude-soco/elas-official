from neomodel import (
    StructuredNode,
    StringProperty,
    BooleanProperty,
    RelationshipTo,
)
from courserecommender.models.topic import Topic

# class RelMap(StructuredRel):
#     mapped = BooleanProperty()


class Keyword(StructuredNode):
    name = StringProperty()
    verified = BooleanProperty()

    map = RelationshipTo(Topic, "mapped_to")
