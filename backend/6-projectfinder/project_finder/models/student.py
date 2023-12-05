from neomodel import StructuredNode, StringProperty, RelationshipTo, RelationshipFrom

class Student(StructuredNode):
    uid = StringProperty(unique_index=True)
    name = StringProperty(required=True)
    username = StringProperty(required=True)