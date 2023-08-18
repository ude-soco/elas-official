from neomodel import StructuredNode, StringProperty, ArrayProperty


class Topic(StructuredNode):
    name = StringProperty()
    summary = StringProperty()
    url = StringProperty()
    embedding = ArrayProperty()
