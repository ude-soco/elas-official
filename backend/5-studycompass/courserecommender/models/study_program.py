from neomodel import (
    StructuredNode,
    StringProperty,
)


class Study_program(StructuredNode):
    name = StringProperty()
    r_id = StringProperty()
    url = StringProperty()
